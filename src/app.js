import express from 'express';
import usersRoutes from './routes/users.routes.js';
import parkingLotsRoutes from './routes/parkingLots.routes.js';
import reservationsRoutes from './routes/reservations.routes.js';
import parkingSpotsRoutes from './routes/parkingSpots.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { StatusCodes } from 'http-status-codes';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api', usersRoutes);
app.use('/api', parkingLotsRoutes);
app.use('/api', reservationsRoutes);
app.use('/api', parkingSpotsRoutes);

app.use((req, res, next) => {
    const error = new Error('Route not found');
    error.statusCode = StatusCodes.NOT_FOUND;
    next(error);
});

app.use(errorHandler);

export default app;