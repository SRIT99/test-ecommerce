const router = require('express').Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/orderController');

router.post('/', protect, ctrl.createOrder);
router.get('/mine', protect, ctrl.myOrders);


module.exports = router;
