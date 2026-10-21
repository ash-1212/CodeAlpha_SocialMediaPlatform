const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://octohug-backend.vercel.app/'; 

// Get token from localStorage
const getToken = () => localStorage.getItem('token')

// Get logged in user info
const getUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

// Make authenticated API calls
const apiCall = async (endpoint, method = 'GET', body = null, isFormData = false) => {
  const headers = {}

  if (!isFormData) {
    headers['Content-Type'] = 'application/json'
  }

  const token = getToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = { method, headers }

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body)
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong')
  }

  return data
}

// Get image URL from filename
const getImageUrl = (filename) => {
  if (!filename) return 'https://via.placeholder.com/150?text=No+Image'
  if (filename.startsWith('http')) return filename
  return `http://localhost:5000/uploads/${filename}`
}

// Format timestamp to readable date
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}

// Check if user is logged in — redirect if not
const requireAuth = () => {
  if (!getToken()) {
    window.location.href = 'login.html'
  }
}

// Redirect if already logged in
const redirectIfLoggedIn = () => {
  if (getToken()) {
    window.location.href = 'index.html'
  }
}
