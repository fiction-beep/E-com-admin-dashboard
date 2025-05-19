<script setup lang="ts">
// Component logic will be added here
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-800">E-Commerce Admin</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <router-link
                to="/"
                class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2"
                active-class="border-indigo-500"
                >Revenue Analysis</router-link
              >
              <router-link
                to="/inventory"
                class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2"
                active-class="border-indigo-500"
                >Inventory Management</router-link
              >
              <router-link
                to="/products/new"
                class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2"
                active-class="border-indigo-500"
                >Add Product</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
