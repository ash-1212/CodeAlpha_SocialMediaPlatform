const express = require('express')
const router = express.Router()
const {
  getUserProfile,
  updateProfile,
  followUser,
  searchUsers,
  getFollowers,
  getFollowing,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

router.get('/search', protect, searchUsers)
router.get('/:username', protect, getUserProfile)
router.put('/update/me', protect, upload.single('profilePic'), updateProfile)
router.post('/:id/follow', protect, followUser)
router.get('/:id/followers', protect, getFollowers)
router.get('/:id/following', protect, getFollowing)

module.exports = router