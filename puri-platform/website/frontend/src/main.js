import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Home from './components/Home.vue'
import Dashboard from './components/Dashboard.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('websiteToken')
  const userVerified = localStorage.getItem('userVerified')
  
  if (to.meta.requiresAuth) {
    // Protected route - require authentication and verification
    if (!token) {
      // No token, redirect to home
      next('/')
    } else if (userVerified !== 'true') {
      // Token exists but user not verified, clear storage and redirect
      localStorage.removeItem('websiteToken')
      localStorage.removeItem('userEmail')
      localStorage.removeItem('userVerified')
      next('/')
    } else {
      // Verified user - grant dashboard access
      next()
    }
  } else if (to.path === '/') {
    // Home page - allow authenticated users to see home content
    // Clear invalid auth data if not verified
      if (token && userVerified !== 'true') {
        localStorage.removeItem('websiteToken')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userVerified')
      }
      next()
  } else {
    next()
  }
})

createApp(App).use(router).mount('#app')

