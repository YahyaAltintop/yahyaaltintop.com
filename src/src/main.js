import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirebaseConfig } from './config'

const firebaseConfig = getFirebaseConfig()
const firebaseApp = initializeApp(firebaseConfig)
const analytics = getAnalytics(firebaseApp)

createApp(App).mount('#app')
