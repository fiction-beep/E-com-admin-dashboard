import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { generateSampleData } from '../src/utils/sampleData'

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

const app = express()
const port = process.env.PORT || 3002

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

// Add server config endpoint
app.get('/api/config', (_req, res) => {
  res.json({
    port,
    baseUrl: `http://localhost:${port}`
  })
})

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
app.post('/api/products', upload.single('image'), (req, res) => {
  try {
    console.log('Received product creation request:', req.body);
    console.log('File:', (req as any).file);

    const { name, category, price, stock, description } = req.body;
    
    if (!name || !category || !price || !stock) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { name, category, price, stock, description }
      });
    }

    const imageUrl = (req as any).file ? `/uploads/${(req as any).file.filename}` : undefined;

    const newProduct = {
      id: (products.length + 1).toString(),
      name,
      category,
      price: Number(price),
      stock: Number(stock),
      description,
      image: imageUrl,
      status: Number(stock) === 0 ? 'Out of Stock' as const : Number(stock) < 10 ? 'Low Stock' as const : 'In Stock' as const
    };

    products.push(newProduct);
    console.log('Successfully added product:', newProduct);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ 
      error: 'Failed to add product',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

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