<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Create a reactive array to hold the books
const books = ref([])

// Fetch all books when this page is loaded
async function fetchBooks() {
  try {
    // 🔧 Replace this URL with your real API endpoint if available
    const response = await axios.get('https://getallbooks-szruiiaeqa-uc.a.run.app')
    // If you already have your backend route (e.g. http://localhost:3000/api/books)
    // just replace the URL above.
    books.value = response.data
  } catch (error) {
    console.error('Error fetching books:', error)
  }
}

// Call fetchBooks once the component is mounted
onMounted(fetchBooks)
</script>

<template>
  <div class="json-view">
    <h2>All Books (GetAllBookAPI)</h2>
    <!-- <pre> preserves JSON formatting -->
    <pre>{{ books }}</pre>
  </div>
</template>

<style scoped>
.json-view {
  padding: 20px;
  font-family: monospace;
  background-color: #f9f9f9;
  border-radius: 10px;
  border: 1px solid #ccc;
  margin: 20px;
  overflow-x: auto;
}
</style>
