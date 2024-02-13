import mongoose from 'mongoose'

const assignmentSchema = mongoose.Schema(
	{
        title: {type: String, required: true},
        questions: [
            {
                id:{type: Number, required: true},
                questionText: {type: String, required: true},
                options: [
                    {
                        id:{type: String, required: true},
                        optionText: {type: String, required: true},
                        isCorrect: {type: Boolean, required: true}
                    }
                ]
            }
        ],
        subject: {
			type: mongoose.Schema.Types.ObjectId,
            required: true,
			ref: 'Subject'
		},
        classes: [{
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Classes'
		}],
        term: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Term'
		},
        deadline: {type: Date, required: true},
        created_by: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Teacher',
		}
	}
)

const Assignment = mongoose.model('Assignment', assignmentSchema)

export default Assignment