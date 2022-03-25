/* eslint-disable linebreak-style */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable linebreak-style */

const express = require('express')

const router = express.Router()
const googleLogin = require('../controllers/googleLogin')

router.post('/api/googlelogin', googleLogin)

module.exports = router
