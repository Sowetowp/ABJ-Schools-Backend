import asyncHandler from 'express-async-handler'
import Result from '../models/Result.js'
import xlsx from "xlsx"
import { generatetoken } from '../utilities/generate_token.js'
import bcrypt from 'bcryptjs'
import Teacher from '../models/Teacher.js'
import cloudinary from '../config/cloudinary.js'
import Admin from '../models/Admin.js'
import Subject from '../models/Subject.js'
import Post from '../models/Post.js'
import Classes from '../models/Class.js'
import Department from '../models/Department.js'
import Student from '../models/Student.js'
import News from '../models/News.js'
import Gallery from '../models/Gallery.js'
import Session from '../models/Session.js'
import Term from '../models/Term.js'
import Event from '../models/event.js'
import Parent from '../models/Parent.js'
import Payment from '../models/Payment.js'

export const excel = asyncHandler(async (req, res, next) => {
	try {
		let xlfile = xlsx.readFile("C:\\Users\\Hp\\Downloads\\Book1.xlsx")
		let sheet = xlfile.Sheets(xlfile.sheetNames)
		let p_JSON = xlsx.utils.sheet_to_json(sheet)
		await Result.insertmany(p_JSON).then((result) => {
			if (result.length > 0) {
				res.send({
					staus: "ok",
					count: result.length
				})
			} else {
				res.send({ status: "something went wrong" })
			}
		})
	} catch (error) {
		res.send({ error: error })
	}
})

export const teacher_signup = asyncHandler(async (req, res, next) => {
	try {
		const {
			firstName,
			lastName,
			middlename,
			email,
			password,
			phoneNumber,
			status,
			dob,
			subject,
			qualification,
			biography,
			post,
			title,
			department,
			image,
			access,
			gender,
			address
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

		const teacherExists = await Teacher.find({ email })

		if (teacherExists.length > 0) {
			throw new Error('Sorry, this teacher already exists')
		}

		const hashedPass = await bcrypt.hash(password, 10)

		const teacher = await Teacher.create({
			firstName,
			lastName,
			middlename,
			email,
			password: hashedPass,
			phoneNumber,
			status,
			dob,
			image: public_id,
			subject,
			title,
			qualification,
			biography,
			post,
			department,
			access,
			gender,
			address
		})

		if (teacher) {
			res.status(201).json({
				message: 'teacher has been registered successfully',
				status: 'ok',
				data: teacher,
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})

export const admin_signup = asyncHandler(async (req, res, next) => {
	try {
		const {
			firstName,
			lastName,
			middlename,
			email,
			password,
			phoneNumber,
			dob,
			image,
			gender,
			address
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

		const adminExists = await Admin.find({})

		if (adminExists.length > 0) {
			throw new Error('Sorry, there can only be one admin')
		}

		const hashedPass = await bcrypt.hash(password, 10)

		const admin = await Admin.create({
			firstName,
			lastName,
			middlename,
			email,
			password: hashedPass,
			phoneNumber,
			dob,
			image: public_id,
			gender,
			address
		})

		if (admin) {
			res.status(201).json({
				message: 'Admin has been registered successfully',
				status: 'ok',
				data: {
					_id: admin._id,
					firstName: admin.firstName,
					lastName: admin.lastName,
					middlename: admin.middlename,
					email: admin.email,
					password: admin.password,
					gender: admin.gender,
					dob: admin.dob,
					address: admin.address,
					image: admin.image,
					token: generatetoken(admin._id)
				}
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})

export const admin_login = asyncHandler(async (req, res, next) => {
	try {
		const { email, password } = req.body

		const admin = await Admin.findOne({ email })

		if (
			!admin || !bcrypt.compareSync(password, admin.password)
		) {
			throw new Error('Please check details')
		}

		res.json({
			message: 'Login successful',
			status: 'ok',
			data: {
				_id: admin._id,
				firstName: admin.firstName,
				lastName: admin.lastName,
				middlename: admin.middlename,
				email: admin.email,
				password: admin.password,
				gender: admin.gender,
				dob: admin.dob,
				address: admin.address,
				image: admin.image,
				token: generatetoken(admin._id)
			}
		})
	} catch (error) {
		next(error);
	}
})

export const admin_get_all_teachers = asyncHandler(async (req, res, next) => {
	try {
		const { page, pageSize } = req.query;
		const teachers = await Teacher.find({})
			.populate('post', 'name')
			.populate('subject', 'name')
			.populate('department', 'name')
			.populate('access', 'name')
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

export const admin_get_all = asyncHandler(async (req, res, next) => {
	try {
		const teachers = await Teacher.countDocuments();
		const students = await Student.countDocuments();
		const subjects = await Subject.countDocuments();

		res.json({
			status: "ok",
			message: "retrieved",
			data: {
				teachers,
				students,
				subjects
			}
		})
	} catch (error) {
		next(error);
	}
})

export const admin_get_all_parents = asyncHandler(async (req, res, next) => {
	try {
		const { page, pageSize } = req.query;
		const teachers = await Parent.find({})

			.skip((page - 1) * pageSize)
			.limit(pageSize);
		const totalNews = await Parent.countDocuments();
		const totalPages = Math.ceil(totalNews / pageSize);

		res.json({
			status: "ok",
			message: "all parents retrieved",
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

export const admin_search_teacher = asyncHandler(async (req, res, next) => {
	try {
		const pipeline = [
			{
				$match: {},
			}
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
		res.send({ error: error })
	}
})

export const admin_search_parent = asyncHandler(async (req, res, next) => {
	try {
		const pipeline = [
			{
				$match: {},
			}
		];

		const results = await Parent.aggregate(pipeline);
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
		res.send({ error: error })
	}
})

export const create_subject = asyncHandler(async (req, res, next) => {
	try {
		const {
			name,
		} = req.body

		const subjectExists = await Subject.find({ name })

		if (subjectExists.length > 0) {
			throw new Error('subject exists already')
		}

		const subject = await Subject.create({
			name,
		})

		if (subject) {
			res.status(201).json({
				message: 'success',
				status: 'ok',
				data: subject,
			})
		} else {
			res.status(400)
			throw new Error('Something went wrong.')
		}
	} catch (error) {
		res.send({ error: error })
	}
})

export const get_subjects = asyncHandler(async (req, res, next) => {
	try {
		const subject = await Subject.find({})
		if (subject) {
			res.status(201).json({
				message: 'success',
				status: 'ok',
				data: subject,
			})
		} else {
			throw new Error('something went wrong')
		}
	} catch (error) {
		res.send({ error: error })
	}
})

export const create_post = asyncHandler(async (req, res, next) => {
	try {
		const {
			name,
			category
		} = req.body

		const postExists = await Post.find({ name })

		if (postExists.length > 0) {
			throw new Error('post exists already')
		}

		const post = await Post.create({
			name,
			category
		})

		if (post) {
			res.status(201).json({
				message: 'success',
				status: 'ok',
				data: post,
			})
		} else {
			res.status(400)
			throw new Error('Something went wrong.')
		}
	} catch (error) {
		res.send({ error: error })
	}
})

export const get_posts = asyncHandler(async (req, res, next) => {
	try {
		const posts = await Post.find({})
		const teachers = posts.filter(e => e.category == "Teachers")
		const students = posts.filter(e => e.category == "Students")

		if (posts) {
			res.status(201).json({
				message: 'success',
				status: 'ok',
				data: {
					posts: posts,
					teachers: teachers,
					students: students
				}
			})
		} else {
			throw new Error('something went wrong')
		}
	} catch (error) {
		res.send({ error: error })
	}
})

export const create_class = asyncHandler(async (req, res, next) => {
	try {
		const {
			name,
			classTeacher
		} = req.body

		const classExists = await Classes.find({ name })

		if (classExists.length > 0) {
			throw new Error(next('class exists already'))
		}

		const classes = await Classes.create({
			name,
			classTeacher
		})

		if (classes) {
			res.status(201).json({
				message: 'success',
				status: 'ok',
				data: classes,
			})
		} else {
			res.status(400)
			throw new Error('Something went wrong.')
		}
	} catch (error) {
		res.send({ error: error })
	}
})

export const get_classes = asyncHandler(async (req, res, next) => {
	try {
		const classes = await Classes.find({})
		if (classes) {
			res.status(201).json({
				message: 'success',
				status: 'ok',
				data: classes,
			})
		} else {
			throw new Error('something went wrong')
		}
	} catch (error) {
		res.send({ error: error })
	}
})

export const create_department = asyncHandler(async (req, res, next) => {
	try {
		const {
			name,
		} = req.body

		const deptExists = await Department.find({ name })

		if (deptExists.length > 0) {
			throw new Error('department exists already')
		}

		const dept = await Department.create({
			name,
		})

		if (dept) {
			res.status(201).json({
				message: 'success',
				status: 'ok',
				data: dept,
			})
		} else {
			res.status(400)
			throw new Error('Something went wrong.')
		}
	} catch (error) {
		res.send({ error: error })
	}
})

export const get_departments = asyncHandler(async (req, res, next) => {
	try {
		const dept = await Department.find({})
		if (dept) {
			res.status(201).json({
				message: 'success',
				status: 'ok',
				data: dept,
			})
		} else {
			throw new Error('something went wrong')
		}
	} catch (error) {
		res.send({ error: error })
	}
})

export const student_signup = asyncHandler(async (req, res, next) => {
	try {
		const {
			firstName,
			lastName,
			middlename,
			email,
			parentEmail,
			password,
			parentPhoneNumber,
			status,
			image,
			dob,
			house,
			_class,
			post,
			stateOfOrigin,
			gender,
			address
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

		const studentExists = await Student.find({ email })

		if (studentExists.length > 0) {
			throw new Error('Sorry, this student already exists')
		}

		const hashedPass = await bcrypt.hash(password, 10)

		const student = await Student.create({
			firstName,
			lastName,
			middlename,
			email,
			parentEmail,
			password: hashedPass,
			parentPhoneNumber,
			status,
			image: public_id,
			dob,
			house,
			_class: _class,
			post,
			stateOfOrigin,
			gender,
			address
		})

		if (student) {
			res.status(201).json({
				message: 'student has been registered successfully',
				status: 'ok',
				data: student,
			})
		} else {
			res.status(400)
			throw new Error('Invalid data provided.')
		}
	} catch (error) {
		next(error);
	}
})

export const admin_get_all_students = asyncHandler(async (req, res, next) => {
	try {
		const { page, pageSize } = req.query;
		const students = await Student.find({})
			.skip((page - 1) * pageSize)
			.limit(pageSize)
			.populate('_class', 'name')
			.populate('post', 'name');
		const totalStudents = await Student.countDocuments();
		const totalPages = Math.ceil(totalStudents / pageSize);

		res.json({
			status: "ok",
			message: "all teachers retrieved",
			data: {
				students,
				totalStudents,
				currentPage: Number(page),
				totalPages,
			}
		})
	} catch (error) {
		next(error);
	}
})

export const admin_search_student = asyncHandler(async (req, res, next) => {
	try {
		const pipeline = [
			{
				$match: {},
			}
		];

		const results = await Student.aggregate(pipeline);
		const sessionIds = results.map(t => t._class);
		const populatedStudents = await Student.populate(results, { path: '_class', select: 'name' });
		const sessionIds1 = results.map(t => t._class);
		const populatedStudents1 = await Student.populate(results, { path: 'post', select: 'name' });

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

export const delete_single_teacher = asyncHandler(async (req, res) => {
	const result = await Result.find({ created_by: req.params.id })
	if (result.length > 0) {
		throw new Error("Sorry, this teacher can't be deleted you can only modify their status")
	}
	const teacherDetail = await Teacher.findById(req.params.id)
	if (teacherDetail) {
		const result = await cloudinary.uploader.destroy(teacherDetail.image);
		if (result.result === 'ok') {
			console.log(`Image with public ID ${teacherDetail.image} deleted successfully.`);
		} else {
			console.error('Error deleting image:', result);
		}
	} else {
		res.json({ message: "Teacher not found" })
	}
	const customer = await Teacher.findByIdAndDelete(req.params.id)
	if (customer) {
		res.json({
			status: "ok",
			message: "Teacher deleted successfully",
		})
	} else {
		res.json({ message: "Teacher not found" })
	}
})

export const delete_single_student = asyncHandler(async (req, res) => {
	const teacherDetail = await Student.findById(req.params.id)
	if (teacherDetail) {
		const result = await cloudinary.uploader.destroy(teacherDetail.image);
		if (result.result === 'ok') {
			console.log(`Image with public ID ${teacherDetail.image} deleted successfully.`);
		} else {
			console.error('Error deleting image:', result);
		}
	} else {
		res.json({ message: "Student not found" })
	}
	const deleteReults = await Result.deleteMany({ student: req.params.id })
	if (deleteReults) {
		const customer = await Student.findByIdAndDelete(req.params.id)
		if (customer) {
			res.json({
				status: "ok",
				message: "Student deleted successfully",
			})
		} else {
			res.json({ message: "Student not found" })
		}
	} else {
		res.json({ message: "something went wrong" })
	}
})

export const delete_single_parent = asyncHandler(async (req, res) => {
	const teacherDetail = await Parent.findById(req.params.id)
	if (teacherDetail) {
		const result = await cloudinary.uploader.destroy(teacherDetail.image);
		if (result.result === 'ok') {
			console.log(`Image with public ID ${teacherDetail.image} deleted successfully.`);
		} else {
			console.error('Error deleting image:', result);
		}
	} else {
		res.json({ message: "Student not found" })
	}
	const customer = await Parent.findByIdAndDelete(req.params.id)
	if (customer) {
		res.json({
			status: "ok",
			message: "Parent deleted successfully",
		})
	} else {
		res.json({ message: "Student not found" })
	}
})

export const delete_single_news = asyncHandler(async (req, res) => {
	const teacherDetail = await News.findById(req.params.id)
	if (teacherDetail) {
		const result = await cloudinary.uploader.destroy(teacherDetail.image);
		if (result.result === 'ok') {
			console.log(`Image with public ID ${teacherDetail.image} deleted successfully.`);
		} else {
			console.error('Error deleting image:', result);
		}
	} else {
		res.json({ message: "News not found" })
	}
	const customer = await News.findByIdAndDelete(req.params.id)
	if (customer) {
		res.json({
			status: "ok",
			message: "News deleted successfully",
		})
	} else {
		res.json({ message: "News not found" })
	}
})

export const delete_single_image = asyncHandler(async (req, res) => {
	const teacherDetail = await Gallery.findById(req.params.id)
	if (teacherDetail) {
		const result = await cloudinary.uploader.destroy(teacherDetail.image);
		if (result.result === 'ok') {
			console.log(`Image with public ID ${teacherDetail.image} deleted successfully.`);
		} else {
			console.error('Error deleting image:', result);
		}
	} else {
		res.json({ message: "Image not found" })
	}
	const customer = await Gallery.findByIdAndDelete(req.params.id)
	if (customer) {
		res.json({
			status: "ok",
			message: "Image deleted successfully",
		})
	} else {
		res.json({ message: "Image not found" })
	}
})

export const delete_single_session = asyncHandler(async (req, res) => {
	const terms = await Term.find({ session: req.params.id })
	if (terms.length > 0) {
		const arrayOfIds = terms.map(obj => obj._id);
		const deleteReultsr = await Result.deleteMany({ term: { $in: arrayOfIds } })
		if (deleteReultsr) {
			const deleteReults = await Term.deleteMany({ session: req.params.id })
		}
	}
	const deleteEvents = await Event.deleteMany({ esession: req.params.id })
	if (deleteEvents) {
		const customer = await Session.findByIdAndDelete(req.params.id)
		if (customer) {
			res.json({
				status: "ok",
				message: "Session deleted successfully",
			})
		} else {
			res.json({ message: "Session not found" })
		}
	}
})

export const delete_single_term = asyncHandler(async (req, res) => {
	const deleteReults = await Result.deleteMany({ term: req.params.id })
	const deleteEvents = await Event.deleteMany({ term: req.params.id })
	if (deleteEvents && deleteReults) {
		const customer = await Term.findByIdAndDelete(req.params.id)
		if (customer) {
			res.json({
				status: "ok",
				message: "Term deleted successfully",
			})
		} else {
			res.json({ message: "Term not found" })
		}
	} else {
		res.json({ message: "something went wrong" })
	}
})

export const delete_single_reesult = asyncHandler(async (req, res) => {
	const customer = await Result.findByIdAndDelete(req.params.id)
	if (customer) {
		res.json({
			status: "ok",
			message: "Result deleted successfully",
		})
	} else {
		res.json({ message: "Result not found" })
	}
})

export const delete_single_event = asyncHandler(async (req, res) => {
	const customer = await Event.findByIdAndDelete(req.params.id)
	if (customer) {
		res.json({
			status: "ok",
			message: "Event deleted successfully",
		})
	} else {
		res.json({ message: "Event not found" })
	}
})

export const admin_get_results = asyncHandler(async (req, res, next) => {
	try {
		const {
			_class,
			term,
			subject,
		} = req.body
		const result = await Result.find({ term, subject, _class })
			.populate("student", "firstName middlename lastName")
			.populate("created_by", "firstName lastName")
		if (result) {
			res.status(201).json({
				message: 'students results details',
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

export const admin_get_broadsheet = asyncHandler(async (req, res, next) => {
	try {
		const {
			_class,
			term
		} = req.body
		const result = await Result.find({ term, _class })
			.populate("student", "firstName middlename lastName")
			.populate("created_by", "firstName lastName")
			.populate("subject", "name")
		// const students = result.map((e)=> e.student)
		const subjects = result.map((e) => e.subject)
		if (result) {
			res.status(201).json({
				message: 'broadsheet',
				status: 'ok',
				data: {
					result: result,
					// students: students,
					subjects: subjects
				}
			})
		} else {
			throw new Error('student does not exist')
		}
	} catch (error) {
		next(error);
	}
})

export const update_admin_password = asyncHandler(async (req, res, next) => {
	try {
		const { newPassword, currentPassword } = req.body
		if (!newPassword) {
			return res.status(400).json({ message: 'New password is required.' });
		}
		const teacher = await Admin.findById(req.params.id)
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

export const update_teacher_data = asyncHandler(async (req, res, next) => {
	try {
		const addmin = await Teacher.findById(req.params.id)
		const {
			firstName,
			lastName,
			middlename,
			email,
			phoneNumber,
			status,
			dob,
			subject,
			qualification,
			biography,
			post,
			title,
			department,
			image,
			access,
			gender,
			address
		} = req.body
		if (image) {
			const studentExists = await Teacher.find({ email })
			if (studentExists.length > 0) {
				throw new Error('Sorry, this teacher already exists')
			}
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
			if (public_id) {
				const teacherDetail = await Teacher.findById(req.params.id)
				if (teacherDetail) {
		
					const result = await cloudinary.uploader.destroy(teacherDetail.image);
		
					if (result.result === 'ok') {
						console.log(`Image with public ID ${teacherDetail.image} deleted successfully.`);
					} else {
						console.error('Error deleting image:', result);
					}
				} else {
					res.json({ message: "Image not found" })
				}
			}
			if (addmin) {
				addmin.firstName = firstName || addmin.firstName
				addmin.lastName = lastName || addmin.lastName
				addmin.middlename = middlename || addmin.middlename
				addmin.email = email || addmin.email
				addmin.phoneNumber = phoneNumber || addmin.phoneNumber
				addmin.status = status || addmin.status
				addmin.dob = dob || addmin.dob
				addmin.subject = subject || addmin.subject
				addmin.qualification = qualification || addmin.qualification
				addmin.biography = biography || addmin.biography
				addmin.post = post || addmin.post
				addmin.title = title || addmin.title
				addmin.department = department || addmin.department
				addmin.image = public_id || addmin.image
				addmin.access = access || addmin.access
				addmin.gender = gender || addmin.gender
				addmin.address = address || addmin.address
				const updated = await addmin.save()
				if (updated) {
					res.status(201).json({
						message: 'Teacher data has been updated!!',
						status: 'ok',
						data: updated
					})
				}
			} else {
				res.status(401)
				throw new Error('Something went wrong.')
			}
		} else {
			const studentExists = await Teacher.find({ email })
			if (studentExists.length > 0) {
				throw new Error('Sorry, this teacher already exists')
			}
			if (addmin) {
				addmin.firstName = firstName || addmin.firstName
				addmin.lastName = lastName || addmin.lastName
				addmin.middlename = middlename || addmin.middlename
				addmin.email = email || addmin.email
				addmin.phoneNumber = phoneNumber || addmin.phoneNumber
				addmin.status = status || addmin.status
				addmin.dob = dob || addmin.dob
				addmin.subject = subject || addmin.subject
				addmin.qualification = qualification || addmin.qualification
				addmin.biography = biography || addmin.biography
				addmin.post = post || addmin.post
				addmin.title = title || addmin.title
				addmin.department = department || addmin.department
				addmin.access = access || addmin.access
				addmin.gender = gender || addmin.gender
				addmin.address = address || addmin.address
				const updated = await addmin.save()
				if (updated) {
					res.status(201).json({
						message: 'Teacher data has been updated!!',
						status: 'ok',
						data: updated
					})
				}
			} else {
				res.status(401)
				throw new Error('Something went wrong.')
			}
		}
	} catch (error) {
		next(error);
	}
})

export const update_parent_data = asyncHandler(async (req, res, next) => {
	try {
		const addmin = await Parent.findById(req.params.id)
		const {
			firstName,
			lastName,
			email,
			phoneNumber,
			title,
			image,
			gender,
		} = req.body
		if (image) {
			const studentExists = await Parent.find({ email })
			if (studentExists.length > 0) {
				throw new Error('Sorry, this parent already exists')
			}
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
			if (public_id) {
				const teacherDetail = await Parent.findById(req.params.id)
				if (teacherDetail) {
		
					const result = await cloudinary.uploader.destroy(teacherDetail.image);
		
					if (result.result === 'ok') {
						console.log(`Image with public ID ${teacherDetail.image} deleted successfully.`);
					} else {
						console.error('Error deleting image:', result);
					}
				} else {
					res.json({ message: "Image not found" })
				}
			}
			if (addmin) {
				addmin.firstName = firstName || addmin.firstName
				addmin.lastName = lastName || addmin.lastName
				addmin.email = email || addmin.email
				addmin.phoneNumber = phoneNumber || addmin.phoneNumber
				addmin.title = title || addmin.title
				addmin.image = public_id || addmin.image
				addmin.gender = gender || addmin.gender
				const updated = await addmin.save()
				if (updated) {
					res.status(201).json({
						message: 'parent data has been updated!!',
						status: 'ok',
						data: updated
					})
				}
			} else {
				res.status(401)
				throw new Error('Something went wrong.')
			}
		} else {
			const studentExists = await Parent.find({ email })
			if (studentExists.length > 0) {
				throw new Error('Sorry, this parent already exists')
			}
			if (addmin) {
				addmin.firstName = firstName || addmin.firstName
				addmin.lastName = lastName || addmin.lastName
				addmin.email = email || addmin.email
				addmin.phoneNumber = phoneNumber || addmin.phoneNumber
				addmin.title = title || addmin.title
				addmin.gender = gender || addmin.gender
				const updated = await addmin.save()
				if (updated) {
					res.status(201).json({
						message: 'Parent data has been updated!!',
						status: 'ok',
						data: updated
					})
				}
			} else {
				res.status(401)
				throw new Error('Something went wrong.')
			}
		}
	} catch (error) {
		next(error);
	}
})

export const update_student_data = asyncHandler(async (req, res, next) => {
	try {
		const addmin = await Student.findById(req.params.id)
		const {
			firstName,
			lastName,
			middlename,
			email,
			parentEmail,
			parentPhoneNumber,
			status,
			image,
			dob,
			house,
			_class,
			post,
			stateOfOrigin,
			gender,
			address
		} = req.body
		if (image) {
			const studentExists = await Student.find({ email })
			if (studentExists.length > 0) {
				throw new Error('Sorry, this student already exists')
			}
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
			if (public_id) {
				const teacherDetail = await Student.findById(req.params.id)
				if (teacherDetail) {
		
					const result = await cloudinary.uploader.destroy(teacherDetail.image);
		
					if (result.result === 'ok') {
						console.log(`Image with public ID ${teacherDetail.image} deleted successfully.`);
					} else {
						console.error('Error deleting image:', result);
					}
				} else {
					res.json({ message: "Image not found" })
				}
			}
			if (addmin) {
				addmin.firstName = firstName || addmin.firstName
				addmin.lastName = lastName || addmin.lastName
				addmin.middlename = middlename || addmin.middlename
				addmin.email = email || addmin.email
				addmin.status = status || addmin.status
				addmin.dob = dob || addmin.dob
				addmin.parentEmail = parentEmail || addmin.parentEmail
				addmin.parentPhoneNumber = parentPhoneNumber || addmin.parentPhoneNumber
				addmin._class = _class || addmin._class
				addmin.post = post || addmin.post
				addmin.stateOfOrigin = stateOfOrigin || addmin.stateOfOrigin
				addmin.house = house || addmin.house
				addmin.image = public_id || addmin.image
				addmin.gender = gender || addmin.gender
				addmin.address = address || addmin.address
				const updated = await addmin.save()
				if (updated) {
					res.status(201).json({
						message: 'Student data has been updated!!',
						status: 'ok',
						data: updated
					})
				}
			} else {
				res.status(401)
				throw new Error('Something went wrong.')
			}
		} else {
			const studentExists = await Student.find({ email })
			if (studentExists.length > 0) {
				throw new Error('Sorry, this student already exists')
			}
			if (addmin) {
				addmin.firstName = firstName || addmin.firstName
				addmin.lastName = lastName || addmin.lastName
				addmin.middlename = middlename || addmin.middlename
				addmin.email = email || addmin.email
				addmin.status = status || addmin.status
				addmin.dob = dob || addmin.dob
				addmin.parentEmail = parentEmail || addmin.parentEmail
				addmin.parentPhoneNumber = parentPhoneNumber || addmin.parentPhoneNumber
				addmin._class = _class || addmin._class
				addmin.post = post || addmin.post
				addmin.stateOfOrigin = stateOfOrigin || addmin.stateOfOrigin
				addmin.house = house || addmin.house
				addmin.gender = gender || addmin.gender
				addmin.address = address || addmin.address
				const updated = await addmin.save()
				if (updated) {
					res.status(201).json({
						message: 'Student data has been updated!!',
						status: 'ok',
						data: updated
					})
				}
			} else {
				res.status(401)
				throw new Error('Something went wrong.')
			}
		}
	} catch (error) {
		next(error);
	}
})

export const update_news_data = asyncHandler(async (req, res, next) => {
	try {
		const addmin = await News.findById(req.params.id)
		const {
			image,
			title,
			body
		} = req.body
		if (image) {
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
			if (public_id) {
				const teacherDetail = await News.findById(req.params.id)
				if (teacherDetail) {
		
					const result = await cloudinary.uploader.destroy(teacherDetail.image);
		
					if (result.result === 'ok') {
						console.log(`Image with public ID ${teacherDetail.image} deleted successfully.`);
					} else {
						console.error('Error deleting image:', result);
					}
				} else {
					res.json({ message: "Image not found" })
				}
			}
			if (addmin) {
				addmin.image = public_id || addmin.image
				addmin.title = title || addmin.title
				addmin.body = body || addmin.body
				const updated = await addmin.save()
				if (updated) {
					res.status(201).json({
						message: 'News data has been updated!!',
						status: 'ok',
						data: updated
					})
				}
			} else {
				res.status(401)
				throw new Error('Something went wrong.')
			}
		} else {
			if (addmin) {
				addmin.title = title || addmin.title
				addmin.body = body || addmin.body
				const updated = await addmin.save()
				if (updated) {
					res.status(201).json({
						message: 'News data has been updated!!',
						status: 'ok',
						data: updated
					})
				}
			} else {
				res.status(401)
				throw new Error('Something went wrong.')
			}
		}
	} catch (error) {
		next(error);
	}
})

export const update_image_data = asyncHandler(async (req, res, next) => {
	try {
		const addmin = await Gallery.findById(req.params.id)
		const {
			image,
			title,
		} = req.body
		if (image) {
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
			if (public_id) {
				const teacherDetail = await Gallery.findById(req.params.id)
				if (teacherDetail) {
		
					const result = await cloudinary.uploader.destroy(teacherDetail.image);
		
					if (result.result === 'ok') {
						console.log(`Image with public ID ${teacherDetail.image} deleted successfully.`);
					} else {
						console.error('Error deleting image:', result);
					}
				} else {
					res.json({ message: "Image not found" })
				}
			}
			if (addmin) {
				addmin.image = public_id || addmin.image
				addmin.title = title || addmin.title
				const updated = await addmin.save()
				if (updated) {
					res.status(201).json({
						message: 'News data has been updated!!',
						status: 'ok',
						data: updated
					})
				}
			} else {
				res.status(401)
				throw new Error('Something went wrong.')
			}
		} else {
			if (addmin) {
				addmin.title = title || addmin.title
				const updated = await addmin.save()
				if (updated) {
					res.status(201).json({
						message: 'News data has been updated!!',
						status: 'ok',
						data: updated
					})
				}
			} else {
				res.status(401)
				throw new Error('Something went wrong.')
			}
		}
	} catch (error) {
		next(error);
	}
})

export const update_session_data = asyncHandler(async (req, res, next) => {
	try {
		const addmin = await Session.findById(req.params.id)
		const {
			from,
			to,
		} = req.body
		const sessionExists = await Session.find({ $or: [{ from }, { to }] })
		if (sessionExists.length > 0) {
			throw new Error('Sorry, a session starts or ends with this year')
		}
		if (addmin) {
			addmin.from = from || addmin.from
			addmin.to = to || addmin.to
			const updated = await addmin.save()
			if (updated) {
				res.status(201).json({
					message: 'Session has been updated!!',
					status: 'ok',
					data: updated
				})
			}
		} else {
			res.status(401)
			throw new Error('Something went wrong.')
		}
	} catch (error) {
		next(error);
	}
})

export const update_term_data = asyncHandler(async (req, res, next) => {
	try {
		const addmin = await Term.findById(req.params.id)
		const {
			session,
			tname
		} = req.body
		const termExists = await Term.find({ $and: [{ session }, { tname }] })
		if (termExists.length > 0) {
			throw new Error('Sorry, this term exists already')
		}
		if (addmin) {
			addmin.session = session || addmin.session
			addmin.tname = tname || addmin.tname
			const updated = await addmin.save()
			if (updated) {
				res.status(201).json({
					message: 'Term has been updated!!',
					status: 'ok',
					data: updated
				})
			}
		} else {
			res.status(401)
			throw new Error('Something went wrong.')
		}
	} catch (error) {
		next(error);
	}
})

export const update_event_data = asyncHandler(async (req, res, next) => {
	try {
		const addmin = await Event.findById(req.params.id)
		const {
			esession,
			term,
			month,
			day,
			event
		} = req.body

		if (addmin) {
			addmin.esession = esession || addmin.esession
			addmin.term = term || addmin.term
			addmin.month = month || addmin.month
			addmin.day = day || addmin.day
			addmin.event = event || addmin.event
			const updated = await addmin.save()
			if (updated) {
				res.status(201).json({
					message: 'Event has been updated!!',
					status: 'ok',
					data: updated
				})
			}
		} else {
			res.status(401)
			throw new Error('Something went wrong.')
		}
	} catch (error) {
		next(error);
	}
})

export const payment = asyncHandler(async (req, res, next) => {
	try {
		const {
			student,
			term,
			paid
		} = req.body

		const paymentExists = await Payment.find({ student: student, term: term })

		if (paymentExists.length > 0) {
			throw new Error(next('payment already made'))
		}

		const payment = await Payment.create({
			student,
			term,
			paid
		})

		if (payment) {
			res.status(201).json({
				message: 'success',
				status: 'ok',
				data: payment,
			})
		} else {
			res.status(400)
			throw new Error('Something went wrong.')
		}
	} catch (error) {
		res.send({ error: error })
	}
})

export const payment_class = asyncHandler(async (req, res, next) => {
	try {
		const {
			_class
		} = req.body

		const students = await Student.find({ _class: _class })
		const term = await Term.find({})
		const payment = await Payment.find({ term: term[term.length - 1] })
		const paid = await students.filter((e) => payment.some((ee) => e._id.toString() === ee.student.toString()))
		const notpaid = await students.filter((e) => !payment.some((ee) => e._id.toString() === ee.student.toString()))
		if (students) {
			res.status(201).json({
				message: 'success',
				status: 'ok',
				data: {
					notPaid: notpaid,
					paid: paid
				}
			})
		} else {
			res.status(400)
			throw new Error('Something went wrong.')
		}
	} catch (error) {
		res.send({ error: error })
	}
})

export const payment_delete = asyncHandler(async (req, res, next) => {
	try {
		const {
			student
		} = req.body

		const term = await Term.find({})
		const payment = await Payment.findOneAndDelete({ student: student, term: term[term.length - 1] });

		if (payment) {
			res.status(201).json({
				message: 'success',
				status: 'ok',
				data: payment
			})
		} else {
			res.status(400)
			throw new Error(next('Something went wrong.'))
		}
	} catch (error) {
		res.send({ error: error })
	}
})

export const update_fee = asyncHandler(async (req, res, next) => {
	try {
		const {
			_class,
			amount
		} = req.body;

		const students = await Student.find({ _class });
		const updatedStudents = await Promise.all(students.map(async (student) => {
			
			student.tdue = (Number(student.tdue) || 0) + amount;

			return student.save();
		}));

		if (updatedStudents.length > 0) {
			return res.status(201).json({
				message: 'Fees have been updated successfully!',
				status: 'ok',
				data: updatedStudents
			});
		} else {
			return res.status(404).json({
				message: 'No student found for the provided class!',
				status: 'error'
			});
		}
	} catch (error) {
		next(error);
	}
});

export const update_paid = asyncHandler(async (req, res, next) => {
	try {
		const {
			amount,
			id
		} = req.body
		const student = await Student.findOne({_id: id})

		if (student) {
			student.tpaid = (Number(student.tpaid) || 0) + amount;
			const updated = await student.save()
			if (updated) {
				res.status(201).json({
					message: 'Payment has been updated!!',
					status: 'ok',
					data: updated
				})
			}
		} else {
			res.status(401)
			throw new Error('Something went wrong.')
		}
	} catch (error) {
		next(error);
	}
})

export const get_by_class = asyncHandler(async (req, res, next) => {
	try {
		const {
			_class
		} = req.body
		const student = await Student.find({_class})

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