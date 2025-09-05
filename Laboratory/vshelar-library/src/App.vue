<script setup>
// import JSON from './components/JSON.vue'
// import RegistrationFormForm from './components/RegistrationForm.vue'
import BHeader from './components/BHeader.vue'
// import JSON from './components/JSON.vue'
</script>

<template>
  <div class="main-container">
    <header>
      <BHeader />
    </header>

    <main class="main-box container">
      <!-- <RegistrationFormForm /> -->
      <!-- <JSON/> -->
      <router-view></router-view>
    </main>
  </div>
</template>

<style scoped>
/* Our logic will go here */
.card {
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.card-header {
  background-color: #275fda;
  color: white;
  padding: 10px;
  border-radius: 10px 10px 0 0;
}
.list-group-item {
  padding: 10px;
}
</style>
