/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */

const express = require('express')
const Post = require('../models/post')
const Tags = require('../models/tags')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const upload = require('../middleware/upload')
const router = express.Router()
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
      .populate('image')
      .populate('tags')
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
      .populate('tags')
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

router.post('/api/posts', upload.single('file'), async (request, response) => {
  const body = request.body
  const user = await User.findById(body.author)
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  let imgUrl = ''
  try {
    imgUrl = `https://thawing-fjord-30792.herokuapp.com/file/${request.file.filename}`
  } catch (error) {
    console.log(error)
  }
  const tags = new Tags({
    UI: body.UI,
    Development: body.Development,
    Sales: body.Sales,
    General: body.General,
  })
  const savedTags = await tags.save()
  const post = new Post({
    author: user._id,
    content: body.content,
    title: body.title,
    date: new Date(),
    image: imgUrl,
    tags: savedTags,
  })

  response.json(imgUrl)
  const savedPost = await post.save()
  user.post = user.post.concat(savedPost)
  await user.save()
  await response.json(savedPost.toJSON)
})

router.put('/api/posts/:id', (request, response, next) => {
  console.log(request.body)

  Post.findByIdAndUpdate(
    request.params.id,
    {
      content: request.body.content,
      title: request.body.title,
    },

    { new: true, runValidators: true, context: 'query' }
  )
    .then((update) => {
      response.json(update)
      console.log(response)
    })
    .catch((error) => next(error))
})

router.delete('/api/posts/:id', (request, response, next) => {
  Post.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

module.exports = router
