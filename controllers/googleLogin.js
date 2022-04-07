/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */

const jwt = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const { OAuth2Client } = require('google-auth-library')
const googleUser = require('../models/user')
const Tags = require('../models/tags')
const clientID = process.env.CLIENT_ID
const client = new OAuth2Client(clientID)
let newGoogleUser = ''

const googleLogin = async (req, res) => {
  const { tokenId } = req.body
  client
    .verifyIdToken({
      idToken: tokenId,
      audience: clientID,
    })
    .then(async (response) => {
      const { email_verified, name, email, picture, tags } = response.payload
      console.log(response.payload)

      if (email_verified) {
        googleUser
          .findOne({ email })
          .populate('tags')
          .exec((err, user) => {
            console.log('USER', user)

            if (err) {
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
                const { _id, name, email, picture, tags } = user

                res.json({
                  token,
                  user: { _id, name, email, picture, tags },
                })
              } else {
                newGoogleUser = new googleUser({
                  name,
                  email,
                  picture,
                  tags,
                })

                newGoogleUser.save(async (err, data) => {
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
                  const defaultTags = new Tags({
                    UI: true,
                    Development: true,
                    Sales: true,
                    General: true,
                    user: data.id,
                  })

                  defaultTags.save()
                  newGoogleUser.tags.push(defaultTags)
                  newGoogleUser.save()
                  googleUser
                    .findOne({ email: newGoogleUser.email })
                    .populate('tags')
                    .exec(function (err, user) {
                      if (err) return handleError(err)
                      console.log('MY COOL USER', user)
                    })

                  const { _id, name, email, picture, tags } = newGoogleUser
                  res.json({
                    token,
                    user: { _id, name, email, picture, tags },
                  })
                })
              }
            }
          })
      }
    })
}

module.exports = googleLogin
