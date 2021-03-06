/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const express = require('express')
const User = require('../models/user')
const router = express.Router()


router.get('/api/users', async (request, response) => {

  const users = await User.find({}).populate('post')
  response.json(users)

})



router.get('/api/users/:id', (request, response, next) => {
  User.findById(request.params.id).then(user => {
    if (user) {
      response.json(user)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

router.put('/api/users/:id', (request, response, next) => {
  const { content, important } = request.body

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

router.delete('/api/users/:id', (request, response) => {
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

router.post('/api/users', (request, response, next) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const user = new User({
    content: body.content,
    important: body.important || false,
    date: new Date(),
    post: [body.post]
  })

  user.save().then(savedUser => {
    response.json(savedUser)
  })
    .catch(error => next(error))
})

module.exports = router