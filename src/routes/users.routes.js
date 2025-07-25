import express from 'express';
import { signup, login, getReservations } from '../controllers/users.controller.js';
import { asyncErrorWrapper } from '../middlewares/asyncErrorWrapper.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/signup').post(asyncErrorWrapper(signup));
router.route('/login').post(asyncErrorWrapper(login));
router.route('/getReservations').get(authMiddleware, asyncErrorWrapper(getReservations));

export default router;