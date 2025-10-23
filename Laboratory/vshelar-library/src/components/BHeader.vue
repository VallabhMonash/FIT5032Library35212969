<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'

// ✅ Use Firebase auth, not the router
import { auth, db } from '@/firebase/init'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const router = useRouter()

// Track signed-in user + role for header UI
const user = ref(null)
const role = ref(null)
const isAuthenticated = computed(() => !!user.value)

// async function handleLogout() {
//   console.log('Before logout, currentUser:', auth.currentUser)
//   await signOut(auth)
//   console.log('After logout, currentUser:', auth.currentUser) // null
//   router.push({ name: 'Home' })
// }

onMounted(() => {
  onAuthStateChanged(auth, async (u) => {
    user.value = u
    if (u) {
      try {
        const snap = await getDoc(doc(db, 'users', u.uid))
        role.value = snap.exists() ? (snap.data().role ?? 'user') : 'user'
      } catch {
        role.value = 'user'
      }
      console.log('Header current user:', { email: u.email, role: role.value })
    } else {
      role.value = null
    }
  })
})
</script>

<template>
  <div class="container">
    <header class="d-flex justify-content-between align-items-center py-3 w-100">
      <!-- Left: Nav -->
      <ul class="nav nav-pills">
        <li class="nav-item">
          <RouterLink to="/home" class="nav-link" active-class="active" aria-current="page">
            Home (Week 5)
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/about" class="nav-link" active-class="active">About</RouterLink>
        </li>
        <li class="nav-item" v-if="!isAuthenticated">
          <!-- ✅ Correct case: /FireLogin -->
          <RouterLink to="/FireLogin" class="nav-link" active-class="active"
            >Firebase Login</RouterLink
          >
        </li>
        <li class="nav-item" v-if="!isAuthenticated">
          <RouterLink to="/FireRegister" class="nav-link" active-class="active"
            >Firebase Register</RouterLink
          >
        </li>
        <li class="nav-item" v-if="isAuthenticated">
          <RouterLink to="/addbook" class="nav-link" active-class="active">Add Book</RouterLink>
        </li>
        <li class="nav-item" v-if="isAuthenticated && role === 'admin'">
          <RouterLink to="/admin" class="nav-link" active-class="active">Admin</RouterLink>
        </li>
        <li class="nav-item" v-if="isAuthenticated">
          <RouterLink to="/logout" class="nav-link" active-class="active">Logout</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/getbookcount" class="nav-link" active-class="active" aria-current="page">
            Get Book Count
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/weather" class="nav-link" active-class="active" aria-current="page">
            Weather
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/countBookAPI" class="nav-link" active-class="active" aria-current="page">
            Count Book API
          </RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink
            to="/getAllBookAPI"
            class="nav-link"
            active-class="active"
            aria-current="page"
          >
            GetAllBookAPI
          </RouterLink>
        </li>
      </ul>

      <!-- Right: Auth controls -->
      <div class="d-flex align-items-center gap-2">
        <span v-if="isAuthenticated" class="text-muted me-2">
          Hello, {{ user?.email }} <span v-if="role">({{ role }})</span>
        </span>
        <!-- <button
          v-if="isAuthenticated"
          class="ms-2 btn btn-outline-secondary btn-sm"
          @click="handleLogout"
        >
          Logout
        </button> -->
      </div>
    </header>
  </div>
</template>

<style scoped>
.b-example-divider {
  height: 3rem;
  background-color: rgba(0, 0, 0, 0.1);
  border: solid rgba(0, 0, 0, 0.15);
  border-width: 1px 0;
  box-shadow:
    inset 0 0.5em 1.5em rgba(0, 0, 0, 0.1),
    inset 0 0.125em 0.5em rgba(0, 0, 0, 0.15);
}
.form-control-dark {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: var(--bs-gray);
}
.form-control-dark:focus {
  color: #fff;
  background-color: var(--bs-dark);
  border-color: #fff;
  box-shadow: 0 0 0 0.25rem rgba(255, 255, 255, 0.25);
}
.bi {
  vertical-align: -0.125em;
  fill: currentColor;
}
.text-small {
  font-size: 85%;
}
.dropdown-toggle {
  outline: 0;
}
</style>
