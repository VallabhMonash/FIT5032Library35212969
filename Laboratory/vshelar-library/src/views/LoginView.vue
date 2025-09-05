<template>
  <div class="container" style="max-width: 480px">
    <h1 class="h4 mb-3">Login</h1>
    <form @submit.prevent="onSubmit" class="vstack gap-3">
      <div>
        <label class="form-label">Username</label>
        <input v-model.trim="username" class="form-control" autocomplete="username" />
      </div>
      <div>
        <label class="form-label">Password</label>
        <input
          v-model="password"
          type="password"
          class="form-control"
          autocomplete="current-password"
        />
      </div>
      <div class="text-muted small">Try <code>admin</code> / <code>123</code></div>
      <div v-if="error" class="text-danger small">{{ error }}</div>
      <button class="btn btn-primary" type="submit">Sign in</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '@/router'

const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const error = ref('')

function onSubmit() {
  error.value = ''
  const ok = login(username.value, password.value)
  if (ok) {
    const redirect = route.query.redirect || '/home'
    router.push(redirect)
  } else {
    error.value = 'Invalid username or password.'
  }
}
</script>
