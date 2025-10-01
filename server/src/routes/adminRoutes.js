const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { allowAdmin } = require('../middleware/roles'); // Updated
const { triggerPriceSync } = require('../controllers/adminController');

router.post('/sync-prices', protect, allowAdmin, triggerPriceSync);
module.exports = router;