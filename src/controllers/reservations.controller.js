import pool from '../config/db.js';
import { StatusCodes } from 'http-status-codes';

export const createReservation = async (req, res) => {
    const { userId, parkingSpotId, startTime, endTime, status } = req.body;
    const reservation = await pool.query('INSERT INTO reservations (user_id, parking_spot_id, start_time, end_time, status) VALUES ($1, $2, $3, $4, $5) RETURNING *', [userId, parkingSpotId, new Date(startTime), new Date(endTime), status]);
    res.status(StatusCodes.CREATED).json({ reservation: reservation.rows[0] });
}

export const cancelReservation = async (req, res) => {
    const { reservationId } = req.params;
    const { userId } = req.user;
    const reservation = await pool.query('SELECT * FROM reservations WHERE id = $1 and user_id = $2', [reservationId, userId]);
    if (reservation.rows.length === 0) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Reservation not found' });
        return;
    }
    if (reservation.rows[0].status === 'cancelled') {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Reservation already cancelled' });
        return;
    }
    const updatedReservation = await pool.query('UPDATE reservations SET status = $1 WHERE id = $2 and user_id = $3 RETURNING *', ['cancelled', reservationId, userId]);
    res.status(StatusCodes.OK).json({ reservation: updatedReservation.rows[0] });
}