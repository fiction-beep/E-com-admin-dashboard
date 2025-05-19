import express from 'express'
import cors from 'cors'
import { generateSampleData } from '../src/utils/sampleData'

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

// Initialize data
const data = generateSampleData()
let { products, salesData, categoryData } = data

// GET /api/products - Get all products
app.get('/api/products', (_req, res) => {
  res.json(products)
})

// GET /api/sales - Get sales data
app.get('/api/sales', (_req, res) => {
  res.json(salesData)
})

// GET /api/categories - Get category data
app.get('/api/categories', (_req, res) => {
  res.json(categoryData)
})

// POST /api/products - Add new product
app.post('/api/products', (req, res) => {
  const newProduct = {
    id: (products.length + 1).toString(),
    ...req.body,
    status: req.body.stock === 0 ? 'Out of Stock' : req.body.stock < 10 ? 'Low Stock' : 'In Stock'
  }
  products.push(newProduct)
  res.status(201).json(newProduct)
})

// PUT /api/products/:id/stock - Update product stock
app.put('/api/products/:id/stock', (req, res) => {
  const { id } = req.params
  const { stock } = req.body
  
  const product = products.find(p => p.id === id)
  if (!product) {
    return res.status(404).json({ error: 'Product not found' })
  }

  product.stock = stock
  product.status = stock === 0 ? 'Out of Stock' : stock < 10 ? 'Low Stock' : 'In Stock'
  
  res.json(product)
})

// Simulated real-time updates
setInterval(() => {
  const lastData = salesData[salesData.length - 1]
  const newRevenue = lastData.revenue * (0.9 + Math.random() * 0.2)
  const newOrders = Math.floor(lastData.orders * (0.9 + Math.random() * 0.2))
  
  const newData = {
    date: new Date().toISOString().split('T')[0],
    revenue: newRevenue,
    orders: newOrders
  }
  
  salesData.push(newData)
  if (salesData.length > 30) salesData.shift()
}, 60000)

app.listen(port, () => {
  console.log(`Mock API server running at http://localhost:${port}`)
}) 