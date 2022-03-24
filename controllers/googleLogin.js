/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */


const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const GoogleUser = require('../models/googleUser')

const clientID = process.env.CLIENT_ID
const client = new OAuth2Client(clientID)


const googleLogin = (req, res) => {
  const { tokenId } = req.body
  client
    .verifyIdToken({
      idToken: tokenId,
      audience: clientID,
    })
    .then((response) => {
      const { email_verified, name, email, picture } = response.payload
      console.log(response.payload)
      if (email_verified) {
        GoogleUser.findOne({ email }).exec((err, user) => {
          console.log('USER', user)
          if (err) {
            console.log('VERIFIED ERR')
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
              let newGoogleUser = new GoogleUser({
                name,
                email,
                picture,
              })

              newGoogleUser.save((err, data) => {
                if (err) {
                  console.log('VERIFIED ERR')

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

                res.json({
                  token,
                  user: { _id, name, email, picture },
                })
              })
            }
          }
        })
      }
    })
}

module.exports = googleLogin