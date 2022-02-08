import Form from '../../modules/form.js'
import User from '../../modules/user.js';

export default (req, res) => {
  User.findOne({ unique_id: req.session.userId }, (err, data) => {
    if (!!data && data.role !== "admin") {
      return res.redirect('/profile')
    } else if (!data) {
      return res.redirect('/login')
    }
  })

  Form.find({}).sort({createdAt: -1}).then((data) => {
    return res.render('forms.ejs', {
      "data": data,
      "userId": req.session.userId
    })
  })
}