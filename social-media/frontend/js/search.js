requireAuth()

const currentUser = getUser()
document.getElementById('navUsername').textContent = `@${currentUser.username}`

// Search on Enter key
document.getElementById('searchInput').addEventListener('keyup', (e) => {
  if (e.key === 'Enter') searchUsers()
})

const searchUsers = async () => {
  const query = document.getElementById('searchInput').value.trim()
  const resultsDiv = document.getElementById('results')

  if (!query) {
    resultsDiv.innerHTML = ''
    return
  }

  try {
    resultsDiv.innerHTML = '<div class="loading">Searching...</div>'
    const users = await apiCall(`/users/search?q=${encodeURIComponent(query)}`)

    if (users.length === 0) {
      resultsDiv.innerHTML = `
        <div class="empty-state">
          <div class="emoji">🤷</div>
          <p>No users found for "${query}"</p>
        </div>
      `
      return
    }

    resultsDiv.innerHTML = users.map(user => `
      <div class="user-card"
        onclick="window.location.href='profile.html?username=${user.username}'">
        <img
          src="${getImageUrl(user.profilePic)}"
          class="avatar"
          onerror="this.src='https://via.placeholder.com/40?text=U'"
        />
        <div>
          <div class="user-card-name">${user.name}</div>
          <div class="user-card-username">@${user.username}</div>
        </div>
        <div style="margin-left:auto;color:#888;font-size:13px">
          ${user.followers.length} followers
        </div>
      </div>
    `).join('')
  } catch (error) {
    resultsDiv.innerHTML = `<div class="alert alert-error">${error.message}</div>`
  }
}