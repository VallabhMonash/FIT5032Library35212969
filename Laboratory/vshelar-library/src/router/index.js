import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import LoginView from '@/views/LoginView.vue'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import { reactive } from 'vue'

export const auth = reactive({
  isAuthenticated: !!localStorage.getItem('isAuth'),
  user: localStorage.getItem('authUser') || null,
})

// Hardcoded demo credentials
const DEMO = { username: 'admin', password: '123' }

export function login(username, password) {
  const ok = username === DEMO.username && password === DEMO.password

  if (ok) {
    auth.isAuthenticated = true
    auth.user = username
    localStorage.setItem('isAuth', '1')
    localStorage.setItem('authUser', username)
  }
  return ok
}

export function logout() {
  auth.isAuthenticated = false
  auth.user = null
  localStorage.removeItem('isAuth')
  localStorage.removeItem('authUser')
}

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true },
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: { requiresAuth: true }, // protected route
  },
  {
    path: '/FireLogin',
    name: 'FireLogin',
    component: FirebaseSigninView,
  },
  {
    path: '/',
    name: 'Login',
    component: LoginView,
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    // send unauthenticated users to Login, preserving intent
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'Login' && auth.isAuthenticated) {
    return { name: 'Home' }
  }
  return true
})

export default router
