import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Signup from './components/Signup.vue'
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/signup', component: Signup },
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('puriToken')
    if (!token) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

createApp(App).use(router).mount('#app')

