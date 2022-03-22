/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
var bodyParser = require('body-parser')
var post = require('./models/post')
const usersRouter = require('./routes/users')
const postsRouter = require('./routes/posts')
const commentsRouter = require('./routes/comments')
const googleAuthRouter = require('./routes/googleAuth')

const app = express()
require('dotenv').config()

const url = process.env.MONGODB_URI
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

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use(express.static('build'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.set('view engine', 'ejs')

app.use('/', googleAuthRouter)
app.get('/', (request, response) => {
  response.send('<h1>You are now logged. Hopefully</h1>')
})


app.use('/', usersRouter)
app.use('/', postsRouter)
app.use('/', commentsRouter)

module.exports.getUserFromPost = (id, callback) => {
  post.find({ user:id }, callback).sort( { date: 1 } ).populate({ path:'/api/posts/get_user_from_post' })
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}


app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)