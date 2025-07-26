import Joi from 'joi';

export const validateGetAvailableSpots = Joi.object({
    spotType: Joi.string().optional(),
    parkingLotIds: Joi.array().items(Joi.number()).optional(),
    startTime: Joi.number().integer().min(0).required(),
    endTime: Joi.number().integer().min(0).required()
});