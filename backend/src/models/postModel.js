const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    // Who created this post
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Post image — required for every post
    image: {
      type: String,
      required: true,
    },
    // Optional caption
    caption: {
      type: String,
      default: '',
      maxlength: 500,
    },
    // Array of user IDs who liked this post
    // This gives us Many-to-Many: many users like many posts
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
)

const Post = mongoose.model('Post', postSchema)
module.exports = Post