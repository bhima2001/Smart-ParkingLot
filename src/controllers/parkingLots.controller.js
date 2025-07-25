import pool from '../config/db.js';
import { StatusCodes } from 'http-status-codes';

export const getAllParkingLots = async (_req, res) => {
    const parkingLots = await pool.query('SELECT * FROM parking_lots');
    res.status(StatusCodes.OK).json({ parkingLots: parkingLots.rows });
}

export const getParkingSpots = async (req, res) => {
    const { lotId } = req.params;
    const parkingSpots = await pool.query('SELECT * FROM parking_spots WHERE parking_lot_id = $1', [lotId]);
    if (parkingSpots?.rows?.length === 0) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Parking Lot not found' });
        return;
    }
    res.status(StatusCodes.OK).json({ parkingSpots: parkingSpots.rows });
}