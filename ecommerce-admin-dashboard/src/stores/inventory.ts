import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  price: number
  stock: number
  lowStockThreshold: number
  image: string
  forecastedStock: number
  forecastedDays: number
}

export const useInventoryStore = defineStore('inventory', () => {
  // State
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const lowStockProducts = computed(() => {
    return products.value.filter(product => product.stock <= product.lowStockThreshold)
  })

  const outOfStockProducts = computed(() => {
    return products.value.filter(product => product.stock === 0)
  })

  // Actions
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/products')
      const data = await response.json()
      products.value = data
    } catch (err) {
      error.value = 'Failed to fetch products'
      console.error('Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  const updateProductStock = async (productId: string, newStock: number) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stock: newStock }),
      })

      if (!response.ok) {
        throw new Error('Failed to update stock')
      }

      const updatedProduct = await response.json()
      const index = products.value.findIndex(p => p.id === productId)
      if (index !== -1) {
        products.value[index] = updatedProduct
      }
    } catch (err) {
      error.value = 'Failed to update product stock'
      console.error('Error updating product stock:', err)
    } finally {
      loading.value = false
    }
  }

  const calculateForecast = async (productId: string) => {
    loading.value = true
    error.value = null
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/products/${productId}/forecast`)
      const forecast = await response.json()
      
      const index = products.value.findIndex(p => p.id === productId)
      if (index !== -1) {
        products.value[index] = {
          ...products.value[index],
          forecastedStock: forecast.forecastedStock,
          forecastedDays: forecast.forecastedDays,
        }
      }
    } catch (err) {
      error.value = 'Failed to calculate forecast'
      console.error('Error calculating forecast:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    products,
    loading,
    error,
    
    // Getters
    lowStockProducts,
    outOfStockProducts,
    
    // Actions
    fetchProducts,
    updateProductStock,
    calculateForecast,
  }
}) 