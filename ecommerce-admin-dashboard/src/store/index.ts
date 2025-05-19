import { defineStore } from 'pinia'
import { generateSampleData } from '../utils/sampleData'

interface Product {
  id: string
  name: string
  category: string
  description: string
  price: number
  stock: number
  image?: string
  status: 'In Stock' | 'Low Stock' | 'Out of Stock'
  lowStockThreshold?: number
  forecastedStock?: number
  forecastedDays?: number
}

interface SalesData {
  date: string
  revenue: number
  orders: number
}

interface CategoryData {
  name: string
  revenue: number
  orders: number
}

export const useStore = defineStore('main', {
  state: () => ({
    products: [] as Product[],
    salesData: [] as SalesData[],
    categoryData: [] as CategoryData[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    totalOrders: (state) => state.salesData.reduce((sum, data) => sum + data.orders, 0),
    totalRevenue: (state) => state.salesData.reduce((sum, data) => sum + data.revenue, 0),
    averageOrderValue: (state) => {
      const totalOrders = state.salesData.reduce((sum, data) => sum + data.orders, 0)
      const totalRevenue = state.salesData.reduce((sum, data) => sum + data.revenue, 0)
      return totalOrders ? totalRevenue / totalOrders : 0
    },
    lowStockProducts: (state) => {
      return state.products.filter(product => product.stock <= (product.lowStockThreshold || 10))
    },
    outOfStockProducts: (state) => {
      return state.products.filter(product => product.stock === 0)
    }
  },

  actions: {
    initializeStore() {
      const { products, salesData, categoryData } = generateSampleData()
      this.products = products
      this.salesData = salesData
      this.categoryData = categoryData
    },

    async fetchProducts() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        this.products = data
      } catch (err) {
        this.error = 'Failed to fetch products'
        console.error('Error fetching products:', err)
      } finally {
        this.loading = false
      }
    },

    async addProduct(productData: Omit<Product, 'id' | 'status'>) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        })

        if (!response.ok) {
          throw new Error('Failed to add product')
        }

        const newProduct = await response.json()
        this.products.push(newProduct)
        return newProduct
      } catch (err) {
        this.error = 'Failed to add product'
        console.error('Error adding product:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateProductStock(productId: string, newStock: number) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`http://localhost:3001/api/products/${productId}/stock`, {
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
        const index = this.products.findIndex(p => p.id === productId)
        if (index !== -1) {
          this.products[index] = updatedProduct
        }
      } catch (err) {
        this.error = 'Failed to update product stock'
        console.error('Error updating product stock:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    getProductStatus(stock: number): 'In Stock' | 'Low Stock' | 'Out of Stock' {
      if (stock === 0) return 'Out of Stock'
      if (stock < 10) return 'Low Stock'
      return 'In Stock'
    },

    getRevenueData(period: string) {
      // Filter and aggregate data based on the selected period
      return this.salesData.map(data => data.revenue)
    },

    getRevenueLabels(period: string) {
      // Return appropriate date labels based on the selected period
      return this.salesData.map(data => data.date)
    },

    // Simulated real-time updates
    startRealtimeUpdates() {
      setInterval(() => {
        // Simulate new orders and revenue
        const lastSalesData = this.salesData[this.salesData.length - 1]
        const newRevenue = lastSalesData.revenue * (0.9 + Math.random() * 0.2)
        const newOrders = Math.floor(lastSalesData.orders * (0.9 + Math.random() * 0.2))
        
        this.salesData.push({
          date: new Date().toISOString().split('T')[0],
          revenue: newRevenue,
          orders: newOrders
        })

        // Keep only last 30 days of data
        if (this.salesData.length > 30) {
          this.salesData.shift()
        }
      }, 60000) // Update every minute
    }
  }
}) 