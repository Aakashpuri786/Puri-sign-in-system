<template>
  <div class="dashboard-container">
    <div class="dashboard-card">
      <h2>Welcome to Puri Account</h2>
      
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else-if="user" class="user-info">
        <div class="info-item">
          <span class="label">Email:</span>
          <span class="value">{{ user.email }}</span>
        </div>
        <div class="info-item">
          <span class="label">Status:</span>
          <span :class="['status', user.verified ? 'verified' : 'unverified']">
            {{ user.verified ? '✓ Verified' : '✗ Unverified' }}
          </span>
        </div>
        <div class="info-item">
          <span class="label">Account Created:</span>
          <span class="value">{{ formatDate(user.createdAt) }}</span>
        </div>
      </div>

      <button @click="handleLogout" class="btn-secondary">Sign Out</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default {
  name: 'Dashboard',
  data() {
    return {
      user: null,
      loading: true
    }
  },
  async mounted() {
    await this.fetchUser()
  },
  methods: {
    async fetchUser() {
      try {
        const token = localStorage.getItem('puriToken')
        if (!token) {
          this.$router.push('/login')
          return
        }

        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        this.user = response.data
      } catch (error) {
        console.error('Failed to fetch user:', error)
        localStorage.removeItem('puriToken')
        this.$router.push('/login')
      } finally {
        this.loading = false
      }
    },
    handleLogout() {
      localStorage.removeItem('puriToken')
      this.$router.push('/login')
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString()
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  max-width: 500px;
}

.dashboard-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

h2 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.75rem;
}

.loading {
  text-align: center;
  color: #666;
  padding: 2rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  color: #333;
  font-weight: 500;
}

.status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status.verified {
  background: #d4edda;
  color: #155724;
}

.status.unverified {
  background: #f8d7da;
  color: #721c24;
}

.btn-secondary {
  width: 100%;
  background: #6c757d;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-secondary:hover {
  background: #5a6268;
}
</style>

