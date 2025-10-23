// src/firebase/init.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyCbVrECPDedQvFMbO1dRgSzvtzczKHZkso',
  authDomain: 'mypersonalproject-5b07f.firebaseapp.com',
  projectId: 'mypersonalproject-5b07f',
  storageBucket: 'mypersonalproject-5b07f.firebasestorage.app',
  messagingSenderId: '585924633283',
  appId: '1:585924633283:web:bf170e2fdd0128c60af876',
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
