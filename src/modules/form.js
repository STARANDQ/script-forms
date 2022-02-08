import mongoose from 'mongoose'
const { model, Schema } = mongoose

const Form = model('Form', new Schema({
	unique_id: Number,
	name: String,
	status: Boolean,
	weight: Number,
	criticalWeight: {
		type: Number,
		default: 0,
	},
	fields: [Object],
	keys: [Object],
	createdAt: {
		type: Date,
		default: Date.now,
	},
}))

export default Form