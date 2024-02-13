import mongoose from 'mongoose'

const paymentSchema = mongoose.Schema(
	{
		term: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Term'
		},
        student: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Student',
		},
        paid: {
            type: Boolean,
            default: true
        }
	},
	{
		timestamps: true,
	}
)

const Payment = mongoose.model('Payment', paymentSchema)

export default Payment