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

const tagSchema = new mongoose.Schema({
  UI: Boolean,
  Development: Boolean,
  Sales: Boolean,
  General: Boolean,
  user:{
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  }
} )

tagSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
  }
})

module.exports = mongoose.model('Tags', tagSchema)