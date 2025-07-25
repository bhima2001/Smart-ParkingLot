import pool from '../config/db.js';
import { StatusCodes } from 'http-status-codes';

export const getAvailableSpots = async (req, res) => {
    const { spotType, startTime, endTime, parkingLotIds } = req.query;

    let type = spotType && spotType !== '' ? spotType : null;
    let lotIds = parkingLotIds && parkingLotIds !== '' ? parkingLotIds : [];
    const parsedStart = new Date(startTime);
    const parsedEnd = new Date(endTime);

    // Generate 1-hour slots between start and end
    let slots = [];
    let curr = parsedStart;
    while (curr < parsedEnd) {
        let next = curr + 1000 * 60 * 60;
        slots.push({
            start: curr,
            end: next
        });
        curr = next;
    }

    // Get all available spots of the given type and lot (flexible filtering)
    let spotsQuery = `SELECT * FROM parking_spots WHERE deleted_at IS NULL`;
    let queryParams = [];
    let paramIdx = 1;
    if (type) {
        spotsQuery += ` AND spot_type = $${paramIdx++}`;
        queryParams.push(type);
    }
    if (Array.isArray(lotIds) && lotIds.length > 0) {
        spotsQuery += ` AND parking_lot_id = ANY($${paramIdx++})`;
        queryParams.push(lotIds.map(id => Number(id)));
    }
    const spotsResult = await pool.query(spotsQuery, queryParams);
    const allSpots = spotsResult.rows;

    // Get all reservations for these spots in the given time range
    const spotIds = allSpots.map(s => s.id);
    let reservedSpotsBySlot = {};

    if (spotIds.length > 0) {
        const reservationsQuery = `
                SELECT parking_spot_id, start_time, end_time
                FROM reservations
                WHERE parking_spot_id = ANY($1)
                AND status != 'cancelled'
                AND (
                    (start_time, end_time) OVERLAPS ($2::timestamp, $3::timestamp)
                )
            `;
        const reservationsResult = await pool.query(reservationsQuery, [spotIds, parsedStart, parsedEnd]);
        const reservations = reservationsResult.rows;

        // For each slot, find reserved spot ids
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            reservedSpotsBySlot[i] = new Set();
            for (const r of reservations) {
                // If reservation overlaps with slot
                if (
                    new Date(r.start_time).getTime() < slot.end &&
                    new Date(r.end_time).getTime() > slot.start
                ) {
                    reservedSpotsBySlot[i].add(r.parking_spot_id);
                }
            }
        }
    }

    // For each slot, get available spots (not reserved in that slot)
    const result = slots.map((slot, i) => {
        let reserved = reservedSpotsBySlot[i] || new Set();
        let available = allSpots.filter(s => !reserved.has(s.id));
        return {
            timeSlot: { start: slot.start, end: slot.end },
            availableSpots: available
        };
    });

    res.status(StatusCodes.OK).json({ slots: result });
}