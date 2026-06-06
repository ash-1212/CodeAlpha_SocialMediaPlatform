requireAuth()

const currentUser = getUser()
const feedContainer = document.getElementById('feed')

// Build a single post card HTML
const buildPostCard = (post) => {
  const isLiked = post.likes.includes(currentUser._id)
  const isOwner = post.user._id === currentUser._id

  return `
    <div class="post-card" id="post-${post._id}">
      <div class="post-header">
        <div class="post-user">
          <img
            src="${getImageUrl(post.user.profilePic)}"
            class="avatar"
            onerror="this.src='https://via.placeholder.com/40?text=U'"
          />
          <div>
            <a href="profile.html?username=${post.user.username}">
              <div class="post-username">@${post.user.username}</div>
            </a>
            <div class="post-time">${formatDate(post.createdAt)}</div>
          </div>
        </div>
        ${isOwner ? `
          <button class="btn btn-danger btn-sm"
            onclick="deletePost('${post._id}')"
            style="padding:6px 12px;font-size:12px;border-radius:6px">
            Delete
          </button>
        ` : ''}
      </div>

      <img
        src="${getImageUrl(post.image)}"
        class="post-image"
        onerror="this.src='https://via.placeholder.com/400x300?text=Image'"
      />

      ${post.caption ? `
        <div class="post-caption">
          <strong>@${post.user.username}</strong> ${post.caption}
        </div>
      ` : ''}

      <div class="post-actions">
        <button class="action-btn" onclick="toggleLike('${post._id}', this)">
          ${isLiked ? '❤️' : '🤍'}
          <span class="count">${post.likes.length}</span>
        </button>
        <button class="action-btn" onclick="toggleComments('${post._id}')">
          💬 <span class="count">Comments</span>
        </button>
      </div>

      <!-- Comments Section -->
      <div class="comments-section" id="comments-${post._id}" style="display:none">
        <div class="comment-form">
          <input
            type="text"
            class="comment-input"
            id="commentInput-${post._id}"
            placeholder="Add a comment..."
          />
          <button class="comment-submit"
            onclick="addComment('${post._id}')">
            Post
          </button>
        </div>
        <div id="commentsList-${post._id}"></div>
      </div>
    </div>
  `
}

// Load all posts for the feed
const loadFeed = async () => {
  try {
    feedContainer.innerHTML = '<div class="loading">Loading posts...</div>'
    const posts = await apiCall('/posts/all')

    if (posts.length === 0) {
      feedContainer.innerHTML = `
        <div class="empty-state">
          <div class="emoji">📸</div>
          <p>No posts yet. Be the first to post!</p>
          <br/>
          <a href="create-post.html" class="btn btn-primary">Create Post</a>
        </div>
      `
      return
    }

    feedContainer.innerHTML = posts.map(buildPostCard).join('')
  } catch (error) {
    feedContainer.innerHTML = `<div class="alert alert-error">${error.message}</div>`
  }
}

// Toggle like on a post
const toggleLike = async (postId, btn) => {
  try {
    const data = await apiCall(`/posts/${postId}/like`, 'POST')
    const countSpan = btn.querySelector('.count')
    btn.innerHTML = data.liked ? '❤️' : '🤍'
    btn.innerHTML += `<span class="count">${data.likes}</span>`
  } catch (error) {
    alert(error.message)
  }
}

// Delete a post
const deletePost = async (postId) => {
  if (!confirm('Are you sure you want to delete this post?')) return
  try {
    await apiCall(`/posts/${postId}`, 'DELETE')
    document.getElementById(`post-${postId}`).remove()
  } catch (error) {
    alert(error.message)
  }
}

// Show/hide comments section
const toggleComments = async (postId) => {
  const section = document.getElementById(`comments-${postId}`)
  if (section.style.display === 'none') {
    section.style.display = 'block'
    loadComments(postId)
  } else {
    section.style.display = 'none'
  }
}

// Load comments for a post
const loadComments = async (postId) => {
  try {
    const comments = await apiCall(`/comments/${postId}`)
    const list = document.getElementById(`commentsList-${postId}`)

    if (comments.length === 0) {
      list.innerHTML = '<p style="color:#888;font-size:13px">No comments yet</p>'
      return
    }

    list.innerHTML = comments.map(c => `
      <div class="comment-item">
        <img
          src="${getImageUrl(c.user.profilePic)}"
          class="avatar"
          style="width:32px;height:32px"
          onerror="this.src='https://via.placeholder.com/32?text=U'"
        />
        <div class="comment-body">
          <div class="comment-author">@${c.user.username}</div>
          <div class="comment-text">${c.text}</div>
          ${c.user._id === currentUser._id ? `
            <button class="comment-delete"
              onclick="deleteComment('${c._id}', '${postId}')">
              Delete
            </button>
          ` : ''}
        </div>
      </div>
    `).join('')
  } catch (error) {
    console.error(error)
  }
}

// Add a comment
const addComment = async (postId) => {
  const input = document.getElementById(`commentInput-${postId}`)
  const text = input.value.trim()
  if (!text) return

  try {
    await apiCall(`/comments/${postId}`, 'POST', { text })
    input.value = ''
    loadComments(postId)
  } catch (error) {
    alert(error.message)
  }
}

// Delete a comment
const deleteComment = async (commentId, postId) => {
  try {
    await apiCall(`/comments/${commentId}`, 'DELETE')
    loadComments(postId)
  } catch (error) {
    alert(error.message)
  }
}

// Set navbar username
document.getElementById('navUsername').textContent = `@${currentUser.username}`

// Load feed on page load
loadFeed()