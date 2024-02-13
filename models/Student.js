import mongoose from 'mongoose'

const studentSchema = mongoose.Schema(
	{
		firstName: { type: String, required: true},
		lastName: { type: String, required: true},
		middlename: { type: String},
		email: { type: String, required: true },
		parentEmail: { type: String, required: true },
		password: { type: String, required: true },
		parentPhoneNumber: { type: String, required: true, sparse: true },
		status: {
			type: String,
			enum: ['active', 'dismissed', "graduate"],
			default: 'active',
            required: true
		},
		image: { type: String },
		dob: { type: Date },
        house: {
            type: String,
            enum: ["alpha", "jaguar", "dornier", "hercules"],
        },
        _class: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Classes',
		},
        post: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Post',
		},
        stateOfOrigin: {type: String, required: true},
		gender: {type: String, required:true},
		address: {type: String},
		tpaid: { type: Number, default: 0 },
        tdue: { type: Number, default: 0 }
	},
	{
		timestamps: true,
	}
)

const Student = mongoose.model('Student', studentSchema)

export default Student
