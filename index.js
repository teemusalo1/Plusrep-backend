/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const express = require('express')
const mongoose = require('mongoose')
const user = require('./models/user')
const app = express()
require('dotenv').config()
const url = process.env.MONGODB_URI
mongoose.connect(url)
const User = require('./models/user')

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



app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/users', (request, response) => {
  User.find({}).then(users => {
    response.json(users)
  })
})

app.get('/api/users/:id', (request, response, next) => {
  User.findById(request.params.id).then(user => {
    if (user) {
      response.json(user)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

app.put('/api/users/:id', (request, response, next) => {
  const { content, important } = request.body

  const user = {
    content: body.content,
    important: body.important,
  }

  User.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedUser => {
      response.json(updatedUser)
    })
    .catch(error => next(error))
})

app.delete('/api/users/:id', (request, response) => {
  const id = Number(request.params.id)
  users = users.filter(user => user.id !== id)

  response.status(204).end()
})
const generateId = () => {
  const maxId = users.length > 0
    ? Math.max(...users.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/users', (request, response, next) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const user = new User({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  user.save().then(savedUser => {
    response.json(savedUser)
  })
    .catch(error => next(error))
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