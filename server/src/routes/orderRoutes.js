const router = require('express').Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/orderController');

router.post('/', protect, ctrl.createOrder);
router.get('/mine', protect, ctrl.myOrders);
router.patch('/:id/status', protect, ctrl.updateOrderStatus);


module.exports = router;
