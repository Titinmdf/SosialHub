// ========================================
// DATA STORAGE (Dummy JSON Data)
// ========================================

// Initialize dummy data
const dummyUsers = [
    {
        id: 1,
        name: "John Doe",
        username: "johndoe",
        email: "john@example.com",
        password: "password123",
        bio: "Web developer passionate about creating amazing user experiences. Love coding, coffee, and creativity! ☕💻",
        avatar: "JD",
        followers: 1200,
        following: 487
    },
    {
        id: 2,
        name: "Jane Smith",
        username: "janesmith",
        email: "jane@example.com",
        password: "password123",
        bio: "Digital artist & designer. Creating beautiful things every day 🎨",
        avatar: "JS",
        followers: 850,
        following: 320
    },
    {
        id: 3,
        name: "Mike Johnson",
        username: "mikejohnson",
        email: "mike@example.com",
        password: "password123",
        bio: "Tech enthusiast | Gamer | Coffee addict ☕🎮",
        avatar: "MJ",
        followers: 2100,
        following: 650
    }
];

const dummyPosts = [
    {
        id: 1,
        userId: 2,
        content: "Just finished working on an amazing new design project! Can't wait to share it with you all. 🎨✨",
        image: null,
        likes: 45,
        comments: 12,
        shares: 5,
        timestamp: new Date("2024-11-10T10:30:00").toISOString(),
        likedBy: []
    },
    {
        id: 2,
        userId: 3,
        content: "Started learning React today! The component-based architecture is so intuitive. Any tips for a beginner? 🚀",
        image: null,
        likes: 32,
        comments: 18,
        shares: 3,
        timestamp: new Date("2024-11-10T09:15:00").toISOString(),
        likedBy: []
    },
    {
        id: 3,
        userId: 2,
        content: "Beautiful sunset today! 🌅 Nature never fails to inspire my design work.",
        image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=600",
        likes: 89,
        comments: 24,
        shares: 15,
        timestamp: new Date("2024-11-09T18:45:00").toISOString(),
        likedBy: []
    },
    {
        id: 4,
        userId: 3,
        content: "Coffee and code - the perfect combination for a productive morning! ☕💻 #WebDevelopment #JavaScript",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600",
        likes: 67,
        comments: 15,
        shares: 8,
        timestamp: new Date("2024-11-09T08:20:00").toISOString(),
        likedBy: []
    }
];

const dummyMessages = [
    {
        id: 1,
        fromUserId: 2,
        toUserId: 1,
        message: "Hey! Love your recent post about web development. We should collaborate sometime!",
        timestamp: new Date("2024-11-10T11:00:00").toISOString(),
        read: false
    },
    {
        id: 2,
        fromUserId: 3,
        toUserId: 1,
        message: "Thanks for the React tips! Really helpful 🙌",
        timestamp: new Date("2024-11-10T09:30:00").toISOString(),
        read: false
    },
    {
        id: 3,
        fromUserId: 1,
        toUserId: 2,
        message: "Your design work is amazing! Keep it up!",
        timestamp: new Date("2024-11-09T15:20:00").toISOString(),
        read: true
    }
];

// ========================================
// STATE MANAGEMENT
// ========================================

let currentUser = null;
let posts = [];
let messages = [];
let users = [];

// Initialize data from localStorage or use dummy data
function initializeData() {
    // Load users
    const storedUsers = localStorage.getItem('socialHubUsers');
    users = storedUsers ? JSON.parse(storedUsers) : [...dummyUsers];

    // Load posts
    const storedPosts = localStorage.getItem('socialHubPosts');
    posts = storedPosts ? JSON.parse(storedPosts) : [...dummyPosts];

    // Load messages
    const storedMessages = localStorage.getItem('socialHubMessages');
    messages = storedMessages ? JSON.parse(storedMessages) : [...dummyMessages];

    // Check if user is logged in
    const storedUser = localStorage.getItem('socialHubCurrentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showApp();
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('socialHubUsers', JSON.stringify(users));
    localStorage.setItem('socialHubPosts', JSON.stringify(posts));
    localStorage.setItem('socialHubMessages', JSON.stringify(messages));
    if (currentUser) {
        localStorage.setItem('socialHubCurrentUser', JSON.stringify(currentUser));
    }
}

// ========================================
// AUTHENTICATION
// ========================================

// Login handler
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const emailOrUsername = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    // Clear previous errors
    document.getElementById('loginEmailError').classList.add('hidden');
    document.getElementById('loginPasswordError').classList.add('hidden');

    // Find user
    const user = users.find(u =>
        (u.email === emailOrUsername || u.username === emailOrUsername) && u.password === password
    );

    if (!user) {
        document.getElementById('loginPasswordError').textContent = 'Invalid credentials';
        document.getElementById('loginPasswordError').classList.remove('hidden');
        return;
    }

    // Login successful
    currentUser = user;
    saveData();
    showApp();
});

// Register handler
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('registerName').value.trim();
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.classList.add('hidden'));

    let hasError = false;

    // Validation
    if (name.length < 2) {
        document.getElementById('registerNameError').textContent = 'Name must be at least 2 characters';
        document.getElementById('registerNameError').classList.remove('hidden');
        hasError = true;
    }

    if (username.length < 3) {
        document.getElementById('registerUsernameError').textContent = 'Username must be at least 3 characters';
        document.getElementById('registerUsernameError').classList.remove('hidden');
        hasError = true;
    }

    if (users.find(u => u.username === username)) {
        document.getElementById('registerUsernameError').textContent = 'Username already taken';
        document.getElementById('registerUsernameError').classList.remove('hidden');
        hasError = true;
    }

    if (users.find(u => u.email === email)) {
        document.getElementById('registerEmailError').textContent = 'Email already registered';
        document.getElementById('registerEmailError').classList.remove('hidden');
        hasError = true;
    }

    if (password.length < 6) {
        document.getElementById('registerPasswordError').textContent = 'Password must be at least 6 characters';
        document.getElementById('registerPasswordError').classList.remove('hidden');
        hasError = true;
    }

    if (password !== confirmPassword) {
        document.getElementById('registerConfirmError').textContent = 'Passwords do not match';
        document.getElementById('registerConfirmError').classList.remove('hidden');
        hasError = true;
    }

    if (hasError) return;

    // Create new user
    const newUser = {
        id: users.length + 1,
        name: name,
        username: username,
        email: email,
        password: password,
        bio: "New to SocialHub! 👋",
        avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
        followers: 0,
        following: 0
    };

    users.push(newUser);
    currentUser = newUser;
    saveData();
    showApp();
});

// Toggle between login and register
document.getElementById('showRegister').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.remove('hidden');
});

document.getElementById('showLogin').addEventListener('click', function (e) {
    e.preventDefault();
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', function () {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('socialHubCurrentUser');
        showLogin();
    }
});

// ========================================
// UI FUNCTIONS
// ========================================

function showApp() {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('register-page').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');

    updateUserInfo();
    loadTheme();
    renderFeeds();
    renderMessages();
    renderProfile();
}

function showLogin() {
    document.getElementById('app').classList.add('hidden');
    document.getElementById('login-page').classList.remove('hidden');
    document.getElementById('register-page').classList.add('hidden');

    // Clear forms
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
}

function updateUserInfo() {
    if (!currentUser) return;

    document.getElementById('sidebarUserName').textContent = currentUser.name;
    document.getElementById('sidebarUserHandle').textContent = `@${currentUser.username}`;
}

// ========================================
// NAVIGATION
// ========================================

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function () {
        const page = this.getAttribute('data-page');
        navigateToPage(page);
    });
});

function navigateToPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));

    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    // Show selected page
    document.getElementById(`${page}-page`).classList.remove('hidden');

    // Add active class to selected nav link
    document.querySelector(`[data-page="${page}"]`).classList.add('active');

    // Close mobile menu
    document.getElementById('sidebar').classList.remove('active');
    
    // Ensure content is re-rendered if needed
    if (page === 'feeds') {
        renderFeeds();
    } else if (page === 'profile') {
        renderProfile();
    } else if (page === 'messages') {
        renderMessages();
    }
}

// Mobile menu toggle
const mobileMenuToggle = document.createElement('button');
mobileMenuToggle.className = 'mobile-menu-toggle';
mobileMenuToggle.innerHTML = '☰';
document.body.appendChild(mobileMenuToggle);

mobileMenuToggle.addEventListener('click', function () {
    document.getElementById('sidebar').classList.toggle('active');
});

// ========================================
// POSTS / FEEDS
// ========================================

let selectedImage = null;

// Image upload handler
document.getElementById('imageUpload').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            selectedImage = event.target.result;
            showImagePreview(selectedImage);
        };
        reader.readAsDataURL(file);
    }
});

function showImagePreview(imageUrl) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = `
                <img src="${imageUrl}" class="preview-img" alt="Preview">
                <button class="remove-image" onclick="removeImagePreview()">×</button>
            `;
    preview.classList.remove('hidden');
}

function removeImagePreview() {
    selectedImage = null;
    document.getElementById('imagePreview').classList.add('hidden');
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('imageUpload').value = '';
}

// Submit post handler
document.getElementById('submitPost').addEventListener('click', function () {
    const content = document.getElementById('postTextarea').value.trim();

    if (!content && !selectedImage) {
        alert('Please enter some text or select an image');
        return;
    }

    createPost(content, selectedImage);
});

// Create post button in sidebar
document.getElementById('createPostBtn').addEventListener('click', function () {
    navigateToPage('feeds');
    document.getElementById('postTextarea').focus();
});

function createPost(content, image) {
    const newPost = {
        id: posts.length + 1,
        userId: currentUser.id,
        content: content,
        image: image,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: new Date().toISOString(),
        likedBy: []
    };

    posts.unshift(newPost);
    saveData();

    // Clear form
    document.getElementById('postTextarea').value = '';
    removeImagePreview();

    // Re-render feeds
    renderFeeds();
    renderProfile();
}

function renderFeeds() {
    const container = document.getElementById('postsContainer');
    container.innerHTML = ''; 

    // Sort posts by timestamp (newest first)
    const sortedPosts = [...posts].sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    );

    sortedPosts.forEach(post => {
        const postElement = createPostElement(post);
        container.appendChild(postElement);
    });

    // BARU: Panggil fungsi ini untuk mengaktifkan tombol hapus pada postingan yang baru di-render
    setupDeleteButtonListeners(); 
}

function createPostElement(post) {
    const user = users.find(u => u.id === post.userId);
    const isLiked = post.likedBy.includes(currentUser.id);
    
    // BARU: Tentukan apakah tombol hapus harus ditampilkan (hanya jika postingan milik user yang sedang login)
    const isCurrentUserPost = post.userId === currentUser.id;
    let deleteButtonHTML = '';

    if (isCurrentUserPost) {
        // Data ID postingan disimpan di atribut data-post-id untuk diakses oleh fungsi deletePost
        deleteButtonHTML = `
            <button class="delete-btn" style="margin-left: auto;" data-post-id="${post.id}">
                <span class="nav-icon">🗑️</span> Hapus
            </button>
        `;
    } else {
        // Elemen placeholder agar layout tidak terlalu berubah
        deleteButtonHTML = `<div style="margin-left: auto;"></div>`; 
    }


    const postCard = document.createElement('div');
    postCard.className = 'post-card';
    postCard.id = `post-${post.id}`; // Tambahkan ID untuk memudahkan penghapusan visual

    const timeAgo = getTimeAgo(post.timestamp);

    postCard.innerHTML = `
                <div class="post-header">
                    <div class="avatar">${user.avatar}</div>
                    <div class="post-user-info">
                        <div class="post-username">${user.name}</div>
                        <div class="post-handle">@${user.username}</div>
                    </div>
                    <div class="post-time">${timeAgo}</div>
                    ${deleteButtonHTML}
                </div>
                ${post.content ? `<div class="post-content">${post.content}</div>` : ''}
                ${post.image ? `<img src="${post.image}" class="post-image" alt="Post image">` : ''}
                <div class="post-actions">
                    <button class="action-btn ${isLiked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                        ${isLiked ? '❤️' : '🤍'} ${post.likes}
                    </button>
                    <button class="action-btn">
                        💬 ${post.comments}
                    </button>
                    <button class="action-btn">
                        🔄 ${post.shares}
                    </button>
                </div>
            `;

    return postCard;
}

/**
 * BARU: FUNGSI Menghapus Postingan dari data dan UI
 */
function deletePost(postId) {
    if (!currentUser) return; 
    
    const confirmation = confirm("Apakah Anda yakin ingin menghapus postingan ini secara permanen?");
    if (!confirmation) return;

    // 1. Hapus dari array posts (hanya jika milik user saat ini)
    const initialLength = posts.length;
    posts = posts.filter(p => p.id !== postId || p.userId !== currentUser.id);

    if (posts.length < initialLength) {
        // 2. Simpan perubahan ke localStorage
        saveData();

        // 3. Update UI
        const postElement = document.getElementById(`post-${postId}`);
        if (postElement) {
            postElement.remove();
        }
        
        // Render ulang feeds dan profile untuk sinkronisasi
        if (!document.getElementById('feeds-page').classList.contains('hidden')) {
            renderFeeds();
        }
        if (!document.getElementById('profile-page').classList.contains('hidden')) {
            renderProfile();
        }
    } else {
        alert("Gagal menghapus postingan. Postingan mungkin bukan milik Anda.");
    }
}

/**
 * BARU: FUNGSI Mendaftarkan Listener untuk semua tombol Hapus
 */
function setupDeleteButtonListeners() {
    // Gunakan event delegation untuk tombol hapus
    document.querySelectorAll('.delete-btn').forEach(button => {
        // Hapus listener sebelumnya jika ada (untuk menghindari duplikasi saat re-render)
        button.removeEventListener('click', handleDeleteClick);
        // Tambahkan listener baru
        button.addEventListener('click', handleDeleteClick);
    });
}

function handleDeleteClick(e) {
    // Ambil ID postingan dari atribut data
    const postId = parseInt(e.currentTarget.getAttribute('data-post-id'));
    if (postId) {
        deletePost(postId);
    }
}


function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const likedIndex = post.likedBy.indexOf(currentUser.id);

    if (likedIndex > -1) {
        // Unlike
        post.likedBy.splice(likedIndex, 1);
        post.likes = Math.max(0, post.likes - 1);
    } else {
        // Like
        post.likedBy.push(currentUser.id);
        post.likes++;
    }

    saveData();
    renderFeeds();

    // Update profile if on profile page
    if (!document.getElementById('profile-page').classList.contains('hidden')) {
        renderProfile();
    }
}

function getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return past.toLocaleDateString();
}

// ========================================
// MESSAGES
// ========================================

function renderMessages() {
    const container = document.getElementById('messagesList');
    container.innerHTML = '';

    // Get unique conversations
    const conversations = new Map();

    messages.forEach(msg => {
        const otherUserId = msg.fromUserId === currentUser.id ? msg.toUserId : msg.fromUserId;

        if (!conversations.has(otherUserId) ||
            new Date(msg.timestamp) > new Date(conversations.get(otherUserId).timestamp)) {
            conversations.set(otherUserId, msg);
        }
    });

    // Sort by timestamp
    const sortedConversations = Array.from(conversations.entries())
        .sort((a, b) => new Date(b[1].timestamp) - new Date(a[1].timestamp));

    sortedConversations.forEach(([userId, msg]) => {
        const user = users.find(u => u.id === userId);
        const messageCard = document.createElement('div');
        messageCard.className = 'message-card';

        const timeAgo = getTimeAgo(msg.timestamp);

        messageCard.innerHTML = `
                    <div class="avatar">${user.avatar}</div>
                    <div class="message-info">
                        <div class="post-username">${user.name}</div>
                        <div class="message-preview">${msg.message}</div>
                    </div>
                    <div class="post-time">${timeAgo}</div>
                `;

        container.appendChild(messageCard);
    });

    if (sortedConversations.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No messages yet</p>';
    }
}

// ========================================
// PROFILE
// ========================================

function renderProfile() {
    if (!currentUser) return;

    document.getElementById('profileAvatar').textContent = currentUser.avatar;
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileHandle').textContent = `@${currentUser.username}`;
    document.getElementById('profileBio').textContent = currentUser.bio;

    // Count user's posts
    const userPosts = posts.filter(p => p.userId === currentUser.id);
    document.getElementById('profilePosts').textContent = userPosts.length;

    // Render user's posts
    const container = document.getElementById('userPostsContainer');
    container.innerHTML = '';

    const sortedPosts = userPosts.sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    );

    sortedPosts.forEach(post => {
        const postElement = createPostElement(post);
        container.appendChild(postElement);
    });

    if (userPosts.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 40px;">No posts yet</p>';
    }
    
    // BARU: Panggil listeners untuk tombol hapus di halaman profile
    setupDeleteButtonListeners(); 
}

// ========================================
// SETTINGS
// ========================================

const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', function () {
    this.classList.toggle('active');
    const isDark = this.classList.contains('active');

    if (isDark) {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('socialHubTheme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('socialHubTheme', 'light');
    }
});

function loadTheme() {
    const savedTheme = localStorage.getItem('socialHubTheme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        themeToggle.classList.add('active');
    }
}

// ========================================
// INITIALIZE APP
// ========================================

document.addEventListener('DOMContentLoaded', function () {
    initializeData();
});