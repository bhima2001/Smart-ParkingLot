import pool from '../config/db.js';
import { StatusCodes } from 'http-status-codes';
import { hasOverLappingReservations } from '../helpers/reservationHelper.js';

export const createReservation = async (req, res) => {
    const { userId, parkingSpotId, startTime, endTime } = req.body;
    if (startTime >= endTime || !userId || !parkingSpotId || !startTime || !endTime) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Start time must be before end time' });
        return;
    }

    // Use advisory lock to prevent concurrent reservations for the same parking spot and time
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const lockKey = BigInt(
            BigInt(parkingSpotId) * 1000000000000n +
            BigInt(Math.floor(new Date(startTime * 1000).getTime())) * 1000000n +
            BigInt(Math.floor(new Date(endTime * 1000).getTime()))
        );

        await client.query(
            'SELECT pg_advisory_xact_lock($1::BIGINT)',
            [lockKey.toString()]
        );

        // Check for overlapping reservations
        const hasOverlap = await hasOverLappingReservations(client, parkingSpotId, startTime, endTime);
        // If there are overlapping reservations, return a conflict error
        if (hasOverlap) {
            await client.query('ROLLBACK');
            res.status(StatusCodes.CONFLICT).json({ message: 'Parking spot is already reserved for the selected time range' });
            return;
        }

        const reservation = await client.query(
            'INSERT INTO reservations (user_id, parking_spot_id, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, parkingSpotId, new Date(startTime * 1000), new Date(endTime * 1000), 'reserved']
        );
        await client.query('COMMIT');
        res.status(StatusCodes.CREATED).json({ reservation: reservation.rows[0] });
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

export const cancelReservation = async (req, res) => {
    const { reservationId } = req.params;
    const { userId } = req.user;
    const reservation = await pool.query('SELECT * FROM reservations WHERE id = $1 and user_id = $2', [reservationId, userId]);
    if (reservation?.rows?.length === 0) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Reservation not found' });
        return;
    }
    if (reservation.rows[0]?.status === 'cancelled') {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Reservation already cancelled' });
        return;
    }
    const updatedReservation = await pool.query('UPDATE reservations SET status = $1 WHERE id = $2 and user_id = $3 RETURNING *', ['cancelled', reservationId, userId]);
    res.status(StatusCodes.OK).json({ reservation: updatedReservation.rows[0] });
}