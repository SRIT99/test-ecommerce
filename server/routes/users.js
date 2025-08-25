const express = require('express');
const {
  getUsers,
  getUser,
  getMyProfile,
  updateProfile,
  deleteAccount,
  getDashboardStats,
  getNearbyFarmers,
  updateUserRole,
  verifyUser,
  getUserActivity
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const {
  validateIdParam,
  validateUserUpdate,
  validatePagination
} = require('../middleware/validation');
const { uploadUserAvatar, handleUploadErrors } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/farmers/nearby', getNearbyFarmers);

// Protected routes (all authenticated users)
router.use(protect);

router.get('/profile/me', getMyProfile);
router.put('/profile', validateUserUpdate, updateProfile);
router.delete('/profile', deleteAccount);
router.get('/dashboard/stats', getDashboardStats);

// Avatar upload route
router.post(
  '/profile/avatar',
  uploadUserAvatar,
  handleUploadErrors,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload an image'
        });
      }
      
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: req.file.path },
        { new: true }
      ).select('-password');
      
      res.status(200).json({
        success: true,
        message: 'Avatar uploaded successfully',
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
);

// Admin only routes
router.get('/', authorize('admin'), validatePagination, getUsers);
router.get('/:id', authorize('admin'), validateIdParam, getUser);
router.put('/:id/role', authorize('admin'), validateIdParam, updateUserRole);
router.put('/:id/verify', authorize('admin'), validateIdParam, verifyUser);
router.get('/:id/activity', authorize('admin'), validateIdParam, getUserActivity);

module.exports = router;