<template>
  <div class="p-6">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Inventory Management</h1>
      <p class="text-gray-600">Manage and monitor your product inventory</p>
    </div>

    <!-- Search and Filter Section -->
    <div class="mb-6 flex flex-wrap gap-4">
      <div class="flex-1 min-w-[300px]">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div class="flex gap-4">
        <select
          v-model="categoryFilter"
          class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        <select
          v-model="stockFilter"
          class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Stock Levels</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
          <option value="in">In Stock</option>
        </select>
      </div>
    </div>

    <!-- Inventory Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="header in tableHeaders"
              :key="header.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              @click="sortBy(header.key)"
            >
              <div class="flex items-center gap-2">
                {{ header.label }}
                <span v-if="sortKey === header.key" class="text-blue-500">
                  {{ sortOrder === 'asc' ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="product in filteredProducts" :key="product.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <img
                  :src="product.image"
                  :alt="product.name"
                  class="h-10 w-10 rounded-full object-cover"
                />
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-sm text-gray-500">{{ product.sku }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ product.category }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">${{ product.price.toFixed(2) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div
                class="text-sm"
                :class="{
                  'text-red-600': product.stock <= product.lowStockThreshold,
                  'text-green-600': product.stock > product.lowStockThreshold
                }"
              >
                {{ product.stock }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ product.forecastedStock }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                @click="openUpdateModal(product)"
                class="text-blue-600 hover:text-blue-900 mr-4"
              >
                Update
              </button>
              <button
                @click="openForecastModal(product)"
                class="text-green-600 hover:text-green-900"
              >
                Forecast
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Update Stock Modal -->
    <div v-if="showUpdateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Update Stock</h2>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Current Stock</label>
          <input
            v-model="selectedProduct.stock"
            type="number"
            class="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div class="flex justify-end gap-4">
          <button
            @click="showUpdateModal = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            @click="updateStock"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Forecast Modal -->
    <div v-if="showForecastModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Stock Forecast</h2>
        <div class="mb-4">
          <p class="text-sm text-gray-600">
            Based on current sales trends, this product will need restocking in approximately
            {{ selectedProduct.forecastedDays }} days.
          </p>
        </div>
        <div class="flex justify-end">
          <button
            @click="showForecastModal = false"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/store'

const store = useStore()

// State
const searchQuery = ref('')
const categoryFilter = ref('')
const stockFilter = ref('')
const sortKey = ref('name')
const sortOrder = ref('asc')
const showUpdateModal = ref(false)
const showForecastModal = ref(false)
const selectedProduct = ref(null)

// Table headers
const tableHeaders = [
  { key: 'name', label: 'Product' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'stock', label: 'Current Stock' },
  { key: 'forecastedStock', label: 'Forecasted Stock' }
]

// Computed properties
const categories = computed(() => {
  const uniqueCategories = new Set(store.products.map(p => p.category))
  return Array.from(uniqueCategories)
})

const filteredProducts = computed(() => {
  let filtered = store.products

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      product =>
        product.name.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (categoryFilter.value) {
    filtered = filtered.filter(product => product.category === categoryFilter.value)
  }

  // Apply stock filter
  if (stockFilter.value) {
    filtered = filtered.filter(product => {
      switch (stockFilter.value) {
        case 'low':
          return product.stock <= (product.lowStockThreshold || 10)
        case 'out':
          return product.stock === 0
        case 'in':
          return product.stock > 0
        default:
          return true
      }
    })
  }

  // Apply sorting
  filtered.sort((a, b) => {
    const aValue = a[sortKey.value]
    const bValue = b[sortKey.value]
    const modifier = sortOrder.value === 'asc' ? 1 : -1

    if (typeof aValue === 'string') {
      return aValue.localeCompare(bValue) * modifier
    }
    return (aValue - bValue) * modifier
  })

  return filtered
})

// Methods
const sortBy = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const openUpdateModal = (product) => {
  selectedProduct.value = { ...product }
  showUpdateModal.value = true
}

const openForecastModal = (product) => {
  selectedProduct.value = product
  showForecastModal.value = true
}

const updateStock = async () => {
  if (selectedProduct.value) {
    try {
      await store.updateProductStock(
        selectedProduct.value.id,
        selectedProduct.value.stock
      )
      showUpdateModal.value = false
    } catch (error) {
      console.error('Failed to update stock:', error)
    }
  }
}

onMounted(() => {
  store.fetchProducts()
})
</script> 