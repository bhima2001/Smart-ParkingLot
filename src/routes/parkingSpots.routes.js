import express from 'express';
import { getAvailableSpots } from '../controllers/parkingSpots.controller.js';
import { asyncErrorWrapper } from '../middlewares/asyncErrorWrapper.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/getAvailableSpots').get(authMiddleware, asyncErrorWrapper(getAvailableSpots));

export default router;