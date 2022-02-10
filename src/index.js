import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import schedule from 'node-schedule'

import mongoose from 'mongoose'
import MongoStore from 'connect-mongo';
import File from './modules/file.js'

import { fileURLToPath } from 'url'
import path, { dirname } from 'path'
import fs from 'fs'

import routers from './routers/index.js'
import SETTINGS from './configs.js' 
import fileGenerate from './routers/generateXmlByDate.js'

const mongoUrl = SETTINGS.mongo === 'local' ?
  process.env.MONGO_URI || 'mongodb://localhost/script' : 'mongodb+srv://starandq:qwerty123@cluster0.1uw1r.mongodb.net/ScriptNew?retryWrites=true&w=majority'

const database = mongoose.connect(mongoUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})

database
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err)
  })

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename);

app.use(session({
  secret: 'sessionsSecret',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl,
  })
}))

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(__dirname + '/views'))
app.use('/', routers)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found')
  err.status = 404
  next(err)
})

// error handler
// define as the last app.use callback
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send(err.message)
})

// listen on port 3300
let port = process.env.PORT || SETTINGS.port
app.listen(port)

const rule = new schedule.RecurrenceRule();
rule.hour = 0;
rule.tz = 'Etc/GMT-3';

schedule.scheduleJob(rule, function(){
  let today = new Date()
  today.setDate(today.getDate() - 1)
  let dateStr = today.toISOString().split('T')[0]
  
  fileGenerate(dateStr).then((result) => {
    const filePath = path.join(__dirname, '..', 'public', `${result.date}.xml`)

    fs.writeFile(
      filePath,
      result.xml,
      { flag: 'wx' },
      (err, data) => {
        if (err) {

          fs.writeFile(
            filePath,
            result.xml,
            (err, data) => {
              if (err) console.log(err)
            }
          );
        } else {
          File.create({
            name: `${result.date}.xml`,
            path: filePath,
          })
        }
      }
    );
  })
})
