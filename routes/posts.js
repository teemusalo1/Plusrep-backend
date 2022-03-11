/* eslint-disable linebreak-style */
const express = require('express')
const Post = require('../models/post')
const router = express.Router()


router.get('/api/posts', (request, response) => {
  Post.find({}).then(posts => {
    response.json(posts)
  })
})

router.post('/api/posts', (request, response, next) => {
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const post = new Post({
    user: body.user,
    content: body.content,
    date: new Date(),
    image: body.image
  })

  post.save().then(savedPost => {
    response.json(savedPost)
  })
    .catch(error => next(error))
})

module.exports = router