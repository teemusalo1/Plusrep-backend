/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const mongoose = require('mongoose')


if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://teemusalo:${password}@cluster0.mvr1t.mongodb.net/Plusrep?retryWrites=true&w=majority`

mongoose.connect(url)

const userSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const User = mongoose.model('User', userSchema)


User.find({ important: true }).then(result => {
  result.forEach(user => {
    console.log(user)
  })
  mongoose.connection.close()
})

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })
