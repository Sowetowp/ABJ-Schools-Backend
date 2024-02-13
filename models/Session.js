import mongoose from 'mongoose'

const sessionSchema = mongoose.Schema(
	{
		from: { type: Number, require: true},
        to: {type: Number, require: true},
	}
)

const Session = mongoose.model('Session', sessionSchema)

export default Session
