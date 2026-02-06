<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Sign in to Puri Account</h2>
      <p class="subtitle">Use your @puri.com email to sign in</p>
      
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-wrapper">
            <input
              id="email"
              v-model="email"
              type="text"
              placeholder="username"
              required
              class="input-username"
            />
            <span class="email-suffix">@puri.com</span>
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Signing in...' : 'Sign in' }}
        </button>
      </form>

      <p class="auth-link">
        Don't have an account? <router-link to="/signup">Create one</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      loading: false
    }
  },
  methods: {
    async handleLogin() {
      this.error = ''
      this.loading = true

      try {
        const fullEmail = `${this.email}@puri.com`
        const response = await axios.post(`${API_URL}/api/auth/login`, {
          email: fullEmail,
          password: this.password
        })

        localStorage.setItem('puriToken', response.data.token)
        
        // Check if there's a redirect URL (from website)
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect')
        if (redirectUrl) {
          // Pass token to redirect URL
          const separator = redirectUrl.includes('?') ? '&' : '?'
          window.location.href = `${redirectUrl}${separator}token=${response.data.token}`
        } else {
          this.$router.push('/dashboard')
        }
      } catch (err) {
        this.error = err.response?.data?.error || 'Failed to sign in'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.auth-container {
  width: 100%;
  max-width: 400px;
}

.auth-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

h2 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.75rem;
}

.subtitle {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.input-wrapper {
  display: flex;
  align-items: center;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: border-color 0.3s;
}

.input-wrapper:focus-within {
  border-color: #667eea;
}

.input-username {
  flex: 1;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  outline: none;
}

.email-suffix {
  padding: 0.75rem;
  background: #f5f5f5;
  color: #666;
  font-weight: 500;
}

input[type="password"],
input[type="text"] {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #667eea;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.9rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-top: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-link {
  margin-top: 1.5rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.auth-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.auth-link a:hover {
  text-decoration: underline;
}
</style>

