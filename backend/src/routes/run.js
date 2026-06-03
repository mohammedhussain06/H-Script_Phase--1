const express = require('express')
const { optionalAuth } = require('../middleware/auth')
const { runCode }      = require('../controllers/runController')

const router = express.Router()

// optionalAuth — guests can run code, logged-in users get userId attached
router.post('/', optionalAuth, runCode)

module.exports = router
