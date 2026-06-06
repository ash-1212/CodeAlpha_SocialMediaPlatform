const Comment = require('../models/commentModel')
const Post = require('../models/postModel')

// ADD COMMENT
const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const comment = await Comment.create({
      post: req.params.postId,
      user: req.user._id,
      text: req.body.text,
    })

    // Return comment with user info
    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username profilePic')

    res.status(201).json(populatedComment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE COMMENT
const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id)

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' })
    }

    // Only comment owner can delete
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    await Comment.findByIdAndDelete(req.params.id)
    res.json({ message: 'Comment deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET COMMENTS FOR A POST
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'username profilePic')
      .sort({ createdAt: -1 })

    res.json(comments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { addComment, deleteComment, getComments }