<template>
  {{ jsondata }}
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      jsondata: null,
      error: null,
    }
  },
  mounted() {
    this.getBookCountAPI()
  },
  methods: {
    async getBookCountAPI() {
      try {
        this.error = null
        // Replace the URL below once your Cloud Function endpoint is ready (point 9.4)
        const response = await axios.get('https://countbooks-szruiiaeqa-uc.a.run.app')
        this.jsondata = response.data // assuming { count: <number> } from backend
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
