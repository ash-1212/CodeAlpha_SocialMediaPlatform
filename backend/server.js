const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const path = require('path')
const connectDB = require('./src/config/db')
const authRoutes = require('./src/routes/authRoutes')
const userRoutes = require('./src/routes/userRoutes')
const postRoutes = require('./src/routes/postRoutes')
const commentRoutes = require('./src/routes/commentRoutes')

dotenv.config()

const app = express()

connectDB()

app.use(cors())
app.use(express.json())

// Serve uploaded images publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/comments', commentRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'Social Media API is running!' })
})

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
