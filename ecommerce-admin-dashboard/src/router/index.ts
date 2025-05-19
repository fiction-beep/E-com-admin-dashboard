import { createRouter, createWebHistory } from 'vue-router'
import RevenueAnalysis from '../pages/RevenueAnalysis.vue'
import InventoryPage from '../pages/InventoryPage.vue'
import ProductRegistration from '../pages/ProductRegistration.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'revenue',
      component: RevenueAnalysis
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: InventoryPage
    },
    {
      path: '/products/new',
      name: 'product-registration',
      component: ProductRegistration
    }
  ]
})

export default router 