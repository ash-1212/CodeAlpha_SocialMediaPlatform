const User = require('../models/userModel')
const Post = require('../models/postModel')

// GET USER PROFILE by username
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Also get their posts
    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'username profilePic')

    res.json({ user, posts })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update text fields
    user.name = req.body.name || user.name
    user.bio = req.body.bio || user.bio
    user.username = req.body.username || user.username

    // If a new profile picture was uploaded, update it
    if (req.file) {
      user.profilePic = req.file.filename
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      bio: updatedUser.bio,
      followers: updatedUser.followers,
      following: updatedUser.following,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// FOLLOW USER
const followUser = async (req, res) => {
  try {
    // The user to follow
    const userToFollow = await User.findById(req.params.id)
    // The logged in user
    const currentUser = await User.findById(req.user._id)

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Can't follow yourself
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot follow yourself' })
    }

    // Check if already following
    const alreadyFollowing = currentUser.following.includes(req.params.id)

    if (alreadyFollowing) {
      // UNFOLLOW — remove from both arrays
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== req.params.id
      )
      userToFollow.followers = userToFollow.followers.filter(
        (id) => id.toString() !== req.user._id.toString()
      )
      await currentUser.save()
      await userToFollow.save()
      res.json({ message: 'Unfollowed successfully', following: false })
    } else {
      // FOLLOW — add to both arrays
      currentUser.following.push(req.params.id)
      userToFollow.followers.push(req.user._id)
      await currentUser.save()
      await userToFollow.save()
      res.json({ message: 'Followed successfully', following: true })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// SEARCH USERS
const searchUsers = async (req, res) => {
  try {
    const keyword = req.query.q

    if (!keyword) {
      return res.json([])
    }

    // Search by username OR name — case insensitive
    const users = await User.find({
      $or: [
        { username: { $regex: keyword, $options: 'i' } },
        { name: { $regex: keyword, $options: 'i' } },
      ],
    })
      .select('-password')
      .limit(10)  // Max 10 results

    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET FOLLOWERS LIST
const getFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('followers', 'name username profilePic')

    res.json(user.followers)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET FOLLOWING LIST
const getFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('following', 'name username profilePic')

    res.json(user.following)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getUserProfile,
  updateProfile,
  followUser,
  searchUsers,
  getFollowers,
  getFollowing,
}