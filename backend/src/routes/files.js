const express = require('express');
const router  = express.Router();
// TODO: Phase 5B — CRUD for user .hs files
router.get('/',        (req, res) => res.json({ files: [] }));
router.post('/',       (req, res) => res.json({ msg: 'create file' }));
router.put('/:id',     (req, res) => res.json({ msg: 'update file' }));
router.delete('/:id',  (req, res) => res.json({ msg: 'delete file' }));
module.exports = router;
