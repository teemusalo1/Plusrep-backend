/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const cors = require('cors')
const express = require('express')
const app = express()
require('dotenv').config()
const googleAuthRouter = require('./routes/googleAuth')

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


app.use('/', googleAuthRouter)

app.get('/', (request, response) => {
  response.send('<h1>You are now logged. Hopefully</h1>')
})

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