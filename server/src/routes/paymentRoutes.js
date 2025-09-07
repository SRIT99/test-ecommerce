const router = require('express').Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/paymentController');

// eSewa
router.post('/esewa/pay', protect, ctrl.payEsewa);
router.get('/esewa/verify', ctrl.verifyEsewa);
router.get('/esewa/failure', (_req, res) => res.send('eSewa payment failed'));

// Khalti
router.post('/khalti/pay', protect, ctrl.payKhalti);
router.get('/khalti/verify', ctrl.verifyKhalti);

// COD
router.post('/cod/place', protect, ctrl.codPlace);

module.exports = router;
