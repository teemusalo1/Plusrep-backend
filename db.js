/* eslint-disable no-undef */
/* eslint-disable linebreak-style */
const mongoose = require('mongoose')

module.exports = async function connection() {
  try{
    const connectionParams = {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology:true
    }
    await mongoose.connect(process.env.MONGODB_URI2, connectionParams)
    console.log('Connected to database')

  } catch(e){
    console.log(e)
  }
}
