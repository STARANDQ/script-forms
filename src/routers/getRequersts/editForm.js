import Form from '../../modules/form.js'
import User from '../../modules/user.js'

export default (req, res) => {
  User.findOne({ unique_id: req.session.userId }, (err, data) => {
    if (!!data && data.role !== "admin") {
      return res.redirect('/profile')
    } else if (!data) {
      return res.redirect('/login')
    }
  })

  const formID = (req._parsedUrl.pathname).replace("/form/", "")

  Form.findOne({ unique_id: formID }, (err, data) => {
      if (err || !data) {
        res.redirect('/forms');
      } else {
        return res.render('formEdit.ejs', {
          id: data.unique_id,
          name: data.name,
          status: data.status,
          criticalWeight: data.criticalWeight,
          weight: data.weight,
          fields: JSON.stringify(data.fields),
          keys: JSON.stringify(data.keys),
          id_code: data.id_code,
          id_klient: data.id_klient,
        })
      }
  });
}