import express from 'express';
import { signup, login, getReservations } from '../controllers/users.controller.js';
import { asyncErrorWrapper } from '../middlewares/asyncErrorWrapper.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/user/signup').post(asyncErrorWrapper(signup));
router.route('/user/login').post(asyncErrorWrapper(login));
router.route('/user/getReservations').get(authMiddleware, asyncErrorWrapper(getReservations));

export default router;