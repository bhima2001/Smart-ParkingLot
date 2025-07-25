import express from 'express';
import usersRoutes from './routes/users.routes.js';
import parkingLotsRoutes from './routes/parkingLots.routes.js';
import reservationsRoutes from './routes/reservations.routes.js';
import parkingSpotsRoutes from './routes/parkingSpots.routes.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { StatusCodes } from 'http-status-codes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/user', usersRoutes);
app.use('/api/parkinglot', parkingLotsRoutes);
app.use('/api/reservation', reservationsRoutes);
app.use('/api/parkingspot', parkingSpotsRoutes);

app.use((_req, _res, next) => {
    const error = new Error('Route not found');
    error.statusCode = StatusCodes.NOT_FOUND;
    next(error);
});

app.use(errorHandler);

export default app;