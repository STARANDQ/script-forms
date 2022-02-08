import User from '../../modules/user.js'

export default (req, res) => {
  try {
    User.findOne({ unique_id: req.session.userId }, (err, data) => {
      if (err || !data) return res.render('login.ejs', { res })
    })

    User.findOne({ unique_id: req.body.id })
      .deleteOne().then((err, data) => {
        return res.send({ success: true })
      })
    
  } catch (error) {
    return res.send({ error: "Пользователь не обновлен" })
  }
}
