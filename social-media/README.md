# SocialApp — Social Media Platform
### CodeAlpha Full Stack Development Internship — Task 2

A full-stack social media web application built with Node.js, Express, MongoDB, and Vanilla JavaScript.

---

## 🌟 Live Features

- 👤 User registration and login with JWT authentication
- 🔐 Password hashing with bcrypt
- 📸 Create posts with image uploads
- ❤️ Like and unlike posts
- 💬 Add and delete comments
- 👥 Follow and unfollow users
- 🔍 Search users by name or username
- 📊 Profile page with posts, followers, following count
- ✏️ Edit profile with picture upload
- 📱 Responsive design for mobile and desktop

---

## 🛠️ Tech Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript (Fetch API)

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- bcrypt password hashing
- Multer (image uploads)

---

## 📁 Project Structure
social-media/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── userModel.js
│   │   │   ├── postModel.js
│   │   │   └── commentModel.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── postController.js
│   │   │   └── commentController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── postRoutes.js
│   │   │   └── commentRoutes.js
│   │   └── middleware/
│   │       ├── authMiddleware.js
│   │       └── uploadMiddleware.js
│   ├── uploads/
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
└── frontend/
├── css/
│   └── style.css
├── js/
│   ├── api.js
│   ├── auth.js
│   ├── feed.js
│   ├── profile.js
│   └── search.js
├── index.html
├── login.html
├── register.html
├── profile.html
├── edit-profile.html
├── create-post.html
└── search.html

---

## 🚀 Run Locally

### Step 1 — Clone the repository
```bash
git clone https://github.com/YourUsername/CodeAlpha_SocialMediaPlatform.git
cd CodeAlpha_SocialMediaPlatform
```
### Step 2 — Set up backend
```bash
cd backend
npm install
```

### Step 3 — Create .env file
Create a `.env` file inside the `backend` folder:
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key

### Step 4 — Start the backend
```bash
npm run dev
```

### Step 5 — Open the frontend
Open `frontend/login.html` in your browser directly or use Live Server in VS Code.

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port number for the backend server |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT token generation |

---

## 🗄️ Database Schema

### Users Collection
{
name: String,
username: String (unique),
email: String (unique),
password: String (hashed),
bio: String,
profilePic: String,
followers: [ObjectId],
following: [ObjectId],
createdAt: Date
}

### Posts Collection
{
user: ObjectId (ref: User),
image: String,
caption: String,
likes: [ObjectId],
createdAt: Date
}

### Comments Collection
{
post: ObjectId (ref: Post),
user: ObjectId (ref: User),
text: String,
createdAt: Date
}

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/:username` | Get user profile |
| PUT | `/api/users/update/me` | Update profile |
| POST | `/api/users/:id/follow` | Follow or unfollow |
| GET | `/api/users/search?q=` | Search users |
| GET | `/api/users/:id/followers` | Get followers list |
| GET | `/api/users/:id/following` | Get following list |

### Posts
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/posts` | Create post |
| GET | `/api/posts/all` | Get all posts |
| GET | `/api/posts/feed` | Get feed posts |
| GET | `/api/posts/:id` | Get single post |
| DELETE | `/api/posts/:id` | Delete post |
| POST | `/api/posts/:id/like` | Like or unlike |

### Comments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/comments/:postId` | Add comment |
| GET | `/api/comments/:postId` | Get comments |
| DELETE | `/api/comments/:id` | Delete comment |

---

## 🔮 Future Improvements

- Real-time notifications with Socket.io
- Direct messaging between users
- Stories feature
- Post editing
- Email verification
- Deployment on Render and Vercel

---

## 👩‍💻 Developer

Ayesha Nazish
Full Stack Development Intern — CodeAlpha
GitHub:

---

## 📄 License
This project is built for educational purposes as part of the CodeAlpha Internship Program.