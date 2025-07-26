import express from 'express';
import { createReservation, cancelReservation } from '../controllers/reservations.controller.js';
import { asyncErrorWrapper } from '../middlewares/asyncErrorWrapper.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddlerware.js';
import { validateCreateReservation, validateCancelReservation } from '../inputValidations/reservations.validation.js';

const router = express.Router();

router.route('/create').post(authMiddleware, validate(validateCreateReservation), asyncErrorWrapper(createReservation));
router.route('/:reservationId/cancel').put(authMiddleware, validate(validateCancelReservation, 'params'), asyncErrorWrapper(cancelReservation));

export default router;