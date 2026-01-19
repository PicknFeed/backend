const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const matchingController = require('../controllers/matchingController');

router.post('/requests', auth, matchingController.createRequest);
router.get('/requests', auth, matchingController.listMyRequests);

module.exports = router;