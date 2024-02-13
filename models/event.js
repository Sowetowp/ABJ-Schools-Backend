import mongoose from 'mongoose'

const eventSchema = mongoose.Schema(
	{
		esession: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Session',
		},
		term: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Term',
		},
		month: { type: String, required: true },
        day: { type: Number, required: true },
        event: { type: String, required: true }
    }
)

const Event = mongoose.model('Event', eventSchema)

export default Event