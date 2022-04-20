/* eslint-disable no-case-declarations */
/* eslint-disable no-cond-assign */
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

  console.log(request.body.user)
  console.log('params',request.params)
  const index = comment.userLikes.indexOf(request.body.user, 0)
  console.log(index)
  console.log('userlikes', comment.userLikes)
  const isLiked = comment.userLikes.some(element => element.toString() === request.body.user)
  console.log('dawddadadda' , isLiked)
  switch(isLiked){
  case false:
    Comment
      .findByIdAndUpdate(
        request.params.id,
        {
          userLikes: [...comment.userLikes, request.body.user],
          likes: comment.likes + request.body.likes,
        },

        { new: true, runValidators: true, context: 'query' }
      )
      .then((update) => {

        response.json(update)

      })
      .catch((error) => next(error))
    break
  case true:
    const likedUsers = comment.userLikes.filter(element => element.toString() !== request.body.user)
    console.log('filtteröity lista',likedUsers)
    Comment
      .findByIdAndUpdate(
        request.params.id,
        {
          userLikes: likedUsers,
          likes: comment.likes + -request.body.likes,
        },

        { new: true, runValidators: true, context: 'query' }
      )
      .then((update) => {
        console.log(comment.userLikes)
        console.log(comment.userLikes.some(x => x.userLikes === request.params.user))
        response.json(update)

      })
      .catch((error) => next(error))
    break

  }})



module.exports = router