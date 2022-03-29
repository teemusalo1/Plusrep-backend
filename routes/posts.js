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
var fs = require('fs')
var path = require('path')
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
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
    image: { data: fs.readFileSync(path.join(_dirname + '/uploads/' + request.file.filename)),
      contentType: 'image/png' }
  })

  const savedPost = await post.save()
  user.post = user.post.concat(savedPost)
  await user.save()
  response.json(savedPost.toJSON)
})

module.exports = router
