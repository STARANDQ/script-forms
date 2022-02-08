import File from "../../modules/file.js"
import User from "../../modules/user.js"

export default (req, res) => {
  User.findOne({ unique_id: req.session.userId }, (err, data) => {
    if (!!data && data.role !== "admin") {
      return res.redirect('/profile')
    } else if (!data) {
      return res.redirect('/login')
    }
  })

  File.find({}, { name: 1, _id: 0 }).sort({createdAt: -1}).then((data) => {
    return res.send({ data })
  })
}