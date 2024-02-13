import mongoose from 'mongoose'

const postSchema = mongoose.Schema(
	{
        name: {type: String},
        category: {
            type: String,
            enum: ["Students", "Teachers"],
            required: true
        }
	}
)

const Post = mongoose.model('Post', postSchema)

export default Post