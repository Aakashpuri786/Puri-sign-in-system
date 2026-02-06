<template>
  <div class="dashboard-container" v-if="!loading">
    <div class="dashboard-card">
      <div class="welcome-header">
        <h2>Welcome, {{ username }}!</h2>
        <p class="welcome-subtitle">You're successfully signed in with Puri Account</p>
      </div>
      
      <div class="user-info">
        <div class="info-item">
          <span class="label">Email:</span>
          <span class="value">{{ userEmail }}</span>
        </div>
        <div class="info-item">
          <span class="label">Status:</span>
          <span class="status verified">✓ Verified via Puri Account</span>
        </div>
        <div class="info-item">
          <span class="label">Login Time:</span>
          <span class="value">{{ loginTime }}</span>
        </div>
      </div>

      <!-- Insights Section -->
      <div class="insights-section">
        <h3>📊 Insights & Analytics</h3>
        <div class="insights-grid">
          <div class="insight-card">
            <div class="insight-header">
              <span class="insight-icon">📈</span>
              <h4>User Growth</h4>
            </div>
            <div class="insight-value">{{ insights.growth }}%</div>
            <div class="insight-trend up">↑ +{{ insights.growthChange }}% this month</div>
          </div>

          <div class="insight-card">
            <div class="insight-header">
              <span class="insight-icon">👥</span>
              <h4>Active Users</h4>
            </div>
            <div class="insight-value">{{ insights.activeUsers }}</div>
            <div class="insight-trend up">↑ {{ insights.newUsers }} new today</div>
          </div>

          <div class="insight-card">
            <div class="insight-header">
              <span class="insight-icon">💬</span>
              <h4>Messages</h4>
            </div>
            <div class="insight-value">{{ insights.messages }}</div>
            <div class="insight-trend up">↑ {{ insights.messagesChange }}% increase</div>
          </div>

          <div class="insight-card">
            <div class="insight-header">
              <span class="insight-icon">⚡</span>
              <h4>Performance</h4>
            </div>
            <div class="insight-value">{{ insights.performance }}%</div>
            <div class="insight-trend up">↑ Optimized</div>
          </div>
        </div>
      </div>

      <!-- AI Assistant Section -->
      <div class="ai-section">
        <h3>🤖 AI Assistant</h3>
        <div class="ai-container">
          <div class="ai-chat-window">
            <div class="ai-messages" ref="aiMessages">
              <div v-for="(message, index) in aiMessages" :key="index" 
                   :class="['ai-message', message.type]">
                <div class="ai-avatar">{{ message.type === 'user' ? '👤' : '🤖' }}</div>
                <div class="ai-text">
                  <div class="ai-sender">{{ message.type === 'user' ? 'You' : 'AI Assistant' }}</div>
                  <div class="ai-content">{{ message.text }}</div>
                  <div class="ai-time">{{ message.time }}</div>
                </div>
              </div>
            </div>
            <div class="ai-input-area">
              <input 
                v-model="aiInput" 
                @keyup.enter="sendAIMessage"
                type="text" 
                placeholder="Ask me anything..." 
                class="ai-input"
                :disabled="aiLoading"
              />
              <button @click="sendAIMessage" :disabled="aiLoading || !aiInput.trim()" class="ai-send-btn">
                {{ aiLoading ? '⏳' : '📤' }}
              </button>
            </div>
          </div>
          <div class="ai-suggestions">
            <h4>Quick Actions</h4>
            <button v-for="(suggestion, index) in aiSuggestions" 
                    :key="index"
                    @click="useAISuggestion(suggestion)"
                    class="suggestion-btn">
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>

      <!-- Chats Section -->
      <div class="chats-section">
        <h3>💬 Recent Chats</h3>
        <div class="chats-container">
          <div v-for="(chat, index) in recentChats" :key="index" class="chat-item">
            <div class="chat-avatar">{{ chat.avatar }}</div>
            <div class="chat-info">
              <div class="chat-header">
                <span class="chat-name">{{ chat.name }}</span>
                <span class="chat-time">{{ chat.time }}</span>
              </div>
              <div class="chat-preview">{{ chat.preview }}</div>
              <div class="chat-badge" v-if="chat.unread">{{ chat.unread }} new</div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-section">
        <h3>🎉 Successfully Authenticated!</h3>
        <p>You have successfully signed in using <strong>Sign in with Puri</strong>. This demonstrates:</p>
        <ul class="feature-list">
          <li>✓ Centralized authentication via Puri Account System</li>
          <li>✓ Real-time token verification</li>
          <li>✓ Secure access to protected content</li>
          <li>✓ Seamless user experience</li>
        </ul>
      </div>

      <button @click="handleLogout" class="btn-secondary">Sign Out</button>
    </div>
  </div>
  <div v-else class="loading-container">
    <div class="loading-card">
      <div class="spinner"></div>
      <p>Loading dashboard...</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export default {
  name: 'Dashboard',
  data() {
    return {
      userEmail: '',
      loginTime: '',
      analyticsValue: '1,234',
      performanceValue: '98%',
      activityValue: '12 tasks',
      loading: true,
      insights: {
        growth: 0,
        growthChange: 0,
        activeUsers: 0,
        newUsers: 0,
        messages: 0,
        messagesChange: 0,
        performance: 0
      },
      aiMessages: [
        {
          type: 'assistant',
          text: 'Hello! I\'m your AI assistant. How can I help you today?',
          time: this.getCurrentTime()
        }
      ],
      aiInput: '',
      aiLoading: false,
      aiSuggestions: [
        'Show analytics',
        'Help with dashboard',
        'Generate report',
        'Check notifications'
      ],
      recentChats: []
    }
  },
  computed: {
    username() {
      if (this.userEmail && this.userEmail !== 'Unknown' && this.userEmail !== '') {
        return this.userEmail.split('@')[0]
      }
      return 'User'
    }
  },
  mounted() {
    // Check authentication first
    const token = localStorage.getItem('websiteToken')
    const userVerified = localStorage.getItem('userVerified')
    
    if (!token) {
      // No token - redirect to home
      window.location.href = '/'
      return
    }
    
    // Verify user is verified
    if (userVerified !== 'true') {
      // User not verified, clear storage and redirect back
      localStorage.removeItem('websiteToken')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userVerified')
      window.location.href = '/'
      return
    }

    // Load user data - user is verified, show dashboard
    this.userEmail = localStorage.getItem('userEmail') || 'Unknown'
    this.loginTime = new Date().toLocaleString()
    
    // Generate dynamic values
    this.generateResults()
    this.generateInsights()
    this.generateChats()
    
    // Mark as loaded - verified users have dashboard access
    this.loading = false
    
    // Force Vue to update
    this.$forceUpdate()
  },
  methods: {
    generateResults() {
      // Generate random but realistic values
      this.analyticsValue = Math.floor(Math.random() * 5000 + 1000).toLocaleString()
      this.performanceValue = Math.floor(Math.random() * 20 + 85) + '%'
      this.activityValue = Math.floor(Math.random() * 20 + 5) + ' tasks'
    },
    generateInsights() {
      // Generate dynamic insights
      this.insights = {
        growth: Math.floor(Math.random() * 30 + 15),
        growthChange: Math.floor(Math.random() * 5 + 2),
        activeUsers: Math.floor(Math.random() * 5000 + 2000).toLocaleString(),
        newUsers: Math.floor(Math.random() * 50 + 10),
        messages: Math.floor(Math.random() * 1000 + 500).toLocaleString(),
        messagesChange: Math.floor(Math.random() * 15 + 5),
        performance: Math.floor(Math.random() * 15 + 85)
      }
    },
    generateChats() {
      // Generate sample chat data
      const names = ['Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Eve Wilson']
      const avatars = ['👤', '👨', '👩', '🧑', '👧']
      const previews = [
        'Hey! How are you doing?',
        'Can we schedule a meeting?',
        'Thanks for the update!',
        'Great work on the project!',
        'Let me know when you\'re free'
      ]
      
      this.recentChats = Array.from({ length: 5 }, (_, i) => ({
        avatar: avatars[i % avatars.length],
        name: names[i],
        preview: previews[i % previews.length],
        time: this.getRelativeTime(i),
        unread: i < 2 ? Math.floor(Math.random() * 3 + 1) : null
      }))
    },
    getCurrentTime() {
      return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    },
    getRelativeTime(minutesAgo) {
      if (minutesAgo === 0) return 'Just now'
      if (minutesAgo === 1) return '1 min ago'
      return `${minutesAgo} mins ago`
    },
    sendAIMessage() {
      if (!this.aiInput.trim() || this.aiLoading) return
      
      const userMessage = this.aiInput.trim()
      this.aiInput = ''
      this.aiLoading = true
      
      // Add user message
      this.aiMessages.push({
        type: 'user',
        text: userMessage,
        time: this.getCurrentTime()
      })
      
      // Simulate AI response
      setTimeout(() => {
        const responses = [
          `I understand you're asking about "${userMessage}". Let me help you with that!`,
          `Great question! Based on your dashboard data, here's what I found...`,
          `I can help you with that. Here's a detailed response about "${userMessage}".`,
          `Thanks for asking! Let me provide you with some insights on "${userMessage}".`
        ]
        
        this.aiMessages.push({
          type: 'assistant',
          text: responses[Math.floor(Math.random() * responses.length)],
          time: this.getCurrentTime()
        })
        
        this.aiLoading = false
        
        // Scroll to bottom
        this.$nextTick(() => {
          const messagesEl = this.$refs.aiMessages
          if (messagesEl) {
            messagesEl.scrollTop = messagesEl.scrollHeight
          }
        })
      }, 1000 + Math.random() * 1000)
    },
    useAISuggestion(suggestion) {
      this.aiInput = suggestion
      this.sendAIMessage()
    },
    async handleLogout() {
      try {
        await axios.post(`${API_URL}/api/auth/logout`)
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // Clear all auth data
        localStorage.removeItem('websiteToken')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userVerified')
        this.$router.push('/')
      }
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  max-width: 1200px;
}

.dashboard-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.welcome-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
}

h2 {
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.welcome-subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0;
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
  padding: 0.75rem 1rem;
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

.results-section {
  margin-bottom: 2rem;
}

.results-section h3 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  text-align: center;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.result-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 1.5rem;
  border-radius: 12px;
  color: white;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
}

.result-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(245, 87, 108, 0.3);
}

.result-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.result-card h4 {
  margin: 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.result-card p {
  margin: 0.5rem 0 1rem;
  font-size: 0.85rem;
  opacity: 0.9;
}

.result-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 0.5rem;
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 0.9rem;
}

.content-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  color: white;
}

.content-section h3 {
  color: white;
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.content-section p {
  color: rgba(255, 255, 255, 0.95);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
}

.feature-list li {
  padding: 0.5rem 0;
  color: rgba(255, 255, 255, 0.95);
  font-size: 0.95rem;
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

.loading-container {
  width: 100%;
  max-width: 900px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-card {
  background: white;
  padding: 3rem;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  text-align: center;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-card p {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

/* Insights Section */
.insights-section {
  margin-bottom: 2rem;
}

.insights-section h3 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.insight-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1.5rem;
  border-radius: 12px;
  color: white;
  transition: transform 0.3s, box-shadow 0.3s;
}

.insight-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.insight-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.insight-icon {
  font-size: 1.5rem;
}

.insight-header h4 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  opacity: 0.9;
}

.insight-value {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.insight-trend {
  font-size: 0.85rem;
  opacity: 0.9;
}

.insight-trend.up {
  color: #90EE90;
}

/* AI Assistant Section */
.ai-section {
  margin-bottom: 2rem;
}

.ai-section h3 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ai-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.ai-chat-window {
  background: #f8f9fa;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 400px;
}

.ai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ai-message {
  display: flex;
  gap: 0.75rem;
  animation: fadeIn 0.3s ease-in;
}

.ai-message.user {
  flex-direction: row-reverse;
}

.ai-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  flex-shrink: 0;
}

.ai-message.user .ai-avatar {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.ai-text {
  flex: 1;
  max-width: 70%;
}

.ai-sender {
  font-size: 0.75rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.25rem;
}

.ai-content {
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  color: #333;
  font-size: 0.9rem;
  line-height: 1.5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ai-message.user .ai-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.ai-time {
  font-size: 0.7rem;
  color: #999;
  margin-top: 0.25rem;
}

.ai-input-area {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border-top: 1px solid #e0e0e0;
}

.ai-input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.3s;
}

.ai-input:focus {
  border-color: #667eea;
}

.ai-send-btn {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.ai-send-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.ai-send-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.ai-suggestions {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
}

.ai-suggestions h4 {
  color: #333;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.suggestion-btn {
  display: block;
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  color: #333;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
}

.suggestion-btn:hover {
  border-color: #667eea;
  background: #f0f4ff;
  transform: translateX(5px);
}

/* Chats Section */
.chats-section {
  margin-bottom: 2rem;
}

.chats-section h3 {
  color: #333;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chats-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chat-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
}

.chat-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.chat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.chat-name {
  font-weight: 600;
  color: #333;
  font-size: 0.95rem;
}

.chat-time {
  font-size: 0.75rem;
  color: #999;
}

.chat-preview {
  font-size: 0.85rem;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .results-grid,
  .insights-grid {
    grid-template-columns: 1fr;
  }
  
  .ai-container {
    grid-template-columns: 1fr;
  }
  
  .dashboard-card {
    padding: 1.5rem;
  }
  
  .ai-chat-window {
    height: 300px;
  }
}
</style>

