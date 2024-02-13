import Joi from 'joi'
import validateRequest from './validate.js';

const strongPasswordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const stringPassswordError = 'Password must be strong. At least one upper case alphabet. At least one lower case alphabet. At least one digit. At least one special character. Minimum eight in length';

export const signup = (req, res, next) => { 
    const schema =  Joi.object().keys({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().trim()
          .lowercase().messages({
            'string.email': 'Email must be a valid email',
            'string.empty': 'Email cannot be an empty field',
            'any.required': 'Email is a required field',
        }),
        password: Joi.string().regex(strongPasswordRegex).required().messages({
          'string.empty': 'Password is required',
          'string.pattern.base': stringPassswordError,
        }),
        firstName: Joi.string().required().max(20).min(3).trim(),
        lastName: Joi.string().required().max(20).min(3).trim(),
        parentPhoneNumber: Joi.string().trim(),
        address: Joi.string().required().trim(),
        dob: Joi.string().required().trim(),
        gender: Joi.string().trim(),
        image: Joi.string().trim(),
		status: Joi.string().trim(),
        house: Joi.string().trim(),
        _class: Joi.string().trim(),
        post: Joi.string().trim().empty(''),
        stateOfOrigin: Joi.string().trim(),
        parentEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().trim()
          .lowercase().messages({
            'string.email': 'Email must be a valid email',
            'string.empty': 'Email cannot be an empty field',
            'any.required': 'Email is a required field',
        }),
        middlename: Joi.string().required().max(20).min(3).trim(),
      });
    validateRequest (req, next, schema)
} 

export const update_details = (req, res, next) => { 
  const schema =  Joi.object().keys({
      email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().trim()
        .lowercase().messages({
          'string.email': 'Email must be a valid email',
          'string.empty': 'Email cannot be an empty field',
          'any.required': 'Email is a required field',
      }),
      firstName: Joi.string().required().max(20).min(3).trim(),
      lastName: Joi.string().required().max(20).min(3).trim(),
      parentPhoneNumber: Joi.string().trim(),
      address: Joi.string().required().trim(),
      dob: Joi.string().required().trim(),
      gender: Joi.string().trim(),
      image: Joi.string().trim(),
      status: Joi.string().trim(),
      house: Joi.string().trim(),
      _class: Joi.string().trim(),
      post: Joi.string().trim().empty(''),
      stateOfOrigin: Joi.string().trim(),
      parentEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().trim()
        .lowercase().messages({
          'string.email': 'Email must be a valid email',
          'string.empty': 'Email cannot be an empty field',
          'any.required': 'Email is a required field',
      }),
      middlename: Joi.string().required().max(20).min(3).trim(),
    });
  validateRequest (req, next, schema)
} 

export const signin = (req, res, next) => { 
    const schema =  Joi.object().keys({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().trim()
          .lowercase().trim(),
        password: Joi.string().required().trim()
    })
    validateRequest (req, next, schema)
}

export const updatePassword = (req, res, next) => { 
  const schema =  Joi.object().keys({
      // email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().trim()
      //   .lowercase().messages({
      //     'string.email': 'Email must be a valid email',
      //     'string.empty': 'Email cannot be an empty field',
      //     'any.required': 'Email is a required field',
      // }),
      newPassword: Joi.string().regex(strongPasswordRegex).required().messages({
        'string.empty': 'Password is required',
        'string.pattern.base': stringPassswordError,
      }),
      currentPassword: Joi.string().required().trim()
      // firstName: Joi.string().required().max(20).min(3).trim(),
      // lastName: Joi.string().required().max(20).min(3).trim(),
      // phoneNumber: Joi.string().trim(),
      // address: Joi.string().required().trim(),
      // dob: Joi.string().required().trim(),
      // gender: Joi.string().trim(),
      // image: Joi.string().trim(),
      // status: Joi.string().trim(),
      // qualification: Joi.string().trim(),
      // biography: Joi.string().trim(),
      // access: Joi.array().items(Joi.string().trim()),
      // department:Joi.array().items(Joi.string().trim()),
      // post: Joi.array().items(Joi.string().trim()),
      // subject: Joi.array().items(Joi.string().trim()),
      // middlename: Joi.string().required().max(20).min(3).trim(),
    });
  validateRequest (req, next, schema)
}