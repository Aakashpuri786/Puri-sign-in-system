<template>
  <div id="app">
    <header>
      <h1>My Website</h1>
      <nav v-if="isAuthenticated">
        <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
        <div class="profile-menu" @click="toggleProfileMenu" ref="profileMenu">
          <button class="profile-btn">
            <span class="profile-icon">👤</span>
            <span class="profile-name">{{ username }}</span>
            <span class="dropdown-arrow">▼</span>
          </button>
          <div v-if="showProfileMenu" class="profile-dropdown">
            <div class="profile-info">
              <div class="profile-email">{{ userEmail }}</div>
              <div class="profile-status">✓ Verified</div>
            </div>
            <button @click="handleSignOut" class="signout-btn">Sign Out</button>
          </div>
        </div>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default {
  name: 'App',
  data() {
    return {
      showProfileMenu: false
    }
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('websiteToken')
    },
    username() {
      const email = localStorage.getItem('userEmail') || ''
      return email.split('@')[0] || 'User'
    },
    userEmail() {
      return localStorage.getItem('userEmail') || 'Unknown'
    }
  },
  mounted() {
    // Close profile menu when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    toggleProfileMenu() {
      this.showProfileMenu = !this.showProfileMenu
    },
    handleClickOutside(event) {
      if (this.$refs.profileMenu && !this.$refs.profileMenu.contains(event.target)) {
        this.showProfileMenu = false
      }
    },
    async handleSignOut() {
      try {
        await axios.post(`${API_URL}/api/auth/logout`)
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // Clear all auth data
        localStorage.removeItem('websiteToken')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userVerified')
        this.showProfileMenu = false
        // Redirect to home
        if (this.$route.path !== '/') {
          this.$router.push('/')
        } else {
          window.location.reload()
        }
      }
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background: rgba(255, 255, 255, 0.95);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

header h1 {
  color: #f5576c;
  font-size: 1.5rem;
}

nav {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-link {
  color: #f5576c;
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background 0.3s;
}

.nav-link:hover {
  background: #f5f5f5;
}

/* Profile Menu */
.profile-menu {
  position: relative;
}

.profile-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.profile-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.profile-icon {
  font-size: 1.2rem;
}

.profile-name {
  font-size: 0.9rem;
}

.dropdown-arrow {
  font-size: 0.7rem;
  transition: transform 0.3s;
}

.profile-menu:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.profile-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  min-width: 250px;
  z-index: 1000;
  animation: slideDown 0.3s ease-out;
  overflow: hidden;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.profile-info {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.profile-email {
  color: #333;
  font-weight: 600;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.profile-status {
  color: #155724;
  font-size: 0.8rem;
  background: #d4edda;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  display: inline-block;
}

.signout-btn {
  width: 100%;
  padding: 0.75rem 1rem;
  background: #dc3545;
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
  text-align: center;
}

.signout-btn:hover {
  background: #c82333;
}

main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
</style>

