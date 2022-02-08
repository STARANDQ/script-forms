import FilledForm from '../../modules/filledForm.js'
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

  const { id: formID } = req.params

  FilledForm.findOne({ unique_id: formID }, (err, data) => {
      if (err || !data) {
        res.redirect('/filterByKlient');
      } else {

        Form.findOne({ unique_id: data.formID }, (err, form) => {
          // let fields = []
          // if (data.fields.length) {
          //   data.fields.map((el) => {
          //     return {
          //       ...el,
          //       title: form.fields.find((field) => field.label === el.label),
          //     }
          //   })
          // }
          let keys = []
          if (data.keys.length) {
            keys = data.keys.map((el) => {
              const formKey = form.keys.find((key) => key.label === el.label)
              return {
                ...el,
                title: formKey.title,
              }
            })
          }


          return res.render('filledform.ejs', {
            id: data.unique_id,
            formname: form.name,
            weight: form.weight,
            id_code: data.id_code,
            id_klient: data.id_klient,
            fields: JSON.stringify(data.fields),
            keys: JSON.stringify(keys),
          })
        })
      }
  });
}