import { response } from 'express'
import User from '../../modules/user.js'

export default (req, res) => {
  User.findOne({ unique_id: req.session.userId }, (err, data) => {
    if (err || !data) return res.render('login.ejs', { res })
  })
  
  const personInfo = req.body

  if ( !personInfo.login
    || !personInfo.role
    || !personInfo.password) {
    res.send()
  } else {
    try {
      User.findOne({ login: personInfo.login }, (err, data) => {
        if (data) return res.send({ error: "Пользователь с таким логином сущесвует" }) 
        else {
          User.findOne({}).sort({createdAt: -1}).then(({unique_id}) => {
  
            User.create({
              unique_id: (unique_id || 0) + 1,
              name: personInfo.name,
              surname: personInfo.surname,
              patronymic: personInfo.patronymic,
              role: personInfo.role,
              email: personInfo.email,
              password: personInfo.password,
              login: personInfo.login
            }, (err, data) => {
              if (err) return res.send({ error: "Не удалось создать пользователя" })
  
              return res.send({ success: true });
            })
          })
        }
      })

    } catch (error) {
      return res.send({ error: "Не удалось создать пользователя" })
    }
  }
}
