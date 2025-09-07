const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow } = require('../middleware/roles');
const ctrl = require('../controllers/vehicleController');

router.post('/', protect, allow('admin'), ctrl.create);
router.get('/', protect, allow('admin'), ctrl.list);

module.exports = router;
