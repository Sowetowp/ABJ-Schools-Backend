import mongoose from 'mongoose'

const teacherSchema = mongoose.Schema(
	{
		firstName: { type: String, required: true},
		lastName: { type: String, required: true},
		middlename: { type: String},
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		phoneNumber: { type: String, required: true, index: true, sparse: true },
		status: {
			type: String,
			enum: ['active', 'retired', "sacked"],
			default: 'active',
		},
		image: { type: String },
		dob: { type: Date },
        subject: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Subject',
		}],
        qualification: { type: String},
        biography: {type: String},
		address: {type: String},
		title: {type: String},
        post: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
		}],
        department: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Department',
		}],
		access: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Classes',
		}],
		gender: {type: String}
	},
	{
		timestamps: true,
	}
)

const Teacher = mongoose.model('Teacher', teacherSchema)

export default Teacher
