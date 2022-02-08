import User from '../../modules/user.js'

export default (req, res) => {
  try {
    User.findOne({ unique_id: req.session.userId }, (err, data) => {
      if (err || !data) return res.render('login.ejs', { res })
    })

    User.findOne({ unique_id: req.body.id }, (err, data) => {
      if (err || !data) return res.send({ error: "Пользователь не обновлен" })
      else {
        User.findOne({ 
        unique_id: { $ne: req.body.id },
        login: req.body.login }, (err, data) => {
          if (data) return res.send({ error: "Логин используется" })
          else {
            User.findOneAndUpdate({ unique_id: req.body.id }, {
              "login": req.body.login,
              "name": req.body.name,
              "surname": req.body.surname,
              "patronymic": req.body.patronymic,
              "role": req.body.role,
              "email": req.body.email,
              "password": req.body.password,
            }, (err, data) => {
              if (err || !data) return res.send({ error: "Пользователь не обновлен" })
              return res.send({ success: true })
            })
          }
        })
      }
    })
  } catch (error) {
    return res.send({ error: "Пользователь не обновлен" })
  }
}
