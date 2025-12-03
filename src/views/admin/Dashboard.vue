<template>
  <div>
    <h2 class="text-2xl font-bold text-brand-dark mb-6">Welcome back, Admin</h2>
    
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-xl border border-gray-200">
        <div class="text-sm text-gray-500 mb-2">Total Suppliers</div>
        <div class="text-3xl font-bold text-brand-dark">0</div>
      </div>
      <div class="bg-white p-6 rounded-xl border border-gray-200">
        <div class="text-sm text-gray-500 mb-2">Pending Approval</div>
        <div class="text-3xl font-bold text-brand-dot">0</div>
      </div>
      <div class="bg-white p-6 rounded-xl border border-gray-200">
        <div class="text-sm text-gray-500 mb-2">Active Listings</div>
        <div class="text-3xl font-bold text-brand-dark">0</div>
      </div>
      <div class="bg-white p-6 rounded-xl border border-gray-200">
        <div class="text-sm text-gray-500 mb-2">Total Bookings</div>
        <div class="text-3xl font-bold text-brand-dark">0</div>
      </div>
    </div>

    <!-- Placeholder -->
    <div class="bg-white p-12 rounded-xl border border-gray-200 text-center">
      <p class="text-gray-500">Dashboard content coming soon...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Static UI - will populate with real data later
</script>