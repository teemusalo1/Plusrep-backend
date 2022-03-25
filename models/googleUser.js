/* eslint-disable linebreak-style */
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
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
    picture: String
  },
  { timestamps: true }
)
module.exports = new mongoose.model('GoogleUser', userSchema)
