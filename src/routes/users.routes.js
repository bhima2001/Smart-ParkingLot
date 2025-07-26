import express from 'express';
import { signup, login, getReservations } from '../controllers/users.controller.js';
import { asyncErrorWrapper } from '../middlewares/asyncErrorWrapper.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validateMiddlerware.js';
import { validateSignup, validateLogin } from '../inputValidations/users.validation.js';

const router = express.Router();

router.route('/signup').post(validate(validateSignup), asyncErrorWrapper(signup));
router.route('/login').post(validate(validateLogin), asyncErrorWrapper(login));
router.route('/getReservations').get(authMiddleware, asyncErrorWrapper(getReservations));

export default router;