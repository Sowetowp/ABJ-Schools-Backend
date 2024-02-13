import mongoose from 'mongoose'

const subSchema = mongoose.Schema(
	{
        email: { type: String},
	}
)

const Sub = mongoose.model('Sub', subSchema)

export default Sub