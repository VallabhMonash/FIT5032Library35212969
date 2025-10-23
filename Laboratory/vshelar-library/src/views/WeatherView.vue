<template>
  <div class="container">
    <div class="header">
      <h1>Weather App</h1>
      <div class="search-bar">
        <input type="text" placeholder="Enter city name" v-model="city" class="search-input" />
        <button @click="searchByCity" class="search-button">Search</button>
      </div>
    </div>
  </div>

  <main>
    <div v-if="weatherData">
      <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
      <div>
        <img :src="iconUrl" alt="Weather Icon" />
        <p>{{ temperature }} °C</p>
      </div>
      <span>{{ weatherData.weather[0].description }}</span>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// ✅ Read values from environment
const apiKey = import.meta.env.VITE_WEATHER_API_KEY
const baseUrl = import.meta.env.VITE_WEATHER_API_URL

// Reactive data
const city = ref('')
const weatherData = ref(null)
const hourlyForecast = ref([])
const dailyForecast = ref([])

// Computed properties
const temperature = computed(() => {
  return weatherData.value ? Math.floor(weatherData.value.main.temp - 273) : null
})

const iconUrl = computed(() => {
  return weatherData.value
    ? `https://openweathermap.org/img/w/${weatherData.value.weather[0].icon}.png`
    : null
})

// Generic fetch method
async function fetchWeatherData(url) {
  try {
    const response = await axios.get(url)
    weatherData.value = response.data
  } catch (error) {
    console.error('Error fetching weather data:', error)
  }
}

// ✅ Use env vars when calling the API
async function searchByCity() {
  if (!city.value) return
  const url = `${baseUrl}?q=${encodeURIComponent(city.value)}&appid=${apiKey}`
  await fetchWeatherData(url)
}

async function fetchCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords
      const url = `${baseUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
      await fetchWeatherData(url)
    })
  } else {
    console.error('Geolocation not supported by this browser.')
  }
}

// Load current location weather on page load
onMounted(() => {
  fetchCurrentLocationWeather()
})
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 20px;
}
.search-bar {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.search-input {
  padding: 8px;
  width: 250px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.search-button {
  padding: 8px 12px;
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.search-button:hover {
  background-color: #0056b3;
}
main {
  text-align: center;
  margin-top: 20px;
}
</style>
