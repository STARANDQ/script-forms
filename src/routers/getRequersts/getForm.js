import mongoose from "mongoose"
import Form from "../../modules/form.js"

export default (req, res) => {
  const { id: formID } = req.params

  if (!mongoose.Types.ObjectId.isValid(formID))
    return res.render('formPage.ejs', { data: { status: false }})

  const id_code = { id_code: req.query.id_code }
  const id_klient = { id_klient: req.query.id_klient }
  
  delete req.query.id_code;
  delete req.query.id_klient;

  const keys = Object.keys(req.query || {}).map((key) => ({ $elemMatch: {
    label: key,
  }}));

  
  Form.findOne({ _id: formID, keys: { $all: keys }}, (err, data) => {
    if (err || !data || !data.status || !id_code || !id_klient)
      return res.render('formPage.ejs', { data: { status: false }})

    return res.render('formPage.ejs', {
      data,
      ...id_code,
      ...id_klient,
    })
  })
}