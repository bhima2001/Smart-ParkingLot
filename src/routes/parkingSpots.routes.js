import express from 'express';
import { getAvailableSpots } from '../controllers/parkingSpots.controller.js';
import { asyncErrorWrapper } from '../middlewares/asyncErrorWrapper.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddlerware.js';
import { validateGetAvailableSpots } from '../inputValidations/parkingspot.validation.js';

const router = express.Router();

router.route('/getAvailableSpots').get(authMiddleware, validate(validateGetAvailableSpots), asyncErrorWrapper(getAvailableSpots));

export default router;