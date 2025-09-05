// import './style.css'

// import bootstrap css
import 'bootstrap/dist/css/bootstrap.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'

const app = createApp(App)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
})
app.use(router)

app.mount('#app')

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAY3k2_DLlnvLGiqGw7vQzm7QUQN0k44bM',
  authDomain: 'week7-vallabh.firebaseapp.com',
  projectId: 'week7-vallabh',
  storageBucket: 'week7-vallabh.firebasestorage.app',
  messagingSenderId: '1050106911205',
  appId: '1:1050106911205:web:c6ace3ca8bc5af82cfb70c',
}

// Initialize Firebase
initializeApp(firebaseConfig)
