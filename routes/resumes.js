const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const resumeController = require('../controllers/resumeController');

router.post('/', auth, resumeController.upload);
router.get('/me', auth, resumeController.listMine);

module.exports = router;