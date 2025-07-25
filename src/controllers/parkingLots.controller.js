import pool from '../config/db.js';
import { StatusCodes } from 'http-status-codes';

export const getAllParkingLots = async (req, res) => {
    const parkingLots = await pool.query('SELECT * FROM parking_lots');
    res.status(StatusCodes.OK).json({ parkingLots: parkingLots.rows });
}

export const getParkingSpots = async (req, res) => {
    const { lotId } = req.params;
    const parkingSpots = await pool.query('SELECT * FROM parking_spots WHERE parking_lot_id = $1', [lotId]);
    res.status(StatusCodes.OK).json({ parkingSpots: parkingSpots.rows });
}