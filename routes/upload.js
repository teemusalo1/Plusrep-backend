/* eslint-disable linebreak-style */

const express = require('express')
const upload = require('../middleware/upload')
const router = express.Router()



router.post('/upload', upload.single('file'), async (req, res) => {
  if (req.file === undefined) return res.send('you must select a file.')
  const imgUrl = `https://thawing-fjord-30792.herokuapp.com/${req.file.filename}`
  return res.send(imgUrl)
})

module.exports = router