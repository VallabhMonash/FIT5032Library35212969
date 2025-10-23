<template>
  <div class="p-6 space-y-3">
    <h1>Logout</h1>
    <p>Open DevTools → Console to see currentUser logs.</p>
    <button @click="doLogout">Log out now</button>
  </div>
</template>

<script setup>
import { auth } from '@/firebase/init'
import { signOut } from 'firebase/auth'

async function doLogout() {
  console.log('Before logout, currentUser:', auth.currentUser)
  await signOut(auth)
  console.log('After logout, currentUser:', auth.currentUser)
}
</script>

<style scoped>
button {
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}
</style>
