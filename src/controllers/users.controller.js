import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';
import { Constants } from '../contants.js';

export const signup = async (req, res) => {
    const { name, email, phoneNumber, password } = req.body;

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const hashedPasswordWithSalt = await bcrypt.hash(password, Constants.SALT_LENGTH);

    if (user.rows.length > 0) {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'User already exists' });
    } else {
        const newUser = await pool.query('INSERT INTO users (name, email, phoneNumber, password) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, phoneNumber, hashedPasswordWithSalt]);
        const token = jwt.sign({ userId: newUser.rows[0].id, email: newUser.rows[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        req.headers['authorization'] = `${token}`;
        res.status(StatusCodes.CREATED).json({ message: 'User created successfully', user: newUser.rows[0], token });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
        res.status(StatusCodes.NOT_FOUND).json({ message: 'User not found.' });
        return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
    if (isPasswordValid) {
        const token = jwt.sign({ userId: user.rows[0].id, email: user.rows[0].email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        req.headers['authorization'] = `${token}`;
        res.status(StatusCodes.OK).json({ message: 'Login successful', user: user.rows[0], token });
    } else {
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'Wrong password or email.' });
    }
}

export const getReservations = async (req, res) => {
    const { userId, email } = req.user;
    if (!userId || !email) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
        return;
    }
    const reservations = await pool.query('SELECT * FROM reservations WHERE user_id = $1 order by created_at', [userId]);
    res.status(StatusCodes.OK).json({ reservations: reservations.rows });
}
