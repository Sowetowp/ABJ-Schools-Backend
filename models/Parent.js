import mongoose from 'mongoose'

const parentSchema = mongoose.Schema(
	{
        title: { type: String, require: true},
		firstName: { type: String, require: true},
		lastName: { type: String, require: true},
		email: { type: String, require: true },
		password: { type: String, require: true },
		phoneNumber: { type: String, require: true, sparse: true },
		image: { type: String },
		gender: {type: String, require:true}
	},
	{
		timestamps: true,
	}
)

const Parent = mongoose.model('Parent', parentSchema)

export default Parent
