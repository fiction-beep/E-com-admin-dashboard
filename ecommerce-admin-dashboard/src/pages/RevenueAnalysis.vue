<template>
  <div class="space-y-6">
    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-bold mb-4">Revenue Analysis</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-blue-50 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-blue-700">Total Revenue</h3>
          <p class="text-3xl font-bold">${{ formatCurrency(filteredTotalRevenue) }}</p>
          <p class="text-sm text-blue-600">{{ revenueGrowth }}% from last month</p>
        </div>
        <div class="bg-green-50 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-green-700">Orders</h3>
          <p class="text-3xl font-bold">{{ totalOrders }}</p>
          <p class="text-sm text-green-600">{{ orderGrowth }}% from last month</p>
        </div>
        <div class="bg-purple-50 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-purple-700">Average Order Value</h3>
          <p class="text-3xl font-bold">${{ formatCurrency(averageOrderValue) }}</p>
          <p class="text-sm text-purple-600">{{ aovGrowth }}% from last month</p>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="md:col-span-1">
        <CategoryFilter v-model:selected="selectedCategories" />
      </div>

      <div class="md:col-span-3 bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-semibold text-gray-800">Revenue Trends</h2>
          <div class="flex space-x-2">
            <button
              v-for="period in ['Daily', 'Weekly', 'Monthly', 'Annually']"
              :key="period"
              @click="changePeriod(period.toLowerCase())"
              :class="[
                'px-3 py-1 rounded-md text-sm',
                selectedPeriod === period.toLowerCase()
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              ]"
            >
              {{ period }}
            </button>
          </div>
        </div>
        <div class="h-96">
          <canvas ref="revenueChart"></canvas>
        </div>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Category Performance</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="h-80">
          <canvas ref="categoryChart"></canvas>
        </div>
        <div class="space-y-4">
          <div v-for="category in filteredCategoryData" :key="category.name" 
               class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span class="font-medium text-gray-700">{{ category.name }}</span>
            <span class="text-gray-600">${{ formatCurrency(category.revenue) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useStore } from '../store'
import CategoryFilter from '../components/CategoryFilter.vue'

Chart.register(...registerables)

const store = useStore()
const revenueChart = ref<HTMLCanvasElement | null>(null)
const categoryChart = ref<HTMLCanvasElement | null>(null)
const selectedPeriod = ref('monthly')
const selectedCategories = ref<string[]>([])

let revenueChartInstance: Chart | null = null
let categoryChartInstance: Chart | null = null

// Computed properties for metrics
const filteredCategoryData = computed(() => {
  if (selectedCategories.value.length === 0) {
    return store.categoryData
  }
  return store.categoryData.filter(cat => selectedCategories.value.includes(cat.name))
})

const filteredTotalRevenue = computed(() => {
  return filteredCategoryData.value.reduce((sum, cat) => sum + cat.revenue, 0)
})

const totalOrders = computed(() => store.totalOrders)
const averageOrderValue = computed(() => {
  return filteredTotalRevenue.value / totalOrders.value || 0
})

// Growth calculations
const revenueGrowth = computed(() => {
  const currentRevenue = filteredTotalRevenue.value
  const previousRevenue = currentRevenue * 0.9 // Simulated previous month data
  return Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100)
})

const orderGrowth = computed(() => {
  const currentOrders = totalOrders.value
  const previousOrders = currentOrders * 0.92 // Simulated previous month data
  return Math.round(((currentOrders - previousOrders) / previousOrders) * 100)
})

const aovGrowth = computed(() => {
  const currentAOV = averageOrderValue.value
  const previousAOV = currentAOV * 0.95 // Simulated previous month data
  return Math.round(((currentAOV - previousAOV) / previousAOV) * 100)
})

// Chart initialization and updates
const initializeCharts = () => {
  if (revenueChart.value && categoryChart.value) {
    // Revenue trend chart
    revenueChartInstance = new Chart(revenueChart.value, {
      type: 'line',
      data: {
        labels: store.getRevenueLabels(selectedPeriod.value),
        datasets: generateRevenueDatasets()
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => `$${formatCurrency(context.parsed.y)}`
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `$${formatCurrency(value)}`
            }
          }
        }
      }
    })

    // Category performance chart
    categoryChartInstance = new Chart(categoryChart.value, {
      type: 'doughnut',
      data: {
        labels: filteredCategoryData.value.map(c => c.name),
        datasets: [{
          data: filteredCategoryData.value.map(c => c.revenue),
          backgroundColor: [
            '#4F46E5',
            '#10B981',
            '#F59E0B',
            '#EF4444',
            '#8B5CF6'
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `$${formatCurrency(context.raw as number)}`
            }
          }
        }
      }
    })
  }
}

const generateRevenueDatasets = () => {
  const datasets = []
  const baseData = store.getRevenueData(selectedPeriod.value)
  
  if (selectedCategories.value.length === 0) {
    datasets.push({
      label: 'Total Revenue',
      data: baseData,
      borderColor: '#4F46E5',
      tension: 0.4
    })
  } else {
    selectedCategories.value.forEach((category, index) => {
      const categoryData = baseData.map(value => 
        value * (store.categoryData.find(c => c.name === category)?.revenue || 0) / 
        store.categoryData.reduce((sum, c) => sum + c.revenue, 0)
      )
      
      datasets.push({
        label: category,
        data: categoryData,
        borderColor: getColorForIndex(index),
        tension: 0.4
      })
    })
  }
  
  return datasets
}

const getColorForIndex = (index: number) => {
  const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']
  return colors[index % colors.length]
}

const updateCharts = () => {
  if (revenueChartInstance) {
    revenueChartInstance.data.labels = store.getRevenueLabels(selectedPeriod.value)
    revenueChartInstance.data.datasets = generateRevenueDatasets()
    revenueChartInstance.update()
  }
  
  if (categoryChartInstance) {
    categoryChartInstance.data.labels = filteredCategoryData.value.map(c => c.name)
    categoryChartInstance.data.datasets[0].data = filteredCategoryData.value.map(c => c.revenue)
    categoryChartInstance.update()
  }
}

// Utility functions
const formatCurrency = (value: number) => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// Period change handler
const changePeriod = (period: string) => {
  selectedPeriod.value = period
  updateCharts()
}

// Watch for changes in selected categories
watch(selectedCategories, () => {
  updateCharts()
})

// Initialize charts on component mount
onMounted(() => {
  initializeCharts()
  
  // Start real-time updates
  store.startRealtimeUpdates()
})
</script> 