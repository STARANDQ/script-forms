import User from '../../modules/user.js'

export default (req, res) => {
  User.findOne({ unique_id: req.session.userId }, (err, data) => {
    if (!!data && data.role !== "admin") {
      return res.redirect('/profile')
    } else if (!data) {
      return res.redirect('/login')
    }
  })

  const profileID = (req._parsedUrl.pathname).replace("/user/", "")

  User.findOne({ login: profileID }, (err, data) => {
      if (!data) {
        res.redirect('/users');
      } else {
        return res.render('userEdit.ejs', {
          "id": data.unique_id,
          "name": data.name,
          "surname": data.surname,
          "patronymic": data.patronymic,
          "role": data.role,
          "email": data.email,
          "login": data.login,
          "password": data.password,
          "supervisor": data.supervisor,
        })
      }
  });
}