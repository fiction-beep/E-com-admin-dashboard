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
          <label for="category" class="block text-sm font-medium text-gray-700">Category</label>
          <select id="category" v-model="category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
            <option value="">Select a category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Books">Books</option>
            <option value="Home & Garden">Home & Garden</option>
            <option value="Sports & Outdoors">Sports & Outdoors</option>
            <option value="Toys & Games">Toys & Games</option>
          </select>
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
          <label class="block text-sm font-medium text-gray-700">Product Image</label>
          <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div class="space-y-1 text-center">
              <div v-if="!imagePreview" class="flex text-sm text-gray-600">
                <label for="image-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  <span>Upload a file</span>
                  <input id="image-upload" name="image-upload" type="file" class="sr-only" accept="image/*" @change="handleImageUpload">
                </label>
                <p class="pl-1">or drag and drop</p>
              </div>
              <div v-else class="relative">
                <img :src="imagePreview" class="mx-auto h-32 w-32 object-cover rounded-lg" />
                <button @click="removeImage" class="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        <div>
          <button type="submit" :disabled="isSubmitting" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isSubmitting ? 'Adding Product...' : 'Add Product' }}
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

    <!-- Error Toast -->
    <div
      v-if="showErrorToast"
      class="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
    >
      {{ errorMessage }}
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
const category = ref('')
const price = ref(0)
const stock = ref(0)
const description = ref('')
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)

const isSubmitting = ref(false)
const showSuccessToast = ref(false)
const showErrorToast = ref(false)
const errorMessage = ref('')

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    
    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      showErrorToast.value = true
      errorMessage.value = 'Image size should be less than 10MB'
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showErrorToast.value = true
      errorMessage.value = 'Please upload an image file'
      return
    }

    imageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  imageFile.value = null
  imagePreview.value = null
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  showErrorToast.value = false

  try {
    // Create FormData for image upload
    const formData = new FormData()
    formData.append('name', productName.value)
    formData.append('category', category.value)
    formData.append('price', price.value.toString())
    formData.append('stock', stock.value.toString())
    formData.append('description', description.value)
    if (imageFile.value) {
      formData.append('image', imageFile.value)
    }

    // Add product to store
    await store.addProduct(formData)

    // Show success message
    showSuccessToast.value = true
    setTimeout(() => {
      showSuccessToast.value = false
    }, 3000)

    // Reset form
    productName.value = ''
    category.value = ''
    price.value = 0
    stock.value = 0
    description.value = ''
    imageFile.value = null
    imagePreview.value = null

    // Navigate to inventory page
    router.push('/inventory')
  } catch (error) {
    showErrorToast.value = true
    errorMessage.value = 'Failed to add product. Please try again.'
    setTimeout(() => {
      showErrorToast.value = false
    }, 3000)
  } finally {
    isSubmitting.value = false
  }
}

const validateForm = () => {
  let isValid = true
  
  if (!productName.value.trim()) {
    showErrorToast.value = true
    errorMessage.value = 'Product name is required'
    isValid = false
  }
  
  if (!category.value) {
    showErrorToast.value = true
    errorMessage.value = 'Category is required'
    isValid = false
  }
  
  if (price.value <= 0) {
    showErrorToast.value = true
    errorMessage.value = 'Price must be greater than 0'
    isValid = false
  }
  
  if (stock.value < 0) {
    showErrorToast.value = true
    errorMessage.value = 'Stock cannot be negative'
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