const express = require('express');
const router  = express.Router();
// TODO: Phase 5B — Current user profile
router.get('/', (req, res) => res.json({ user: req.user || null }));
module.exports = router;
