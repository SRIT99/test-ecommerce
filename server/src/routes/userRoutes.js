const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow } = require('../middleware/roles');
const { me, listUsers, verifyUser } = require('../controllers/userController');

router.get('/me', protect, me);
router.get('/', protect, allow('admin'), listUsers);
router.patch('/:id/verify', protect, allow('admin'), verifyUser);

module.exports = router;
