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
  }),

  getters: {
    totalOrders: (state) => state.salesData.reduce((sum, data) => sum + data.orders, 0),
    totalRevenue: (state) => state.salesData.reduce((sum, data) => sum + data.revenue, 0),
    averageOrderValue: (state) => {
      const totalOrders = state.salesData.reduce((sum, data) => sum + data.orders, 0)
      const totalRevenue = state.salesData.reduce((sum, data) => sum + data.revenue, 0)
      return totalOrders ? totalRevenue / totalOrders : 0
    },
    lowStockProducts: (state) => state.products.filter(product => product.stock < 10),
  },

  actions: {
    initializeStore() {
      const { products, salesData, categoryData } = generateSampleData()
      this.products = products
      this.salesData = salesData
      this.categoryData = categoryData
    },

    addProduct(productData: Omit<Product, 'id' | 'status'>) {
      const newProduct = {
        id: Date.now().toString(),
        ...productData,
        status: this.getProductStatus(productData.stock),
      }
      this.products.push(newProduct)
    },

    restockProduct(productId: string, amount: number) {
      const product = this.products.find(p => p.id === productId)
      if (product) {
        product.stock += amount
        product.status = this.getProductStatus(product.stock)
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