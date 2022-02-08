import FilledForm from '../../modules/filledForm.js'
import User from '../../modules/user.js'

export default (req, res) => {
  User.findOne({ unique_id: req.session.userId }, (err, data) => {
    if (!data) {
      return res.redirect('/login')
     }
  })

  FilledForm.distinct( "id_klient" ).then((data) => {
    return res.render('filterByKlient.ejs', { klients: data })
  }).catch((err) => {
    return res.redirect('/profile')
  })
}