import mongoose from 'mongoose'

const assignmentRecordSchema = mongoose.Schema(
	{
        assignment: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Assignment',
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

const AssignmentRecord = mongoose.model('AssignmentRecord', assignmentRecordSchema)

export default AssignmentRecord