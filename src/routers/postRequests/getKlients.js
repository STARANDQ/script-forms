import User from '../../modules/user.js'
import FilledForm from '../../modules/filledForm.js'

export default (req, res) => {
  try {
    User.findOne({ unique_id: req.session.userId }, (err, data) => {
      if (err || !data) return res.render('login.ejs', { res })
    })

    FilledForm.find({}).distinct( "id_klient" ).then((data) => {
      return res.send({ success: true, result: data })
    }).catch((err) => {
      return res.send({ error: "Произошла ошибка загрузки данных" })
    })
  } catch (error) {
    return res.send({ error: "Произошла ошибка загрузки данных" })
  }
}
