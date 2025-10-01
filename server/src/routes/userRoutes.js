const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { allowAdmin } = require('../middleware/roles'); // Updated
const { me, listUsers, verifyUser } = require('../controllers/userController');

router.get('/me', protect, me);
router.get('/', protect, allowAdmin, listUsers); // Now superadmin can access
router.patch('/:id/verify', protect, allowAdmin, verifyUser);
module.exports = router;
