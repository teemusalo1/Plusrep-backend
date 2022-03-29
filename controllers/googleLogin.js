/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */

const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const { OAuth2Client } = require('google-auth-library')
const googleUser = require('../models/user')
const tags = require('../models/tags')
const clientID = process.env.CLIENT_ID
const client = new OAuth2Client(clientID)
let id = ''
const createTag = ( async (id) => {
  await googleLogin
  let tagsuser = await googleUser.findById(id)
  const newTags = tags({
    uiDesigner: true,
    developper: true,
    salesman: true,
  })
  const savedTags = await newTags.save()
  tagsuser.tags = tagsuser.tags.concat(savedTags)
  await tagsuser.save()
  
})
const googleLogin = async (req, res) => {
  const { tokenId } = req.body
  client
    .verifyIdToken({
      idToken: tokenId,
      audience: clientID,
    })
    .then( async (response) => {
      const { email_verified, name, email, picture } = response.payload
      console.log(response.payload)

      if (email_verified) {
        googleUser.findOne({ email }).exec((err, user) => {
          console.log('USER', user)

          if  (err)  {
            return res.status(400).json({
              error: 'Something went wrog',
            })
          } else {
            if (user) {
              console.log('env', process.env.JWT_SIGNIN_KEY)
              const token = jwt.sign(
                { _id: user.id },
                process.env.JWT_SIGNIN_KEY,
                { expiresIn: '3d' }
              )
              const { _id, name, email, picture } = user

              res.json({
                token,
                user: { _id, name, email, picture },
              })
            } else {
              let newGoogleUser = new googleUser({
                name,
                email,
                picture,
              })

              newGoogleUser.save((err, data) => {
                if (err) {
                  return res.status(400).json({
                    error: 'Something went wrong',
                  })
                }
                const token = jwt.sign(
                  { _id: data.id },
                  process.env.JWT_SIGNIN_KEY,
                  { expiresIn: '3d' }
                )
                const { _id, name, email, picture } = newGoogleUser
                id = _id
                // res.json({
                //   token,
                //   user: { _id, name, email, picture },
                //   id
                // })
                createTag(_id)
              })

             
            }
          }
        })
      }

    })
}



module.exports = googleLogin

