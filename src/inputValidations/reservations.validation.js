import Joi from 'joi';

export const validateCreateReservation = Joi.object({
    userId: Joi.number().required(),
    parkingSpotId: Joi.number().required(),
    startTime: Joi.number().integer().min(0).required(),
    endTime: Joi.number().integer().min(0).required()
});

export const validateCancelReservation = Joi.object({
    reservationId: Joi.number().required()
});
