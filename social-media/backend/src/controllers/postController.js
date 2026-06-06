const Post = require('../models/postModel')
const Comment = require('../models/commentModel')
const User = require('../models/userModel')

// CREATE POST
const createPost = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' })
    }

    const post = await Post.create({
      user: req.user._id,
      image: req.file.filename,
      caption: req.body.caption || '',
    })

    // Populate user info before sending back
    const populatedPost = await Post.findById(post._id)
      .populate('user', 'username profilePic name')

    res.status(201).json(populatedPost)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET FEED — posts from people you follow + your own posts
const getFeed = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id)

    // Get IDs of people you follow plus yourself
    const feedUserIds = [...currentUser.following, req.user._id]

    const posts = await Post.find({ user: { $in: feedUserIds } })
      .sort({ createdAt: -1 })  // Newest first
      .populate('user', 'username profilePic name')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username profilePic' },
      })

    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET ALL POSTS (explore page)
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate('user', 'username profilePic name')

    res.json(posts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET SINGLE POST
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'username profilePic name')

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Get comments separately
    const comments = await Comment.find({ post: req.params.id })
      .populate('user', 'username profilePic')
      .sort({ createdAt: -1 })

    res.json({ post, comments })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE POST
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    // Only the post owner can delete it
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    await Post.findByIdAndDelete(req.params.id)
    // Also delete all comments on this post
    await Comment.deleteMany({ post: req.params.id })

    res.json({ message: 'Post deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// LIKE / UNLIKE POST
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    const alreadyLiked = post.likes.includes(req.user._id)

    if (alreadyLiked) {
      // Unlike — remove user from likes array
      post.likes = post.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      )
      await post.save()
      res.json({ message: 'Post unliked', liked: false, likes: post.likes.length })
    } else {
      // Like — add user to likes array
      post.likes.push(req.user._id)
      await post.save()
      res.json({ message: 'Post liked', liked: true, likes: post.likes.length })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createPost,
  getFeed,
  getAllPosts,
  getPostById,
  deletePost,
  likePost,
}