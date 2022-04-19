/* eslint-disable linebreak-style */
const express = require('express')
const Comment = require('../models/comment')
const User = require('../models/user')
const Post = require('../models/post')
const router = express.Router()


router.get('/api/comments', async (request, response) => {
  await Comment.find({}).populate('author').then(comments => {
    response.json(comments)
  })
})

router.post('/api/comments', async (request, response) => {
  const body = request.body
  const post = await Post.findById(body.post)
  const user = await User.findById(body.author)
  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const comment = new Comment({
    author: user._id,
    content: body.content,
    post: post._id,
    date: new Date(),
    likes: body.likes
  })

  const savedComment = await comment.save()
  post.comments = post.comments.concat(savedComment)
  await post.save()
  await user.save()
  response.json(savedComment.toJSON)

})

router.put('/api/comments/:id', async (request, response, next) => {
  console.log(request.body)
  const comment = await Comment.findById(request.params.id)
  Comment
    .findByIdAndUpdate(
      request.params.id,
      {

        likes: comment.likes + request.body.likes,
      },

      { new: true, runValidators: true, context: 'query' }
    )
    .then((update) => {

      response.json(update)
      console.log(response)
    })
    .catch((error) => next(error))
})

module.exports = router