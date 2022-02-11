import mongoose from 'mongoose'

const { model, Schema } = mongoose

const User = model('User', new Schema({
  unique_id: Number,
  name: String,
  surname: String,
  patronymic: String,
  login: String,
  password: String,
  role: {
    type: String,
    enum: ['admin', 'user', 'client']
  },
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

User.findOne()
  .then(data => {
    if (!data) {
      User.create({
        unique_id: 1,
        login: 'admin',
        password: 'password',
        role: 'admin',
        supervisor: true
      })
    }
  })
  .catch(e => console.error(e))
