<template>
  <div class="space-y-6">
    <div class="bg-white shadow rounded-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold text-gray-800">Inventory Management</h2>
        <div class="flex space-x-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            @click="exportToCSV"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Export
          </button>
        </div>
      </div>

      <div class="h-[600px] w-full ag-theme-alpine">
        <ag-grid-vue
          :columnDefs="columnDefs"
          :rowData="products"
          :defaultColDef="defaultColDef"
          :pagination="true"
          :paginationPageSize="10"
          @grid-ready="onGridReady"
        />
      </div>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Low Stock Alerts</h2>
      <div class="space-y-4">
        <div
          v-for="product in lowStockProducts"
          :key="product.id"
          class="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200"
        >
          <div>
            <h3 class="font-medium text-red-800">{{ product.name }}</h3>
            <p class="text-sm text-red-600">Current Stock: {{ product.stock }}</p>
          </div>
          <button
            @click="openRestockModal(product)"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Restock
          </button>
        </div>
      </div>
    </div>

    <!-- Restock Modal -->
    <div v-if="showRestockModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Restock Product</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Product</label>
            <p class="mt-1 text-gray-900">{{ selectedProduct?.name }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Current Stock</label>
            <p class="mt-1 text-gray-900">{{ selectedProduct?.stock }}</p>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Add Stock</label>
            <input
              v-model="restockAmount"
              type="number"
              min="1"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <div class="flex justify-end space-x-2">
            <button
              @click="closeRestockModal"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              @click="confirmRestock"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import { GridApi, ColDef } from 'ag-grid-community'
import { useStore } from '../store'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

const store = useStore()
const gridApi = ref<GridApi>()
const searchQuery = ref('')
const showRestockModal = ref(false)
const selectedProduct = ref(null)
const restockAmount = ref(1)

// AG Grid configuration
const columnDefs = ref<ColDef[]>([
  { field: 'name', headerName: 'Product Name', filter: true },
  { field: 'category', headerName: 'Category', filter: true },
  { 
    field: 'price',
    headerName: 'Price',
    filter: 'agNumberColumnFilter',
    valueFormatter: (params) => `$${params.value.toFixed(2)}`
  },
  { 
    field: 'stock',
    headerName: 'Stock Level',
    filter: 'agNumberColumnFilter',
    cellStyle: (params) => {
      if (params.value < 10) {
        return { color: '#DC2626', fontWeight: 'bold' }
      }
      return null
    }
  },
  {
    field: 'status',
    headerName: 'Status',
    cellRenderer: (params) => {
      const status = params.value
      const colors = {
        'In Stock': 'bg-green-100 text-green-800',
        'Low Stock': 'bg-yellow-100 text-yellow-800',
        'Out of Stock': 'bg-red-100 text-red-800'
      }
      return `<span class="px-2 py-1 rounded-full text-xs ${colors[status]}">${status}</span>`
    }
  }
])

const defaultColDef = {
  sortable: true,
  filter: true,
  resizable: true
}

// Computed properties
const products = computed(() => {
  return store.products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const lowStockProducts = computed(() =>
  store.products.filter(product => product.stock < 10)
)

// Grid events
const onGridReady = (params) => {
  gridApi.value = params.api
  params.api.sizeColumnsToFit()
}

// Modal handlers
const openRestockModal = (product) => {
  selectedProduct.value = product
  showRestockModal.value = true
}

const closeRestockModal = () => {
  showRestockModal.value = false
  selectedProduct.value = null
  restockAmount.value = 1
}

const confirmRestock = () => {
  if (selectedProduct.value && restockAmount.value > 0) {
    store.restockProduct(selectedProduct.value.id, restockAmount.value)
    closeRestockModal()
  }
}

// Export functionality
const exportToCSV = () => {
  gridApi.value?.exportDataAsCsv({
    fileName: `inventory-${new Date().toISOString().split('T')[0]}.csv`
  })
}
</script>

<style scoped>
.ag-theme-alpine {
  --ag-header-height: 50px;
  --ag-header-foreground-color: #1F2937;
  --ag-header-background-color: #F9FAFB;
  --ag-row-hover-color: #F3F4F6;
}
</style> 