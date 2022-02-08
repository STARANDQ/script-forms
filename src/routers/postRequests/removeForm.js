import FilledForm from '../../modules/filledForm.js'
import Form from '../../modules/form.js'
import User from '../../modules/user.js'

export default (req, res) => {
  try {
    User.findOne({ unique_id: req.session.userId }, (err, data) => {
      if (err || !data) return res.render('login.ejs', { res })
    })

    FilledForm.find({ formID: req.body.id }).deleteMany().then(() => {

      Form.findOne({ unique_id: req.body.id })
        .deleteOne().then((err, data) => {
          return res.send({ success: true })
        })
    })

    
  } catch (error) {
    return res.send({ error: "Форма не найдена" })
  }
}
