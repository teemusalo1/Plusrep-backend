/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
require('dotenv').config()
const findOrCreate = require('mongoose-findorcreate')
const passportLocalMongoose = require('passport-local-mongoose')

const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(result => {
  console.log('conn.js connected to MongoDB @', result.connection.host)
})
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })


const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  googleId: String,
  secret: String
})

userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)

module.exports = new mongoose.model('GoogleUser', userSchema)
