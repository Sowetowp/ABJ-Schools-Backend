import mongoose from 'mongoose'

const departmentSchema = mongoose.Schema(
	{
        name: {type: String},
	}
)

const Department = mongoose.model('Department', departmentSchema)

export default Department