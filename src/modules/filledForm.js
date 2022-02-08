import mongoose from 'mongoose'
const { model, Schema } = mongoose

const FilledForm = model('FilledForm', new Schema({
	unique_id: Number,
	formID: String,
	formName: String,
	id_klient: Number,
	id_code: Number,
	weight: Number,
	fullWeight: Number,
	fields: [Object],
	keys: [Object],
	createdAt: {
		type: Date,
		default: Date.now,
	},
}))

export default FilledForm