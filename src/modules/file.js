import mongoose from 'mongoose'
const { model, Schema } = mongoose

const File = model('File', new Schema({
	name: {
		unique: true,
		type: String
	},
	path: {
		unique: true,
		type: String
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
}))

export default File