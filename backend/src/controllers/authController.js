const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body

    console.log('Step 1 - Received:', { name, username, email })

    const emailExists = await User.findOne({ email })
    if (emailExists) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    const usernameExists = await User.findOne({ username })
    if (usernameExists) {
      return res.status(400).json({ message: 'Username already taken' })
    }

    console.log('Step 2 - Creating user...')

    const user = await User.create({ name, username, email, password })

    console.log('Step 3 - User created:', user._id)

    res.status(201).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      token: generateToken(user._id),
    })
  } catch (error) {
    console.log('FULL ERROR:', error)
    res.status(500).json({ message: error.message })
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        token: generateToken(user._id),
      })
    } else {
      res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (error) {
    console.log('FULL ERROR:', error)
    res.status(500).json({ message: error.message })
  }
}

module.exports = { registerUser, loginUser }