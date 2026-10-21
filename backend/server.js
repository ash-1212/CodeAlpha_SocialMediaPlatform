const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const postRoutes = require('./src/routes/postRoutes');
const commentRoutes = require('./src/routes/commentRoutes');

dotenv.config();

const app = express();

// Connect to MongoDB Database
connectDB();

// Enable CORS explicitly for your Netlify frontend
app.use(cors({
  origin: ['https://octohug.netlify.app', 'http://localhost:3000', 'http://localhost:127.0.0.1:5500'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests explicitly
app.options('*', cors());
app.use(express.json());

// Serve uploaded images publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Social Media API is running!' });
});

// Local Development Server Listener (Skipped in Vercel production)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// CRITICAL FOR VERCEL: Export the Express app instance
module.exports = app;
