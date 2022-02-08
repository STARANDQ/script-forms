import User from '../../modules/user.js'
import FilledForm from '../../modules/filledForm.js'


export default (req, res) => {
  try {
    User.findOne({ unique_id: req.session.userId }, (err, data) => {
      if (err || !data) return res.render('login.ejs', { res })
    })

    const filter = req.body

    const dateQuery = {}
    if (filter.period.from || filter.period.to) dateQuery.createdAt = {}

    if (filter.period.from) dateQuery.createdAt.$gte = new Date(filter.period.from)
    if (filter.period.to) dateQuery.createdAt.$lt = new Date(filter.period.to)

    
    FilledForm.find({
      ...dateQuery,
      id_klient: filter.klient
    })
    .sort({createdAt: -1}).then((data) => {

      return res.send({ success: true, result: data })
    })
      
  } catch (error) {
    return res.send({ error: "Произошла ошибка загрузки данных" })
  }
}
