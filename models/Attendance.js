import mongoose from 'mongoose'

const attendanceSchema = mongoose.Schema(
	{
        class: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Classes',
		},
        student: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Student',
		},
        day: { type: Date },
        term: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Term',
		},
        presence: {
            type: Boolean,
            default: true
        }
	}
)

const Attendance = mongoose.model('Attendance', attendanceSchema)

export default Attendance