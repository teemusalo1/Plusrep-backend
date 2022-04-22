/* eslint-disable no-case-declarations */
/* eslint-disable no-cond-assign */
/* eslint-disable linebreak-style */
const express = require('express')
const router = express.Router()
const Comment = require('../models/comment')
const User = require('../models/user')
const Post = require('../models/post')



router.get('/api/stats/users', async (request, response) => {
  var userCount
  try{
    await User.find({}).then(users => {
      console.log('Users:', users.length)
      userCount = users.length
    })

  }catch(e){
    console.log(e)
  }
  response.send('' +  userCount)

})


router.get('/api/stats/posts', async (request, response) => {

  var postCount

  try{
    await Post.find({}).then(posts => {
      console.log('Posts:', posts.length)
      postCount = posts.length
    })
  }catch(e){
    console.log(e)
  }
  response.send('' + postCount)
})


router.get('/api/stats/comments', async (request, response) => {
  var commentCount
  try{

    await Comment.find({}).then(comments => {
      console.log('Comments:', comments.length)
      commentCount = comments.length
    })
  }catch(e){
    console.log(e)
  }

  response.send('' + commentCount)

})





module.exports = router