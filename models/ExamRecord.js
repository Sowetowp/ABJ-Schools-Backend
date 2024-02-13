import mongoose from 'mongoose'

const examRecordSchema = mongoose.Schema(
	{
        exam: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Exam',
		},
        student: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Student',
		},
        term: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Term',
		},
        score: {type: Number, required: true}
	}
)

const ExamRecord = mongoose.model('ExamRecord', examRecordSchema)

export default ExamRecord