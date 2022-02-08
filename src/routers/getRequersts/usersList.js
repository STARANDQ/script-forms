import User from '../../modules/user.js'

export default (req, res) => {
  User.findOne({ unique_id: req.session.userId }, (err, data) => {
    if (!!data && data.role !== "admin") {
      return res.redirect('/profile')
    } else if (!data) {
      return res.redirect('/login')
    }
  })

  User.find({}, (err, data) => {
    return res.render('users.ejs', {
        "data": data,
        "userId": req.session.userId
    })
  })
}