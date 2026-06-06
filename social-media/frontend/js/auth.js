// REGISTER
const registerForm = document.getElementById('registerForm')
if (registerForm) {
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const name = document.getElementById('name').value
    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const errorDiv = document.getElementById('error')
    const btn = document.getElementById('submitBtn')

    try {
      btn.textContent = 'Creating account...'
      btn.disabled = true

      const data = await apiCall('/auth/register', 'POST', {
        name, username, email, password
      })

      // Save user info and token
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))

      window.location.href = 'index.html'
    } catch (error) {
      errorDiv.textContent = error.message
      errorDiv.style.display = 'block'
      btn.textContent = 'Create Account'
      btn.disabled = false
    }
  })
}

// LOGIN
const loginForm = document.getElementById('loginForm')
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const errorDiv = document.getElementById('error')
    const btn = document.getElementById('submitBtn')

    try {
      btn.textContent = 'Logging in...'
      btn.disabled = true

      const data = await apiCall('/auth/login', 'POST', { email, password })

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data))

      window.location.href = 'index.html'
    } catch (error) {
      errorDiv.textContent = error.message
      errorDiv.style.display = 'block'
      btn.textContent = 'Login'
      btn.disabled = false
    }
  })
}

// LOGOUT
const logoutBtn = document.getElementById('logoutBtn')
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = 'login.html'
  })
}