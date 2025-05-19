<template>
  <div class="max-w-3xl mx-auto">
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">Add New Product</h2>
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Product Name</label>
          <input type="text" id="name" v-model="productName" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>
        
        <div>
          <label for="price" class="block text-sm font-medium text-gray-700">Price</label>
          <div class="mt-1 relative rounded-md shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span class="text-gray-500 sm:text-sm">$</span>
            </div>
            <input type="number" id="price" v-model="price" class="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
          </div>
        </div>

        <div>
          <label for="stock" class="block text-sm font-medium text-gray-700">Initial Stock</label>
          <input type="number" id="stock" v-model="stock" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea id="description" v-model="description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
        </div>

        <div>
          <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Add Product
          </button>
        </div>
      </form>
    </div>

    <!-- Success Toast -->
    <div
      v-if="showSuccessToast"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
    >
      Product added successfully!
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '../store'

const router = useRouter()
const store = useStore()

const productName = ref('')
const price = ref(0)
const stock = ref(0)
const description = ref('')

const isSubmitting = ref(false)
const showSuccessToast = ref(false)

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true

  try {
    // Add product to store
    await store.addProduct({
      name: productName.value,
      price: price.value,
      stock: stock.value,
      description: description.value
    })

    // Show success message
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)

    // Reset form
    productName.value = ''
    price.value = 0
    stock.value = 0
    description.value = ''

    // Navigate to inventory page
    router.push('/inventory')
  } catch (error) {
    console.error('Error adding product:', error)
  } finally {
    isSubmitting.value = false
  }
}

const validateForm = () => {
  let isValid = true
  
  if (!productName.value.trim()) {
    console.error('Product name is required')
    isValid = false
  }

  if (!price.value || price.value <= 0) {
    console.error('Please enter a valid price')
    isValid = false
  }

  if (!stock.value || stock.value < 0) {
    console.error('Please enter a valid stock amount')
    isValid = false
  }

  if (!description.value.trim()) {
    console.error('Description is required')
    isValid = false
  }

  return isValid
}
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style> 