import mongoose from 'mongoose'
const { model, Schema } = mongoose

const User = model('User', new Schema({
	unique_id: Number,
	name: String,
	surname: String,
	patronymic: String,
	login: String,
	password: String,
	role: String,
	email: String,
	supervisor: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
}))

export default User

db.user.insert({unique_id: 1, login: "admin", password: "password", role: "admin", supervisor: true})