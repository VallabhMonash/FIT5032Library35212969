<template>
  <div class="p-6 space-y-3">
    <h1>Sign in</h1>

    <p><input type="email" placeholder="Email" v-model="email" /></p>
    <p><input type="password" placeholder="Password" v-model="password" /></p>
    <p>
      <button @click="signin" :disabled="loading">
        {{ loading ? 'Signing in...' : 'Sign in via Firebase' }}
      </button>
    </p>

    <p v-if="error" class="error">{{ error }}</p>

    <!-- Role badge + quick nav for screenshots -->
    <p v-if="user">Signed in as: {{ user.email }} (role: {{ role ?? '...' }})</p>
    <div class="space-x-3" v-if="user">
      <router-link to="/home">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/admin">Admin</router-link>
      <!-- <router-link to="/logout">Logout</router-link> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { auth, db } from '@/firebase/init' // <-- make sure this exports auth, db
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const route = useRoute()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const user = ref(null)
const role = ref(null)

async function fetchRole(u) {
  try {
    const snap = await getDoc(doc(db, 'users', u.uid))
    role.value = snap.exists() ? (snap.data().role ?? 'user') : 'user'
  } catch (e) {
    console.warn('Failed to fetch role doc:', e)
    role.value = 'user'
  }
  // Log for your Screenshot Set 1
  console.log('Login page current user:', { email: u.email, role: role.value })
}

async function signin() {
  error.value = ''
  loading.value = true
  try {
    await signInWithEmailAndPassword(auth, email.value.trim(), password.value)
    // Optional redirect support
    const redirect = (route.query.redirect && String(route.query.redirect)) || '/home'
    router.push(redirect)
  } catch (e) {
    error.value = e?.code || 'Sign-in failed'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  onAuthStateChanged(auth, async (u) => {
    user.value = u
    if (u) await fetchRole(u)
    else role.value = null
  })
})
</script>

<style scoped>
input {
  padding: 8px;
  width: 260px;
}
button {
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}
.error {
  color: #b00020;
}
a {
  text-decoration: underline;
  margin-right: 8px;
}
</style>
