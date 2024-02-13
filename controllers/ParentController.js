import asyncHandler from 'express-async-handler'
import { generatetoken } from '../utilities/generate_token.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../config/cloudinary.js'
import Parent from '../models/Parent.js'
import Student from '../models/Student.js'
import Attendance from '../models/Attendance.js'

export const parent_signup = asyncHandler(async (req, res, next) => {
	try{
		const {
			firstName,
			lastName,
			email,
			password,
			phoneNumber,
			title,
			image,
			gender,
		} = req.body

		const uploadImageToCloudinary = (image) => {
			return new Promise((resolve, reject) => {
			cloudinary.uploader.upload(
				image,
				{
				upload_preset: "unsigned_upload",
				allowed_formats: ["png", "jpg", "jpeg", "svg", "ico", "jfif", "webp"],
				},
				(error, result) => {
				if (error) {
					console.log(error);
					reject(error);
				} else {
					resolve(result);
				}
				}
			);
			});
		};
		
		const uploadedImage = await uploadImageToCloudinary(image);
		
		const public_id = uploadedImage.public_id
		
		const parentExists = await Parent.find({ email })

		if (parentExists.length > 0) {
			throw new Error(next('Sorry, this parent has an account already'))
		}

		const hashedPass = await bcrypt.hash(password, 10)
		
		const parent = await Parent.create({
			firstName,
			lastName,
			email,
			password: hashedPass,
			phoneNumber,
			title,
			image: public_id,
			gender,
		})

		if (parent) {
			res.status(201).json({
				message: 'parent has been registered successfully',
				status: 'ok',
				data: parent,
			})
		} else {
			res.status(400)
			throw new Error(next('Invalid data provided.'))
		}
	} catch (error) {
		next(error);
	}
})

export const parent_login = asyncHandler(async (req, res, next) => {
	try{
		const { email, password } = req.body

		const parent = await Parent.findOne({ email })
		const child = await Student.find({ parentEmail: email })

		if (
			!parent || !bcrypt.compareSync(password, parent.password)
		) {
			throw new Error(next('Please check details'))
		}

		res.json({
			message: 'Login successful',
			status: 'ok',
			data: {
				firstName: parent.firstName,
                lastName: parent.lastName,
                email: parent.email,
                phoneNumber: parent.phoneNumber,
                title: parent.title,
                image: parent.image,
                gender: parent.gender,
                children: child,
				token: generatetoken(parent._id)
			}
		})
	} catch (error) {
		next(error);
	}
})

export const view_attendance = asyncHandler(async (req, res, next) => {
	try{
		const {
			term,
			student,
		} = req.body
		const result = await Attendance.find({ term, student })
			.populate("class", "name")
			.populate("term", "tname")
			.populate("student", "firstName")
			
		if (result) {
			res.status(201).json({
				message: 'student attendance',
				status: 'ok',
				data: result,
			})
		} else {
			throw new Error(next('student does not exist'))
		}
	} catch (error) {
		next(error);
	}
})

export const update_parent_password = asyncHandler(async (req, res, next) => {
	try{
		const { newPassword, currentPassword } = req.body
		if (!newPassword) {
			return res.status(400).json({ message: 'New password is required.' });
		}
		const teacher = await Parent.findById(req.params.id)
		if (!bcrypt.compareSync(currentPassword, teacher.password)) {
			return res.status(400).json({ message: 'Invalid current password' });
		}
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		const updatedTeacher = await Parent.findByIdAndUpdate(
			req.params.id,
			{ password: hashedPassword },
			{ new: true }
		);
		if (updatedTeacher) {
			res.json({
				message: 'Password updated successfully',
				status: 'ok',
				data: updatedTeacher
			})
		} else {
			res.status(404)
			throw new Error('parent not found')
		}
	} catch (error) {
		next(error);
	}
})