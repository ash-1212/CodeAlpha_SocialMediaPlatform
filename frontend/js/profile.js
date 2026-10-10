requireAuth()

const currentUser = getUser()
const params = new URLSearchParams(window.location.search)
const username = params.get('username') || currentUser.username

const loadProfile = async () => {
  try {
    const { user, posts } = await apiCall(`/users/${username}`)

    // Fill in profile info
    document.getElementById('profilePic').src = getImageUrl(user.profilePic)
    document.getElementById('profileName').textContent = user.name
    document.getElementById('profileUsername').textContent = `@${user.username}`
    document.getElementById('profileBio').textContent = user.bio || 'No bio yet'
    document.getElementById('postsCount').textContent = posts.length
    document.getElementById('followersCount').textContent = user.followers.length
    document.getElementById('followingCount').textContent = user.following.length

    // Show follow/edit button
    const actionArea = document.getElementById('profileAction')
    if (user._id === currentUser._id) {
      actionArea.innerHTML = `
        <a href="edit-profile.html" class="btn btn-outline">Edit Profile</a>
      `
    } else {
      const isFollowing = user.followers.includes(currentUser._id)
      actionArea.innerHTML = `
        <button class="btn ${isFollowing ? 'btn-outline' : 'btn-primary'}"
          id="followBtn"
          onclick="toggleFollow('${user._id}')">
          ${isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      `
    }

    // Show posts grid
    const grid = document.getElementById('postsGrid')
    if (posts.length === 0) {
      grid.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
          <div class="emoji">📷</div>
          <p>No posts yet</p>
        </div>
      `
    } else {
      grid.innerHTML = posts.map(p => `
        <img
          src="${getImageUrl(p.image)}"
          onclick="window.location.href='index.html'"
          onerror="this.src='https://via.placeholder.com/200?text=Img'"
        />
      `).join('')
    }
  } catch (error) {
    document.getElementById('profileContainer').innerHTML =
      `<div class="alert alert-error">${error.message}</div>`
  }
}

const toggleFollow = async (userId) => {
  try {
    const data = await apiCall(`/users/${userId}/follow`, 'POST')
    const btn = document.getElementById('followBtn')
    if (data.following) {
      btn.textContent = 'Unfollow'
      btn.className = 'btn btn-outline'
    } else {
      btn.textContent = 'Follow'
      btn.className = 'btn btn-primary'
    }
    // Refresh counts
    loadProfile()
  } catch (error) {
    alert(error.message)
  }
}

document.getElementById('navUsername').textContent = `@${currentUser.username}`
loadProfile()