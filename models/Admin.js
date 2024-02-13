import mongoose from 'mongoose'

const adminSchema = mongoose.Schema(
	{
		firstName: { type: String, require: true},
		lastName: { type: String, require: true},
		middlename: { type: String},
		email: { type: String, require: true, unique: true },
		password: { type: String, require: true },
		phoneNumber: { type: String, require: true, index: true, sparse: true },
		image: { type: String },
		dob: { type: Date },
		gender: {type: String},
		address: {type: String},
	},
	{
		timestamps: true,
	}
)

const Admin = mongoose.model('Admin', adminSchema)

export default Admin
