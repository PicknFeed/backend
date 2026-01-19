const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const peopleController = require('../controllers/peopleController');

router.get('/', auth, peopleController.list);

module.exports = router;