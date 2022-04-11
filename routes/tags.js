/* eslint-disable linebreak-style */
const express = require('express')
const tags = require('../models/tags')
const router = express.Router()

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

module.exports = router
