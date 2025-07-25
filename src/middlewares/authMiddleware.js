import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

export const authMiddleware = (req, res, next) => {
    const bearerToken = req.headers['authorization'];
    if (!bearerToken) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
    }

    const token = bearerToken.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized: Invalid token' });
    }
}