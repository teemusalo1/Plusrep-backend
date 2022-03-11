/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const express = require('express')
const mongoose = require('mongoose')

const usersRouter = require('./routes/users')
const postsRouter = require('./routes/posts')
const app = express()
require('dotenv').config()

const url = process.env.MONGODB_URI
mongoose.connect(url)


const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())

app.use(requestLogger)

app.use(express.static('build'))



//täs oli getit
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.use('/', usersRouter)
app.use('/', postsRouter)


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