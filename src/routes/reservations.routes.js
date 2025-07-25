import express from 'express';
import { createReservation, cancelReservation } from '../controllers/reservations.controller.js';
import { asyncErrorWrapper } from '../middlewares/asyncErrorWrapper.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/create').post(authMiddleware, asyncErrorWrapper(createReservation));
router.route('/:reservationId/cancel').put(authMiddleware, asyncErrorWrapper(cancelReservation));

export default router;