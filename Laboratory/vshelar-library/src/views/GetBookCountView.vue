<template>
  <div id="app">
    <h1>Book Counter</h1>
    <button @click="getBookCount">Get Book Count</button>
    <p v-if="count !== null && !error">Total number of books: {{ count }}</p>
    <p v-else-if="error">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'GetBookCountView',
  data() {
    return {
      count: null,
      error: null,
    }
  },
  methods: {
    async getBookCount() {
      try {
        this.error = null
        // Replace the URL below once your Cloud Function endpoint is ready (point 9.4)
        const response = await axios.get('https://countbooks-szruiiaeqa-uc.a.run.app')
        this.count = response.data.count // assuming { count: <number> } from backend
      } catch (err) {
        this.error = 'Error fetching book count.'
        this.count = null
      }
    },
  },
}
</script>

<style scoped>
#app {
  text-align: center;
  margin-top: 40px;
}
button {
  margin-top: 10px;
  padding: 8px 16px;
  cursor: pointer;
}
</style>
