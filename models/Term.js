import mongoose from 'mongoose'

const termSchema = mongoose.Schema(
	{
        session: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: 'Session',
		},
        tname: { 
            type: String ,
            enum: ['First', 'Second', "Third"],
        },
	}
)

const Term = mongoose.model('Term', termSchema)

export default Term
