import mongoose from 'mongoose'

const caRecordSchema = mongoose.Schema(
	{
        ca: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Ca',
		},
        student: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Student',
		},
        term: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Term',
		},
        score: {type: Number, required: true}
	}
)

const CaRecord = mongoose.model('CaRecord', caRecordSchema)

export default CaRecord