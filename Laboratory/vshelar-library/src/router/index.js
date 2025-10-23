// src/router/index.js  — Firebase Auth + Firestore roles
import { createRouter, createWebHistory } from 'vue-router'
import { reactive } from 'vue'

// Views
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import AdminView from '@/views/AdminView.vue'
import FirebaseSigninView from '@/views/FirebaseSigninView.vue'
import FirebaseRegisterView from '@/views/FirebaseRegisterView.vue'
import AddBookView from '@/views/AddBookView.vue'
import LogoutView from '@/views/LogoutView.vue' // you said you have this

// Firebase (expects you have src/firebase/init.js exporting auth, db)
import { auth, db } from '@/firebase/init'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { getDoc, doc } from 'firebase/firestore'
import GetBookCountView from '@/views/GetBookCountView.vue'
import WeatherView from '@/views/WeatherView.vue'
import CountBookAPI from '@/views/CountBookAPI.vue'
import GetAllBookAPI from '@/views/GetAllBookAPI.vue'

// Central reactive auth/role state
const state = reactive({
  ready: false, // flips true after first onAuthStateChanged resolves
  user: null, // Firebase User or null
  role: null, // 'admin' | 'user' | null
})

let resolveAuthInit
const authInit = new Promise((res) => {
  resolveAuthInit = res
})

// Keep Firebase auth in sync and fetch the role from Firestore
onAuthStateChanged(auth, async (u) => {
  state.user = u
  if (u) {
    try {
      const snap = await getDoc(doc(db, 'users', u.uid)) // /users/{uid}.role
      const data = snap.exists() ? snap.data() : {}
      state.role = data?.role ?? 'user'
      console.log('Auth state:', { email: u.email, role: state.role })
    } catch (e) {
      console.warn('Failed to fetch role doc:', e)
      state.role = 'user'
    }
  } else {
    state.role = null
  }
  if (!state.ready) {
    state.ready = true
    resolveAuthInit?.()
  }
})

const routes = [
  { path: '/getAllBookAPI', name: 'getAllBookAPI', component: GetAllBookAPI },
  { path: '/countBookAPI', name: 'countBookAPI', component: CountBookAPI },
  { path: '/weather', name: 'WeatherView', component: WeatherView },
  { path: '/getbookcount', name: 'GetBookCountView', component: GetBookCountView },
  { path: '/home', name: 'Home', component: HomeView },

  // Protected (any signed-in user)
  { path: '/about', name: 'About', component: AboutView, meta: { requiresAuth: true } },

  // Auth pages
  { path: '/FireLogin', name: 'FireLogin', component: FirebaseSigninView },
  { path: '/FireRegister', name: 'Register', component: FirebaseRegisterView },

  // Example app page (signed-in)
  { path: '/addbook', name: 'AddBook', component: AddBookView, meta: { requiresAuth: true } },

  // Admin-only
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true, roles: ['admin'] },
  },

  // Simple logout page (for your Screenshot Set 2)
  { path: '/logout', name: 'Logout', component: LogoutView, meta: { requiresAuth: true } },

  { path: '/:pathMatch(.*)*', redirect: '/FireLogin' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Global guard: wait for first auth, enforce auth + roles, prevent back-to-login
router.beforeEach(async (to) => {
  if (!state.ready) await authInit

  if (to.meta.requiresAuth && !state.user) {
    return { name: 'FireLogin', query: { redirect: to.fullPath } }
  }

  if (to.meta.roles && to.meta.roles.length) {
    const allowed = state.role && to.meta.roles.includes(state.role)
    if (!allowed) return { name: 'Home' }
  }

  if (to.name === 'FireLogin' && state.user) return { name: 'Home' }
  return true
})

// Exported logout helper (use anywhere): import { logout } from '@/router'
export async function logout() {
  console.log('Before logout, currentUser:', auth.currentUser)
  await signOut(auth)
  console.log('After logout, currentUser:', auth.currentUser) // should be null
}

export default router
