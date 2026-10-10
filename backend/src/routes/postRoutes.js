const express = require('express')
const router = express.Router()
const {
  createPost,
  getFeed,
  getAllPosts,
  getPostById,
  deletePost,
  likePost,
} = require('../controllers/postController')
const { protect } = require('../middleware/authMiddleware')
const upload = require('../middleware/uploadMiddleware')

router.get('/feed', protect, getFeed)
router.get('/all', getAllPosts)
router.post('/', protect, upload.single('image'), createPost)
router.get('/:id', protect, getPostById)
router.delete('/:id', protect, deletePost)
router.post('/:id/like', protect, likePost)

module.exports = router