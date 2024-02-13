import mongoose from 'mongoose'

const resultSchema = mongoose.Schema(
	{
        created_by: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Teacher',
		},
        student: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Student',
		},
		_class: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Classes',
		},
		term: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Term',
		},
		subject: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Subject',
			required: true,
		},
        ca1: {type: Number, required: true},
        ca2: {type: Number, required: true},
        exam: {type: Number, required: true}
    },
	{
		timestamps: true,
	}
)

const Result = mongoose.model('Result', resultSchema)

export default Result
