<template>
  <div class="flex h-screen bg-[#f8fffe]">
    
    <!-- Sidebar -->
    <aside class="w-[240px] bg-white flex flex-col shrink-0">
      <!-- Logo -->
      <div class="h-[72px] flex items-center px-5 border-b border-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 523.33 107.67" class="h-6">
          <g><path fill="#009986" d="M0,37.94V12.18A10.07,10.07,0,0,1,10.07,2.11h.14A10.07,10.07,0,0,1,20.28,12.18V39.06c0,9.72,5.83,14.86,13.75,14.86,9.17,0,14.45-6.11,14.45-14.86V12.18A10.07,10.07,0,0,1,58.55,2.11h0A10.07,10.07,0,0,1,68.62,12.18V39.06c0,8.75,5.28,14.86,14.58,14.86C91.12,53.92,97,48.78,97,39.06V12.18A10.07,10.07,0,0,1,107,2.11h0a10.07,10.07,0,0,1,10.07,10.07V37.94c0,21.81-9.72,35-31.25,35C68.9,73,59.17,62.67,59.31,49.75H57.92c0,12.92-9.58,23.2-26.53,23.2C9.72,73,0,59.75,0,37.94Z"/><path fill="#009986" d="M162.65.72c21.95,0,36.53,14.44,36.53,36.11l.1,24.57a10.12,10.12,0,0,1-10.12,10.16h0A10.12,10.12,0,0,1,179,61.44V57h-1.25v1.39c0,7.23-7.64,14.59-21.11,14.59-18.34,0-30.56-13.62-30.56-34.73C126.12,14.19,140.7.72,162.65.72Zm-.14,53.34c11,0,16.53-7.09,16.53-17.23,0-10.41-6.39-17.22-16.39-17.22-9.72,0-16.39,6.94-16.39,17.22S152.65,54.06,162.51,54.06Z"/><path fill="#009986" d="M258.91,57.11h-1.25v1.67c0,9.44-9,14.17-19.87,14.17-22.08,0-29.44-12.78-29.44-34.31V12.14a10,10,0,0,1,10-10h.22a10,10,0,0,1,10,10V39.75c0,9.17,5.14,14.17,14.58,14.17,9.86,0,15.7-6.39,15.7-15.56V12.14a10,10,0,0,1,10-10h.22a10,10,0,0,1,10,10v64c0,19.73-13.48,31.53-36.12,31.53-14.09,0-24.78-4.42-29.93-13.73A10,10,0,0,1,222,79.2h0A10.18,10.18,0,0,1,231.07,85c2,4,6.48,5.92,13,5.92,9.73,0,14.87-4.59,14.87-13.2Z"/><path fill="#009986" d="M420.86,57.11h-1.25v1.67c0,9.44-9,14.17-19.86,14.17-22.09,0-29.45-12.78-29.45-34.31V12.14a10,10,0,0,1,10-10h.22a10,10,0,0,1,10,10V39.75c0,9.17,5.14,14.17,14.59,14.17,9.86,0,15.69-6.39,15.69-15.56V12.14a10,10,0,0,1,10-10h.22a10,10,0,0,1,10,10v64c0,19.73-13.47,31.53-36.11,31.53-14.09,0-24.79-4.42-29.94-13.73A10,10,0,0,1,384,79.2h0A10.16,10.16,0,0,1,393,85c2,4,6.49,5.92,13,5.92,9.72,0,14.86-4.59,14.86-13.2Z"/><path fill="#009986" d="M486.7.72c21.95,0,36.53,14.44,36.53,36.11l.1,24.57a10.12,10.12,0,0,1-10.12,10.16h0a10.12,10.12,0,0,1-10.12-10.12V57h-1.25v1.39c0,7.23-7.64,14.59-21.11,14.59-18.34,0-30.56-13.62-30.56-34.73C450.17,14.19,464.75.72,486.7.72Zm-.14,53.34c11,0,16.53-7.09,16.53-17.23,0-10.41-6.39-17.22-16.39-17.22-9.72,0-16.39,6.94-16.39,17.22S476.7,54.06,486.56,54.06Z"/><rect fill="#f76d4d" x="287.75" width="74.88" height="74.88" rx="36"/></g>
        </svg>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 px-3 py-5 space-y-0.5">
        <router-link 
          to="/admin/dashboard" 
          class="flex items-center px-3 py-2.5 text-[13px] font-medium rounded-lg transition-colors"
          :class="$route.path === '/admin/dashboard' ? 'bg-[#e6f5f3] text-brand-teal' : 'text-[#64748b] hover:bg-gray-50'">
          <svg class="w-[18px] h-[18px] mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          Home
        </router-link>

        <router-link 
          to="/admin/suppliers" 
          class="flex items-center px-3 py-2.5 text-[13px] font-medium rounded-lg transition-colors"
          :class="$route.path === '/admin/suppliers' ? 'bg-[#e6f5f3] text-brand-teal' : 'text-[#64748b] hover:bg-gray-50'">
          <svg class="w-[18px] h-[18px] mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
          Suppliers
        </router-link>
      </nav>

      <!-- Logout -->
      <div class="p-3 border-t border-gray-100">
        <button 
          @click="handleLogout"
          class="w-full flex items-center px-3 py-2.5 text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <svg class="w-[18px] h-[18px] mr-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header -->

      <!-- Content -->
      <main class="flex-1 overflow-auto p-7">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { adminService } from '@/services/adminService';

const route = useRoute();
const router = useRouter();

const pageTitle = computed(() => {
  if (route.path === '/admin/dashboard') return 'Home';
  if (route.path === '/admin/suppliers') return 'Suppliers';
  return 'Admin';
});

const handleLogout = async () => {
  await adminService.logout();
  router.push('/admin/login');
};
</script>