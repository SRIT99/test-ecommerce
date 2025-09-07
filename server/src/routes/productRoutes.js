const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow } = require('../middleware/roles');
const ctrl = require('../controllers/productController');

router.get('/', ctrl.listPublic);
router.post('/', protect, allow('seller', 'admin'), ctrl.create);
router.put('/:id', protect, allow('seller', 'admin'), ctrl.update);

module.exports = router;
