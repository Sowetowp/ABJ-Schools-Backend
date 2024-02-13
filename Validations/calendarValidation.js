import Joi from "joi";
import validateRequest from "./validate.js";

export const create_session = (req, res, next) => {
    const schema = Joi.object().keys({
        from: Joi.number().required(),
        to: Joi.number().required(),
        // productName: Joi.string().required().trim().message({
        //     "string.empty": "productName is a required field",
        // }),
        // productCategory: Joi.string().required().trim().message({
        //     "string.empty" : "productCategory is a required field",
        // }),
        // productSubCategory: Joi.string().trim(),
        // unitPrice: Joi.number().required(),
        // qtyInStock: Joi.number().required(),
        // orderType: Joi.string().valid("home delivery", "pick-up"),
        // size: Joi.string().trim(),
        // shortDesc: Joi.string().required().trim().message({
        //     "string.empty" : "shortDesc is a required field",
        // }),
        // longDesc: Joi.string().required().trim().message({
        //     "string.empty" : "longDesc is a required field",
        // }),
    })
    validateRequest(req, next, schema)
}

export const create_term = (req, res, next) => {
    const schema = Joi.object().keys({
        session: Joi.string().trim(),
        tname: Joi.string().valid('First', 'Second', "Third"),
    })
    validateRequest(req, next, schema)
}

export const create_event = (req, res, next) => {
    const schema = Joi.object().keys({
        esession: Joi.string().trim(),
        term: Joi.string().trim(),
        month: Joi.string().trim(),
        day: Joi.number().required(),
        event: Joi.string().trim(),
    })
    validateRequest(req, next, schema)
}

export const update_session = (req, res, next) => {
    const schema = Joi.object().keys({
        from: Joi.number().required(),
        to: Joi.number().required(),
    })
    validateRequest(req, next, schema)
}

export const update_term = (req, res, next) => {
    const schema = Joi.object().keys({
        session: Joi.string().trim(),
        tname: Joi.string().valid('First', 'Second', "Third"),
    })
    validateRequest(req, next, schema)
}

export const update_event = (req, res, next) => {
    const schema = Joi.object().keys({
        esession: Joi.string().trim(),
        term: Joi.string().trim(),
        month: Joi.string().trim(),
        day: Joi.number().required(),
        event: Joi.string().trim(),
    })
    validateRequest(req, next, schema)
}