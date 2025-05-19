<template>
  <div class="bg-white p-4 rounded-lg shadow">
    <h3 class="text-lg font-semibold text-gray-800 mb-3">Filter by Categories</h3>
    <div class="space-y-2">
      <label class="flex items-center space-x-2" v-for="category in categories" :key="category">
        <input
          type="checkbox"
          :value="category"
          v-model="selectedCategories"
          class="form-checkbox h-4 w-4 text-indigo-600"
          @change="emitChange"
        />
        <span class="text-gray-700">{{ category }}</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '../store'

const store = useStore()
const selectedCategories = ref<string[]>([])

const categories = computed(() => {
  return Array.from(new Set(store.categoryData.map(cat => cat.name)))
})

const emitChange = () => {
  emit('update:selected', selectedCategories.value)
}

const emit = defineEmits<{
  (e: 'update:selected', categories: string[]): void
}>()
</script> 