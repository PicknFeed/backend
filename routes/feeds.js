const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const feedController = require('../controllers/feedController');

router.get('/me', auth, feedController.myFeeds);

module.exports = router;