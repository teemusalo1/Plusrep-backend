/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId
const post = require('../models/post')
const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const userSchema = new mongoose.Schema({
  post:[{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Post'
  }],
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  date: {
    type: Date,
    required: false
  },
  important: Boolean

})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
   
  }
})

module.exports = mongoose.model('User', userSchema)