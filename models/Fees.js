import mongoose from 'mongoose'

const feesSchema = mongoose.Schema(
	{
		student: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Student',
		},
        tpaid: { type: Number },
        tdue: { type: Number }
	},
	{
		timestamps: true,
	}
)

const Fees = mongoose.model('Fees', feesSchema)

export default Fees