import Joi from 'joi';

export const validateGetParkingSpots = Joi.object({
    lotId: Joi.number().required()
});