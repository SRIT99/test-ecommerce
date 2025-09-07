const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow } = require('../middleware/roles');
const { triggerPriceSync } = require('../controllers/adminController');

router.post('/sync-prices', protect, allow('admin'), triggerPriceSync);

module.exports = router;
