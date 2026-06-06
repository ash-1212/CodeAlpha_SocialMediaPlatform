const express = require('express')
const router = express.Router()
const {
  addComment,
  deleteComment,
  getComments,
} = require('../controllers/commentController')
const { protect } = require('../middleware/authMiddleware')

router.post('/:postId', protect, addComment)
router.get('/:postId', protect, getComments)
router.delete('/:id', protect, deleteComment)

module.exports = router