/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const url = process.env.MONGODB_URI2
console.log('connecting to', url)
const User = require('../models/user')
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const commentSchema = new mongoose.Schema({


  author:{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    require: true

  },

  content: {
    type: String,
    minLength: 3,
    required: true
  },
  date: {
    type: Date,
    required: false
  },
  likes:{
    type: Number
  },
  post:{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Post',
    require: true

  }




})

commentSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
  }
})

module.exports = mongoose.model('Comment', commentSchema)