import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './index.css'
import { configureApi } from './config/api'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Initialize the store
import { useStore } from './store'
const store = useStore()

// Initialize API configuration and store
const init = async () => {
  await configureApi()
  await store.initializeStore()
  app.use(router)
  app.mount('#app')
}

init()
