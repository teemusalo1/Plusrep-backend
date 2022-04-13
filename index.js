/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
var bodyParser = require('body-parser')
var post = require('./models/post')
const usersRouter = require('./routes/users')
const tagsRouter = require('./routes/tags')
const postsRouter = require('./routes/posts')
const commentsRouter = require('./routes/comments')
const googleAuthRouter = require('./routes/googleAuth')
const upload = require('./routes/upload')
const Grid = require('gridfs-stream')
const app = express()
require('dotenv').config()
const connection = require('./db')



const url = process.env.MONGODB_URI2
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
  console.log('connected')
})

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

let gfs, gridfsBucket
connection()
const conn = mongoose.connection
conn.once('open', function () {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'photos',
  })
  gfs = Grid(conn.db, mongoose.mongo)
  console.log('toimiiko tää')
  gfs.collection('photos')
})



app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/file', upload)
app.use('/', googleAuthRouter)
app.use('/', usersRouter)
app.use('/', postsRouter)
app.use('/', commentsRouter)
app.use('/', tagsRouter)


app.get('/file/:filename', async (req, res) => {
 
  const file = await gfs.files.findOne({ filename: req.params.filename })
  console.log(file)
  const readStream = gridfsBucket.openDownloadStream(file._id)
  console.log('pääseekö')
  console.log(readStream)
  readStream.pipe(res)
  console.log(readStream.pipe(res))

}
)

module.exports.getUserFromPost = (id, callback) => {
  post
    .find({ user: id }, callback)
    .sort({ date: 1 })
    .populate({ path: '/api/posts/get_user_from_post' })
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired',
    })
  }
  next(error)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
