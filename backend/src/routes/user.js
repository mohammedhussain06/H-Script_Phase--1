const express = require('express')
const { requireAuth } = require('../middleware/auth')
const { getProfile, updateProfile } = require('../controllers/userController')

const router = express.Router()

router.get('/profile',  requireAuth, getProfile)
router.put('/profile',  requireAuth, updateProfile)

module.exports = router
