interface Product {
  id: string
  name: string
  category: string
  description: string
  price: number
  stock: number
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

const sampleProducts: Partial<Product>[] = [
  {
    name: 'MacBook Pro 16"',
    category: 'Electronics',
    description: 'Apple M2 Pro chip, 16GB RAM, 512GB SSD',
    price: 2499.99,
    stock: 15
  },
  {
    name: 'Nike Air Max',
    category: 'Clothing',
    description: 'Premium comfort and style for everyday wear',
    price: 129.99,
    stock: 45
  },
  {
    name: 'The Psychology of Money',
    category: 'Books',
    description: 'Timeless lessons on wealth, greed, and happiness',
    price: 19.99,
    stock: 8
  },
  {
    name: 'Smart LED TV 65"',
    category: 'Electronics',
    description: '4K Ultra HD Smart LED TV with HDR',
    price: 899.99,
    stock: 12
  },
  {
    name: 'Levi\'s 501 Original',
    category: 'Clothing',
    description: 'Classic straight fit jeans',
    price: 69.99,
    stock: 60
  },
  {
    name: 'Garden Tool Set',
    category: 'Home & Garden',
    description: '12-piece gardening tools with storage bag',
    price: 49.99,
    stock: 25
  },
  {
    name: 'Basketball',
    category: 'Sports & Outdoors',
    description: 'Official size and weight basketball',
    price: 29.99,
    stock: 35
  },
  {
    name: 'LEGO Star Wars Set',
    category: 'Toys & Games',
    description: 'Millennium Falcon building set, 1000+ pieces',
    price: 159.99,
    stock: 5
  },
  {
    name: 'Wireless Earbuds',
    category: 'Electronics',
    description: 'True wireless earbuds with noise cancellation',
    price: 199.99,
    stock: 30
  },
  {
    name: 'Yoga Mat',
    category: 'Sports & Outdoors',
    description: 'Non-slip exercise yoga mat with carrying strap',
    price: 39.99,
    stock: 40
  }
]

const getProductStatus = (stock: number): 'In Stock' | 'Low Stock' | 'Out of Stock' => {
  if (stock === 0) return 'Out of Stock'
  if (stock < 10) return 'Low Stock'
  return 'In Stock'
}

const generateSalesData = (): SalesData[] => {
  const data: SalesData[] = []
  const today = new Date()
  
  // Generate 6 months of daily data
  for (let i = 180; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    // Generate random orders between 10-50
    const orders = Math.floor(10 + Math.random() * 40)
    
    // Generate revenue based on orders (average order value between $100-300)
    const revenue = orders * (100 + Math.random() * 200)
    
    data.push({
      date: date.toISOString().split('T')[0],
      orders,
      revenue
    })
  }
  
  return data
}

const generateCategoryData = (products: Product[], salesData: SalesData[]): CategoryData[] => {
  const categoryMap = new Map<string, { revenue: number; orders: number }>()
  
  // Initialize categories
  products.forEach(product => {
    if (!categoryMap.has(product.category)) {
      categoryMap.set(product.category, { revenue: 0, orders: 0 })
    }
  })
  
  // Calculate totals
  const totalRevenue = salesData.reduce((sum, data) => sum + data.revenue, 0)
  const totalOrders = salesData.reduce((sum, data) => sum + data.orders, 0)
  
  // Distribute revenue and orders across categories
  categoryMap.forEach((value, category) => {
    value.revenue = totalRevenue * (0.1 + Math.random() * 0.2) // 10-30% of total revenue
    value.orders = Math.floor(totalOrders * (0.1 + Math.random() * 0.2)) // 10-30% of total orders
  })
  
  return Array.from(categoryMap.entries()).map(([name, data]) => ({
    name,
    revenue: data.revenue,
    orders: data.orders
  }))
}

export const generateSampleData = () => {
  // Generate products with IDs and status
  const products: Product[] = sampleProducts.map((product, index) => ({
    ...product,
    id: (index + 1).toString(),
    status: getProductStatus(product.stock!)
  })) as Product[]

  const salesData = generateSalesData()
  const categoryData = generateCategoryData(products, salesData)

  return {
    products,
    salesData,
    categoryData
  }
} 