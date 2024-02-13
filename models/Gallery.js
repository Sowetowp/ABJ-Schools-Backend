import mongoose from 'mongoose'

const gallerySchema = mongoose.Schema(
	{
		image: { type: String },
		title: { type: String },
	},
	{
		timestamps: true,
	}
)

const Gallery = mongoose.model('Gallery', gallerySchema)

export default Gallery