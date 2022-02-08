import Form from '../../modules/form.js'
import User from '../../modules/user.js'

export default (req, res) => {
  try{
    User.findOne({ unique_id: req.session.userId }, (err, data) => {
      if (err || !data) return res.render('login.ejs', { res })
    })

    const data = req.body
    if (!data) {
      return res.send({ error: "Не удалось создать форму" })
    }
    if (!data.name) {
      return res.send({ error: "Имя формы обязательно" })
    }
    if (!data.keys || !data.keys.length) {
      return res.send({ error: "Создайте параметры(ключи) для формы" })
    }

    const keys = data.keys.map((key) => ({ $elemMatch: {
      label: key.label,
    }}));
    
    Form.findOne({}).sort({createdAt: -1}).then((lastItem) => {
      const form = {
        unique_id: (lastItem?.unique_id || 0) + 1,
        name: data.name,
        status: data.status,
        criticalWeight: data.criticalWeight,
        weight: data.weight,
        fields: data.fields,
        keys: data.keys,
      }

      Form.create(form, (err, data) => {
        if (err) return res.send({ error: "Не удалось создать форму" })

        return res.send({ success: true });
      })
    
    })

  } catch (error) {
    return res.send({ error: "Не удалось создать форму" })
  }

}
