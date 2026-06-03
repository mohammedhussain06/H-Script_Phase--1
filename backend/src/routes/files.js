const express = require('express')
const { requireAuth } = require('../middleware/auth')
const { validateFile } = require('../middleware/validate')
const {
  getFiles, getFile, createFile, updateFile, deleteFile, incrementRun,
} = require('../controllers/filesController')

const router = express.Router()

// All file routes require authentication
router.use(requireAuth)

router.get('/',           getFiles)
router.get('/:id',        getFile)
router.post('/',          validateFile, createFile)
router.put('/:id',        updateFile)
router.delete('/:id',     deleteFile)
router.post('/:id/run',   incrementRun)

module.exports = router
