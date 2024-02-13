import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import Student from '../models/Student.js'
import { generatetoken } from '../utilities/generate_token.js'
import Result from '../models/Result.js'
import Payment from '../models/Payment.js'
import Assignment from '../models/Assignment.js'
import AssignmentRecord from '../models/AssignmentRecord.js'
import CaRecord from '../models/CaRecord.js'
import Ca from '../models/Ca.js'
import ExamRecord from '../models/ExamRecord.js'
import Exam from '../models/Exam.js'

export const student_login = asyncHandler(async (req, res, next) => {
	try{
		const { email, password } = req.body
		const student = await Student.findOne({ email })
			.populate("_class", "name")
			.populate("post", "name")
		if (
			!student ||
			student.status !== 'active' ||
			!bcrypt.compareSync(password, student.password)
		) {
			throw new Error('Please check details')
		}
		res.json({
			message: 'Login successful',
			status: 'ok',
			data: {
				id: student._id,
				email: student.email,
				firstName: student.firstName,
				lastName: student.lastName,
				middlename: student.middlename,
				parentEmail: student.parentEmail,
				parentPhoneNumber: student.parentPhoneNumber,
				status: student.status,
				image: student.image,
				dob: student.dob,
				house: student.house,
				_class: student._class.name,
				classid: student._class._id,
				post: student.post.name,
				gender: student.gender,
				address: student.address,
				stateOfOrigin: student.stateOfOrigin,
				tdue: student.tdue,
				tpaid: student.tpaid,
				token: generatetoken(student._id),
			},
		})
	} catch (error) {
		next(error);
	}
})

export const view_results = asyncHandler(async (req, res, next) => {
	try{
		const {
			term,
			student,
		} = req.body
		const fee = await Payment.find({student, term})
		const result = await Result.find({ term, student })
		.populate("subject", "name")
		.populate("created_by", "firstName lastName title")
		.populate("term", "tname")
		if (fee.length < 1){
			throw new Error(next("You have not paid school fees for this term"))
		}
		if (result) {
			res.status(201).json({
				message: 'student result',
				status: 'ok',
				data: result,
			})
		} else {
			throw new Error('student does not exist')
		}
	} catch (error) {
		next(error);
	}
})

export const update_student_password = asyncHandler(async (req, res, next) => {
	try{
		const { newPassword, currentPassword } = req.body
		if (!newPassword) {
			return res.status(400).json({ message: 'New password is required.' });
		}
		const student = await Student.findById(req.params.id)
		if (!bcrypt.compareSync(currentPassword, student.password)) {
			return res.status(400).json({ message: 'Invalid current password' });
		}
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		const updatedStudent = await Student.findByIdAndUpdate(
			req.params.id,
			{ password: hashedPassword },
			{ new: true }
		);
		if (updatedStudent) {
			res.json({
				message: 'Password updated successfully',
				status: 'ok',
				data: updatedStudent
			})
		} else {
			res.status(404)
			throw new Error('student not found')
		}
	} catch (error) {
		next(error);
	}
})

export const view_assignment = asyncHandler(async (req, res, next) => {
	try{
		const {
			student,
			_class,
			term
		} = req.body
		const rec = await AssignmentRecord.find({term, student})
		const assignments = await Assignment.find({term})
		.populate("subject", "name")
		const myAssignments = assignments.filter((e)=> e.classes.find((ee)=> ee.toString() === _class))
		const filt = myAssignments.filter((w)=> !rec.some((ww)=> w._id.toString() === ww.assignment.toString()))
		if (myAssignments) {
			res.status(201).json({
				message: 'assignments',
				status: 'ok',
				data: filt
			})
		} else {
			throw new Error('something went wrong')
		}
	} catch (error) {
		next(error);
	}
})

export const record_assignment = asyncHandler(async (req, res, next) => {
	try{
		const {
			term,
			score,
			student,
			assignment
		} = req.body
		
		const recassignment = await AssignmentRecord.create({
			term,
			score,
			student,
			assignment
		})
		if (recassignment) {
			res.status(201).json({
				message: 'assignment posted successfully',
				status: 'ok',
				data: recassignment,
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})

export const view_ca = asyncHandler(async (req, res, next) => {
	try{
		const {
			student,
			_class,
			term
		} = req.body
		const rec = await CaRecord.find({term, student})
		const assignments = await Ca.find({term})
		.populate("subject", "name")
		const myAssignments = assignments.filter((e)=> e.classes.find((ee)=> ee.toString() === _class))
		const filt = myAssignments.filter((w)=> !rec.some((ww)=> w._id.toString() === ww.ca.toString()))
		if (myAssignments) {
			res.status(201).json({
				message: 'ca',
				status: 'ok',
				data: filt
			})
		} else {
			throw new Error('something went wrong')
		}
	} catch (error) {
		next(error);
	}
})

export const record_ca = asyncHandler(async (req, res, next) => {
	try{
		const {
			term,
			score,
			student,
			ca
		} = req.body
		
		const recassignment = await CaRecord.create({
			term,
			score,
			student,
			ca
		})
		if (recassignment) {
			res.status(201).json({
				message: 'ca posted successfully',
				status: 'ok',
				data: recassignment,
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})

export const view_exam = asyncHandler(async (req, res, next) => {
	try{
		const {
			student,
			_class,
			term
		} = req.body
		const rec = await ExamRecord.find({term, student})
		const assignments = await Exam.find({term})
		.populate("subject", "name")
		const myAssignments = assignments.filter((e)=> e.classes.find((ee)=> ee.toString() === _class))
		const filt = myAssignments.filter((w)=> !rec.some((ww)=> w._id.toString() === ww.exam.toString()))
		if (myAssignments) {
			res.status(201).json({
				message: 'exam',
				status: 'ok',
				data: filt
			})
		} else {
			throw new Error('something went wrong')
		}
	} catch (error) {
		next(error);
	}
})

export const record_exam = asyncHandler(async (req, res, next) => {
	try{
		const {
			term,
			score,
			student,
			exam
		} = req.body
		
		const recassignment = await ExamRecord.create({
			term,
			score,
			student,
			exam
		})
		if (recassignment) {
			res.status(201).json({
				message: 'exam posted successfully',
				status: 'ok',
				data: recassignment,
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})

export const get_self = asyncHandler(async (req, res, next) => {
	try {
		const {
			id
		} = req.body
		const student = await Student.findOne({_id: id})
		.populate("_class", "name")
		if (student) {
			res.status(201).json({
				message: 'students fetched',
				status: 'ok',
				data: student
			})
		} else {
			res.status(401)
			throw new Error('Something went wrong.')
		}
	} catch (error) {
		next(error);
	}
})