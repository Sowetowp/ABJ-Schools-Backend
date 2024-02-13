import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import Teacher from "../models/Teacher.js"
import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import Parent from "../models/Parent.js";

export const teacherProtect = asyncHandler(async (req, res, next) => {
	let token

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1]

			const decoded = jwt.verify(token, process.env.JWT_SECRET)

			req.teacher = await Teacher.findById(decoded.id).select('-password')

			next()
		} catch (error) {
			console.error(error)
			res.status(401)
			next(`Not Authorized`);
			// throw new Error('Not Authorized')
		}
	}

	if (!token) {
		res.status(401)
		next(`Not Authorized`);
		// throw new Error('Not Authorized')
	}
})

export const adminProtect = asyncHandler(async (req, res, next) => {
	let token

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1]

			const decoded = jwt.verify(token, process.env.JWT_SECRET)

			req.admin = await Admin.findById(decoded.id).select('-password')

			next()
		} catch (error) {
			console.error(error)
			res.status(401)
			next(`Not Authorized`);
			// throw new Error('Not Authorized')
		}
	}

	if (!token) {
		res.status(401)
		next(`Not Authorized`);
		// throw new Error('Not Authorized')
	}
})

export const studentProtect = asyncHandler(async (req, res, next) => {
	let token

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1]

			const decoded = jwt.verify(token, process.env.JWT_SECRET)

			req.student = await Student.findById(decoded.id).select('-password')

			next()
		} catch (error) {
			console.error(error)
			res.status(401)
			next(`Not Authorized`);

			// throw new Error('Not Authorized')
		}
	}

	if (!token) {
		res.status(401)
		next(`Not Authorized`);

		// throw new Error('Not Authorized')
	}
})

export const parentProtect = asyncHandler(async (req, res, next) => {
	let token

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		try {
			token = req.headers.authorization.split(' ')[1]

			const decoded = jwt.verify(token, process.env.JWT_SECRET)

			req.parent = await Parent.findById(decoded.id).select('-password')

			next()
		} catch (error) {
			console.error(error)
			res.status(401)
			next(`Not Authorized`);

			// throw new Error('Not Authorized')
		}
	}

	if (!token) {
		res.status(401)
		next(`Not Authorized`);

		// throw new Error('Not Authorized')
	}
})