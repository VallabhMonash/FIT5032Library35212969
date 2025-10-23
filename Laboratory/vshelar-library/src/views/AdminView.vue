<template>
  <div class="p-6 space-y-3">
    <h1>Admin Dashboard</h1>
    <p>This page is visible only to <strong>admin</strong>.</p>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { auth, db } from '@/firebase/init'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const u = ref(null)
const role = ref(null)

onMounted(() => {
  onAuthStateChanged(auth, async (user) => {
    u.value = user
    if (user) {
      const snap = await getDoc(doc(db, 'users', user.uid))
      role.value = snap.exists() ? (snap.data().role ?? 'user') : 'user'
      console.log('AdminView current user:', { email: user.email, role: role.value })
    } else {
      role.value = null
    }
  })
})

const safeUser = computed(() => ({
  email: u.value?.email ?? null,
  uid: u.value?.uid ?? null,
  role: role.value,
}))

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
