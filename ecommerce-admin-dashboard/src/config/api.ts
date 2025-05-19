import { ref } from 'vue'

export const apiConfig = {
  baseUrl: ref('http://localhost:3002'), // Default fallback
  isConfigured: ref(false)
}

export const configureApi = async () => {
  try {
    const response = await fetch('http://localhost:3002/api/config')
    const config = await response.json()
    apiConfig.baseUrl.value = config.baseUrl
    apiConfig.isConfigured.value = true
  } catch (error) {
    console.warn('Failed to fetch API configuration, using default:', error)
  }
}

export const getApiUrl = (endpoint: string) => {
  return `${apiConfig.baseUrl.value}${endpoint}`
} 