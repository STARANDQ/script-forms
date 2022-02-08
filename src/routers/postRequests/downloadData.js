import fs from 'fs'
import File from '../../modules/file.js';

export default (req, res) => {
  File.findOne({ name: req.body.file }, (err, data) => {
    if (err || !data) return res.send({ error: 'Данные не найдены' })

    fs.readFile(data.path, 'utf-8', (err, content) => {
      if (err) return res.send({ error: 'Данные не найдены' })
  
      return res.send({ success: true, result: content })
    });
  })
}

