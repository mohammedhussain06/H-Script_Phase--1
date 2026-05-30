const express = require('express');
const router  = express.Router();
// TODO: Phase 5B — GitHub + Google OAuth via Passport
router.get('/github',          (req, res) => res.json({ msg: 'GitHub OAuth — coming in Phase 5B' }));
router.get('/github/callback', (req, res) => res.json({ msg: 'GitHub callback' }));
router.get('/google',          (req, res) => res.json({ msg: 'Google OAuth — coming in Phase 5B' }));
router.get('/google/callback', (req, res) => res.json({ msg: 'Google callback' }));
router.get('/logout',          (req, res) => res.json({ msg: 'Logout' }));
module.exports = router;
