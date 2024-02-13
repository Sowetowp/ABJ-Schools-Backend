import mongoose from 'mongoose'

const connectDB = async () => {
	try {
		mongoose.set('strictQuery', false);
		const conn = await mongoose.connect(process.env.MONGO_URI, {
			useUnifiedTopology: true,
			useNewUrlParser: true,
			//useCreateIndex: true,
		})

		console.log(`MongoDB connected: ${conn.connection.host}`)
	} catch (error) {
		console.log(`Error: ${error}`)
		process.exit(1)
	}
}

export default connectDB