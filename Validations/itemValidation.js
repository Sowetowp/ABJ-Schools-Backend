import Joi from "joi";
import validateRequest from "./validate.js";

export const create_item = (req, res, next) => {
    const schema = Joi.object().keys({
        productName: Joi.string().required().trim().message({
            "string.empty": "productName is a required field",
        }),
        productCategory: Joi.string().required().trim().message({
            "string.empty" : "productCategory is a required field",
        }),
        productSubCategory: Joi.string().trim(),
        unitPrice: Joi.number().required(),
        qtyInStock: Joi.number().required(),
        orderType: Joi.string().valid("home delivery", "pick-up"),
        size: Joi.string().trim(),
        shortDesc: Joi.string().required().trim().message({
            "string.empty" : "shortDesc is a required field",
        }),
        longDesc: Joi.string().required().trim().message({
            "string.empty" : "longDesc is a required field",
        }),
    })
    validateRequest(req, next, schema)
}

export const update_single_item = (req, res, next) => {
    const schema = Joi.object().keys() ({
        productName: Joi.string().required().trim(),
        productCategory: Joi.string().required().trim(),
        productSubCategory: Joi.string().trim(),
        unitPrice: Joi.number().required().max(8).trim(),
        qtyInStock: Joi.string().required().trim(),
        size: Joi.string().trim(),
        shortDesc: Joi.string().required().trim(),
        longDesc: Joi.string().required().trim(),
    })
    validateRequest(req, res, schema)
}