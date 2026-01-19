const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const profileController = require('../controllers/profileController');

router.get('/me', auth, profileController.me);
router.put('/me/profile', auth, profileController.update);

module.exports = router;