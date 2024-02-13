import asyncHandler from 'express-async-handler'
import { generatetoken } from '../utilities/generate_token.js'
import bcrypt from 'bcryptjs'
import Teacher from '../models/Teacher.js'
import cloudinary from '../config/cloudinary.js'
import Result from '../models/Result.js'
import Student from '../models/Student.js'
import Attendance from '../models/Attendance.js'
import Classes from '../models/Class.js'
import Assignment from '../models/Assignment.js'
import Ca from '../models/Ca.js'
import Exam from '../models/Exam.js'

export const teacher_login = asyncHandler(async (req, res, next) => {
	try{
		const { email, password } = req.body

		const teacher = await Teacher.findOne({ email })
			.populate('subject', 'name')
			.populate('department', 'name')
			.populate('access', 'name')
			.populate('post', 'name')
		if (
			!teacher ||
			teacher.status !== 'active' ||
			!bcrypt.compareSync(password, teacher.password)
		) {
			throw new Error('Please check details')
		}

		res.json({
			message: 'Login successful',
			status: 'ok',
			data: {
				id: teacher._id,
				firstName: teacher.firstName,
				lastName: teacher.lastName,
				email: teacher.email,
				address: teacher.address,
				password: teacher.password,
				phoneNumber: teacher.phoneNumber,
				status: teacher.status,
				image: teacher.image,
				dob: teacher.dob,
				subject: teacher.subject,
				qualification: teacher.qualification,
				biography: teacher.biography,
				post: teacher.post,
				gender: teacher.gender,
				access: teacher.access,
				department: teacher.department,
				title: teacher.title,
				token: generatetoken(teacher._id),
			},
		})
	} catch (error) {
		next(error);
	}
})

export const get_all_teachers = asyncHandler(async(req, res, next) => {
	try{
		const { page, pageSize } = req.query;
		const teachers = await Teacher.find({ status: 'active' })
			.populate('subject', 'name')
			.skip((page - 1) * pageSize)
			.limit(pageSize);
		const totalNews = await Teacher.countDocuments();
		const totalPages = Math.ceil(totalNews / pageSize);

		res.json({
			status: "ok",
			message: "all teachers retrieved",
			data: {
				teachers,
				totalNews,
				currentPage: Number(page),
				totalPages,
			}
		})
	} catch (error) {
		next(error);
	}
})

export const single_teacher = asyncHandler(async (req, res, next) => {
	try{
		const teacher = await Teacher.findOne({ _id: req.params.id })
		if (teacher) {
			res.status(201).json({
				message: 'Teacher details',
				status: 'ok',
				data: teacher,
			})
		} else {
			throw new Error('Teacher does not exist')
		}
	} catch (error) {
		next(error);
	}
})
	
export const get_students = asyncHandler(async (req, res, next) => {
	try{
		const {
			id,
			term,
			subject
		} = req.body
		const studenta = await Student.find({ _class: id })
		const result = await Result.find({ term, subject })
		// const filteredStudents = studenta.filter(student =>
		// 	result.some(result => result.student.toString() === student._id.toString())
		// );
		const filteredStudents = studenta.filter(student =>
			result.every(result => result.student.toString() !== student._id.toString())
		  );
		console.log(filteredStudents)
		if (filteredStudents) {
			res.status(201).json({
				message: 'student details',
				status: 'ok',
				data: filteredStudents,
			})
		} else {
			throw new Error('student does not exist')
		}
	} catch (error) {
		next(error);
	}
})

export const get_results = asyncHandler(async (req, res, next) => {
	try{
		const {
			_class,
			term,
			subject,
			created_by
		} = req.body
		const result = await Result.find({ term, subject, created_by, _class })
			.populate("student", "firstName middlename lastName")
		if (result) {
			res.status(201).json({
				message: 'student details',
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

export const search_teacher = asyncHandler(async (req, res, next) => {
	try{
		const pipeline = [
			{
			$match: { status: 'active' },
			},
			// {
			//   $group: {
			// 	_id: '$brand',
			// 	totalItems: { $sum: 1 },
			//   },
			// },
			// {
			//   $sort: { totalItems: -1 },
			// },
		];
		
		const results = await Teacher.aggregate(pipeline);
		if (results) {
			res.status(201).json({
				message: 'search result',
				status: 'ok',
				data: results,
			})
		} else {
			throw new Error('search does not exist')
		}
	} catch (error) {
		next(error);
	}
})

export const update_teacher_password = asyncHandler(async (req, res, next) => {
	try{
		const { newPassword, currentPassword } = req.body
		if (!newPassword) {
			return res.status(400).json({ message: 'New password is required.' });
		}
		const teacher = await Teacher.findById(req.params.id)
		if (!bcrypt.compareSync(currentPassword, teacher.password)) {
			return res.status(400).json({ message: 'Invalid current password' });
		}
		const hashedPassword = await bcrypt.hash(newPassword, 10);
		const updatedTeacher = await Teacher.findByIdAndUpdate(
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
			throw new Error('teacher not found')
		}
	} catch (error) {
		next(error);
	}
})

export const post_result = asyncHandler(async (req, res, next) => {
	try{
		const aClassResult = req.body
		const uniqueIdentifiers = aClassResult.map(result => ({
			student: result.student,
			subject: result.subject,
			term: result.term,
		}));
		const resultExists = await Result.find({
			$and: uniqueIdentifiers.map(identifier => ({
			  student: identifier.student,
			  subject: identifier.subject,
			  term: identifier.term,
			})),
		});
		if (resultExists.length > 0) {
			throw new Error('result exists already')
		}
		const result = await Result.insertMany(aClassResult)
		if (result) {
			res.status(201).json({
				message: 'result posted successfully',
				status: 'ok',
				data: result,
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})

export const post_attendance = asyncHandler(async (req, res, next) => {
	try{
		const aClassAttendance = req.body
		const uniqueIdentifiers = aClassAttendance.map(att => ({
			student: att.student,
			day: att.day,
			term: att.term,
		}));
		const attendanceExists = await Attendance.find({
			$and: uniqueIdentifiers.map(identifier => ({
			  student: identifier.student,
			  day: identifier.day,
			  term: identifier.term,
			})),
		});
		if (attendanceExists.length > 0) {
			throw new Error('Attendance marked already')
		}
		const attendance = await Attendance.insertMany(aClassAttendance)
		if (attendance) {
			res.status(201).json({
				message: 'attendance taken successfully',
				status: 'ok',
				data: attendance,
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})

export const get_my_class = asyncHandler(async (req, res, next) => {
	try{
		const today = new Date();
		const dayOfWeek = today.getDay();
		const formattedToday = today.toISOString().split('T')[0];

		const classes = await Classes.find({ classTeacher: req.params.id });
		const categoryIds = classes.map(clas => clas._id);

		const matchedDocuments = await Attendance.find({
		day: {
			$gte: new Date(formattedToday),
			$lt: new Date(formattedToday + 'T23:59:59.999Z')
		},
		class: { $in: categoryIds }
		});

		const unmarked = classes.filter(classObj => 
		matchedDocuments.every(attendanceObj => classObj._id.toString() !== attendanceObj.class.toString())
		);
		const query = { _class: { $in: unmarked.map((e)=> e._id) } };
    	const students = await Student.find(query)
		.populate("_class", "name")
		const uniqueCategories = [...new Set(students.map(obj => obj._class.name))];

		const categoryArrays = uniqueCategories.map(category => {
			return {
				category: category,
				data: students.filter(obj => obj._class.name === category)
			};
		});
		if (unmarked) {
			res.status(201).json({
				message: 'class details',
				status: 'ok',
				today: dayOfWeek,
				data: categoryArrays,
				classes: classes
			})
		} else {
			throw new Error('something went wrong')
		}
	} catch (error) {
		next(error);
	}
})

export const post_assignment = asyncHandler(async (req, res, next) => {
	try{
		const {
			title,
			classes,
			subject,
			term,
        	questions,
			created_by,
			deadline
		} = req.body
		
		const assignmentExists = await Assignment.find({title, term, classes});
		if (assignmentExists.length > 0) {
			throw new Error(next('Assignment posted already'))
		}
		const assignment = await Assignment.create({
			title,
			classes,
			subject,
			term,
			created_by,
        	questions,
			deadline
		})
		if (assignment) {
			res.status(201).json({
				message: 'assignment posted successfully',
				status: 'ok',
				data: assignment,
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})

export const post_ca = asyncHandler(async (req, res, next) => {
	try{
		const {
			title,
			classes,
			subject,
			term,
        	questions,
			created_by,
			deadline
		} = req.body
		
		const caExists = await Ca.find({title, term, classes});
		if (caExists.length > 0) {
			throw new Error(next('ca posted already'))
		}
		const ca = await Ca.create({
			title,
			classes,
			subject,
			term,
        	questions,
			created_by,
			deadline
		})
		if (ca) {
			res.status(201).json({
				message: 'ca posted successfully',
				status: 'ok',
				data: ca,
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})

export const post_exam = asyncHandler(async (req, res, next) => {
	try{
		const {
			title,
			classes,
			created_by,
			subject,
			term,
        	questions,
			deadline
		} = req.body
		
		const examExists = await Exam.find({title, term, classes});
		if (examExists.length > 0) {
			throw new Error(next('exam posted already'))
		}
		const exam = await Exam.create({
			title,
			classes,
			subject,
			term,
        	questions,
			created_by,
			deadline
		})
		if (exam) {
			res.status(201).json({
				message: 'exam posted successfully',
				status: 'ok',
				data: exam,
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})