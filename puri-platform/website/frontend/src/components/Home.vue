<template>
  <div class="home-container">
    <!-- Success Message (shows for 1 second then disappears) -->
    <div v-if="showSuccess" class="success-popup">
      <div class="success-message">{{ successMessage }}</div>
    </div>

    <!-- Not Authenticated - Sign In Page -->
    <div v-if="!isAuthenticated" class="home-card">
      <h1>Welcome to My Website</h1>
      <p class="subtitle">Sign in with your Puri Account to continue</p>
      
      <div v-if="error" class="error-message">{{ error }}</div>
      
      <button @click="handleSignIn" :disabled="loading || showSuccess" class="btn-puri">
        <span v-if="!loading">Sign in with Puri</span>
        <span v-else>Redirecting...</span>
      </button>

      <p class="info-text">
        This website uses Puri Account System for authentication.<br>
        Only @puri.com email addresses are allowed.
      </p>
    </div>

    <!-- Authenticated - Home Content -->
    <div v-else class="home-content">
      <div class="welcome-section">
        <h1>Welcome back, {{ username }}!</h1>
        <p class="subtitle">You're successfully signed in with Puri Account</p>
      </div>

      <div class="content-grid">
        <div class="content-card">
          <div class="card-icon">📊</div>
          <h3>Analytics</h3>
          <p>View your personalized analytics and insights</p>
          <router-link to="/dashboard" class="card-link">View Dashboard →</router-link>
        </div>

        <div class="content-card">
          <div class="card-icon">⚡</div>
          <h3>Quick Actions</h3>
          <p>Access frequently used features and tools</p>
          <router-link to="/dashboard" class="card-link">Get Started →</router-link>
        </div>

        <div class="content-card">
          <div class="card-icon">🔒</div>
          <h3>Security</h3>
          <p>Your account is secured with Puri authentication</p>
          <span class="status-badge">Verified</span>
        </div>
      </div>

      <div class="info-section">
        <h3>🎉 Successfully Authenticated!</h3>
        <p>You have successfully signed in using <strong>Sign in with Puri</strong>. You can now access:</p>
        <ul class="feature-list">
          <li>✓ Dashboard with Insights & Analytics</li>
          <li>✓ AI Assistant for help and support</li>
          <li>✓ Recent Chats and Messages</li>
          <li>✓ All protected content</li>
        </ul>
        <router-link to="/dashboard" class="btn-dashboard">Go to Dashboard</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const PURI_AUTH_URL = import.meta.env.VITE_PURI_AUTH_URL || 'http://localhost:3000'
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default {
  name: 'Home',
  data() {
    return {
      error: '',
      loading: false,
      isAuthenticated: false,
      showSuccess: false,
      successMessage: ''
    }
  },
  mounted() {
    // Check if user is already authenticated
    const existingToken = localStorage.getItem('websiteToken')
    const userVerified = localStorage.getItem('userVerified')
    
    if (existingToken && userVerified === 'true') {
      // Already authenticated and verified - show content
      this.isAuthenticated = true
      return
    }

    // Check if returning from Puri Auth with token
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    
    if (token) {
      this.handleToken(token)
    }
  },
  computed: {
    username() {
      if (this.isAuthenticated) {
        const email = localStorage.getItem('userEmail') || 'Unknown'
        return email.split('@')[0]
      }
      return 'User'
    }
  },
  methods: {
    handleSignIn() {
      this.loading = true
      this.error = ''
      
      // Redirect to Puri Auth login with redirect back to this site
      const redirectUrl = `${window.location.origin}/`
      const puriLoginUrl = `${PURI_AUTH_URL}/login?redirect=${encodeURIComponent(redirectUrl)}`
      
      window.location.href = puriLoginUrl
    },
    async handleToken(token) {
      this.loading = true
      this.error = ''
      
      try {
        // Verify token with website backend
        const response = await axios.post(`${API_URL}/api/auth/puri-login`, {
          token
        })
        
        if (response.data.success && response.data.user) {
          // Verify user is verified and has @puri.com email
          if (!response.data.user.verified) {
            this.error = 'Your account is not verified. Please verify your Puri Account first.'
            this.loading = false
            return
          }
          
          if (!response.data.user.email.endsWith('@puri.com')) {
            this.error = 'Only @puri.com email addresses are allowed.'
            this.loading = false
            return
          }
          
          // Store token and user info
          localStorage.setItem('websiteToken', token)
          localStorage.setItem('userEmail', response.data.user.email)
          localStorage.setItem('userVerified', response.data.user.verified.toString())
          
          // Remove token from URL first
          window.history.replaceState({}, document.title, window.location.pathname)
          
          // Show success message briefly (1 second) then show website content
          this.loading = false
          this.error = ''
          this.showSuccess = true
          this.isAuthenticated = true
          this.successMessage = '✓ Authentication verified successfully!'
          
          // Force Vue to update the view
          this.$nextTick(() => {
            // Hide success message after 1 second and ensure content is visible
            setTimeout(() => {
              this.showSuccess = false
              // Scroll to top to show the content
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }, 1000)
          })
        } else {
          this.error = 'Failed to authenticate. Please try again.'
          this.loading = false
        }
      } catch (err) {
        console.error('Authentication error:', err)
        
        // More detailed error handling
        let errorMsg = 'Authentication failed'
        
        if (err.response) {
          // Server responded with error
          errorMsg = err.response.data?.error || `Server error: ${err.response.status}`
        } else if (err.request) {
          // Request made but no response
          errorMsg = 'Unable to connect to server. Please check if services are running.'
        } else {
          // Something else happened
          errorMsg = err.message || 'Authentication failed'
        }
        
        this.error = errorMsg
        this.loading = false
        // Remove token from URL
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }
}
</script>

<style scoped>
.home-container {
  width: 100%;
  max-width: 500px;
}

.home-card {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 2rem;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.btn-puri {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%;
  margin-bottom: 1.5rem;
}

.btn-puri:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-puri:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  border: 1px solid #c3e6cb;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.info-text {
  color: #666;
  font-size: 0.85rem;
  line-height: 1.6;
}

/* Success Popup */
.success-popup {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  animation: slideDown 0.3s ease-out, fadeOut 0.3s ease-in 0.7s forwards;
  pointer-events: none;
}

.success-popup .success-message {
  background: #d4edda;
  color: #155724;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid #c3e6cb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(-10px);
  }
}

/* Authenticated Home Content */
.home-content {
  width: 100%;
  max-width: 1200px;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.welcome-section {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.welcome-section h1 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.content-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.content-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.content-card h3 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.3rem;
}

.content-card p {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.card-link {
  display: inline-block;
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.card-link:hover {
  color: #764ba2;
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.info-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 12px;
  color: white;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.info-section h3 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.info-section p {
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0;
}

.feature-list li {
  padding: 0.5rem 0;
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.95rem;
}

.btn-dashboard {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-dashboard:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
}
</style>

