/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */

const express = require('express')
const Post = require('../models/post')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const router = express.Router()
const multer = require('multer')
const { GridFsStorage } = require('multer-gridfs-storage')
var fs = require('fs')
var path = require('path')
const storage = new GridFsStorage({
  url: process.env.MONGODB_URI2,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    const match = ['image/png', 'image/jpeg']

    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-any-name-${file.originalname}`
      return filename
    }

    return {
      filename: `${Date.now()}-any-name-${file.originalname}`,
    }
  },
})

var upload = multer({ storage: storage })

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  console.log('gettokenfrom req', authorization)

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}

router.get('/api/posts', async (request, response, next) => {
  const token = getTokenFrom(request)

  if (token) {
    const decodedToken = jwt.verify(token, process.env.JWT_SIGNIN_KEY)

    if (!token || !decodedToken._id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    await Post.find({})
      .populate('author')
      .populate('comments')
      .then((posts) => {
        response.json(posts)
      })
      .catch((error) => next(error))
  }
})

router.get('/api/posts/:id', async (request, response, next) => {
  const token = getTokenFrom(request)

  if (token) {
    const decodedToken = jwt.verify(token, process.env.JWT_SIGNIN_KEY)

    if (!token || !decodedToken._id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    await Post.findById(request.params.id)
      .populate('author')
      .populate('comments')
      .then((post) => {
        if (post) {
          response.json(post)
        } else {
          response.status(404).end()
        }
      })
      .catch((error) => next(error))
  }
})

router.post('/api/posts', async (request, response) => {
  const body = request.body
  const user = await User.findById(body.author)
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const post = new Post({
    author: user._id,
    content: body.content,
    date: new Date(),
    image: { data: upload.single('image'), contentType: 'image/png' },
  })

  const savedPost = await post.save()
  user.post = user.post.concat(savedPost)
  await user.save()
  response.json(savedPost.toJSON)
})

module.exports = router
