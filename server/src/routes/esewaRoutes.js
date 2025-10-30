const express = require('express');
const router = express.Router();
const { 
    initiateEsewaPayment, 
    verifyEsewaPayment, 
    failEsewa, 
    checkEsewaStatus 
} = require('../controllers/esewaController');

router.post('/pay', initiateEsewaPayment);
router.get('/verify', verifyEsewaPayment);
router.get('/failure', failEsewa);
router.get('/status', checkEsewaStatus);

module.exports = router;