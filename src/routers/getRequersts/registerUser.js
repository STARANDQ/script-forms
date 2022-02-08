import User from '../../modules/user.js'

export default (req, res) => {
  User.findOne({ unique_id: req.session.userId }, (err, data) => {
    if (!!data && data.role === "admin") {
      return res.render('register.ejs')
    } else if (!!data) {
      return res.redirect('/profile')
    } else
      return res.redirect('/login')
  })
}