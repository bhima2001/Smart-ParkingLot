import express from 'express';
import { getAllParkingLots, getParkingSpots } from '../controllers/parkingLots.controller.js';
import { asyncErrorWrapper } from '../middlewares/asyncErrorWrapper.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddlerware.js';
import { validateGetParkingSpots } from '../inputValidations/parkinglot.validation.js';

const router = express.Router();

router.route('/getAll').get(authMiddleware, asyncErrorWrapper(getAllParkingLots));
router.route('/:lotId/getSpots').get(authMiddleware, validate(validateGetParkingSpots, 'params'), asyncErrorWrapper(getParkingSpots));

export default router;