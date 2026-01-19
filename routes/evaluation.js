const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const evaluationController = require('../controllers/evaluationController');

router.post('/', auth, evaluationController.create);
router.get('/me', auth, evaluationController.listMine);

module.exports = router;