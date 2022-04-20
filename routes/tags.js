/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
const express = require('express')
const tags = require('../models/tags')
const router = express.Router()
const jwt = require('jsonwebtoken')

const getTokenFrom = (request) => {
  const authorization = request.get('authorization')
  console.log('gettokenfrom req', authorization)

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }
  return null
}


router.put('/api/tags/:id', (request, response, next) => {
  console.log(request.body.uiDesigner)

  tags
    .findByIdAndUpdate(
      request.params.id,
      {
        UI: request.body.UI,
        Development: request.body.Development,
        Sales: request.body.Sales,
        General: request.body.General,
      },

      { new: true, runValidators: true, context: 'query' }
    )
    .then((updatedTags) => {
      response.json(updatedTags)
    })
    .catch((error) => next(error))
})



router.get('/api/tags/:id', async (request, response, next) => {
  const token = getTokenFrom(request)

  if (token) {
    const decodedToken = jwt.verify(token, process.env.JWT_SIGNIN_KEY)

    if (!token || !decodedToken._id) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    await tags.findById(request.params.id)
      .populate('UI')
      .populate('Sales')
      .populate('Development')
      .populate('General')
      .then((tags) => {
        if (tags) {
          response.json(tags)
        } else {
          response.status(404).end()
        }
      })
      .catch((error) => next(error))
  }
})

module.exports = router
