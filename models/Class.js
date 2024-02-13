import mongoose from 'mongoose'

const classSchema = mongoose.Schema(
	{
        name: {type: String},
		classTeacher: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Teacher',
		}
	}
)

const Classes = mongoose.model('Classes', classSchema)

export default Classes