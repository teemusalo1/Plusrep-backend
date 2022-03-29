/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable linebreak-style */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const url = process.env.MONGODB_URI2

console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    lowercase: true,
  },
  picture: String,

  tags: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Tags'
  }],

  post:[{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'Post'
  }],
}, { timestamps: true , } )

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
  }
})

module.exports = mongoose.model('User', userSchema)