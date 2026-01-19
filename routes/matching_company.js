const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const matchingController = require('../controllers/matchingController');

router.get('/requests', auth, matchingController.listCompanyRequests);
router.patch('/requests/:id', auth, matchingController.updateRequestStatus);

module.exports = router;