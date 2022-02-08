import Form from '../../modules/form.js'
import User from '../../modules/user.js'

export default (req, res) => {
  try {
    User.findOne({ unique_id: req.session.userId }, (err, data) => {
      if (err || !data) return res.render('login.ejs', { res })
    })

    const data = req.body
    if (!data) {
      return res.send({ error: "Не удалось обновить форму" })
    }
    if (!data.name) {
      return res.send({ error: "Имя формы обязательно" })
    }
    if (!data.keys || !data.keys.length) {
      return res.send({ error: "Создайте параметры(ключи) для формы" })
    }

    Form.findOne({ unique_id: req.body.id }, (err, existData) => {
      if (err || !existData) return res.send({ error: "Форма не обновлена" })

      Form.findOneAndUpdate({ unique_id: data.id }, {
        unique_id: data.id,
        name: data.name,
        status: data.status,
        status: data.status,
        criticalWeight: data.criticalWeight,
        weight: data.weight,
        keys: data.keys,
        fields: data.fields,
      }, (err, updateData) => {
        if (err || !updateData) return res.send({ error: "Пользователь не обновлен" })
        return res.send({ success: true })
      })
    })
  } catch (error) {
    return res.send({ error: "Форма не обновлена" })
  }
}
