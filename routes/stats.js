/* eslint-disable no-case-declarations */
/* eslint-disable no-cond-assign */
/* eslint-disable linebreak-style */
const express = require('express')
const router = express.Router()
const Comment = require('../models/comment')
const User = require('../models/user')
const Post = require('../models/post')



router.get('/api/stats', async (request, response) => {

  await User.find({}).then(users => {
    response.status('Users: ', users.length)
  })
  await Post.find({}).then(posts => {
    response.status('Posts: ', posts.length)
  })
  await Comment.find({}).then(comments => {
    response.status('Comments: ', comments.length)
  })

})




module.exports = router