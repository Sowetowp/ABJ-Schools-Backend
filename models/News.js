import mongoose from 'mongoose'

const newsSchema = mongoose.Schema(
	{
		image: { type: String },
		title: { type: String },
        body: { type: String},
	},
	{
		timestamps: true,
	}
)

const News = mongoose.model('News', newsSchema)

export default News
