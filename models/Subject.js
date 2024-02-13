import mongoose from 'mongoose'

const subjectSchema = mongoose.Schema(
	{
        name: {type: String},
	}
)

const Subject = mongoose.model('Subject', subjectSchema)

export default Subject
