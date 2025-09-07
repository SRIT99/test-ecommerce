const express = require('express');
const router = express.Router();
const { initiateKhaltiPayment, verifyKhaltiPayment } = require('../controllers/khaltiController');

router.post('/pay', initiateKhaltiPayment);
router.get('/verify', verifyKhaltiPayment);

module.exports = router;
