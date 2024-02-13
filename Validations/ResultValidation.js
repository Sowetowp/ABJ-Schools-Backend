import Joi from 'joi'
import validateRequest from './validate.js';


export const post = (req, res, next) => { 
    const schema =  Joi.object().keys({
        created_by: Joi.string().required().trim(),
        student: Joi.string().required().trim(),
        _class: Joi.string().required().trim(),
        term: Joi.string().required().trim(),
        subject: Joi.string().required().trim(),
        ca1: Joi.number().required(),
        ca2: Joi.number().required(),
        exam: Joi.number().required()
      });
    validateRequest (req, next, Joi.array().items(schema))
} 
