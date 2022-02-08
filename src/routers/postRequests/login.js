import User from '../../modules/user.js'

export default (req, res) => {
  User.findOne({ login: req.body.login }, (err, data) => {
    if(!data){
        return res.send({ "Success": "User not found" });
    }else
    if (data) {
        if (data.password === req.body.password) {
            req.session.userId = data.unique_id;
            return res.send({ "Success": "Success!" });
        } else {
            return res.send({ "Success": "Wrong password!" });
        }
    } else {
        return res.send({ "Success": "This Username Is not regestered!" });
    }
  })
}