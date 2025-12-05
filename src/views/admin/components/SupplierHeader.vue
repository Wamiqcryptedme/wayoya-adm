<template>
  <div>
    <!-- Card Header (ID & Status) -->
    <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-gray-500">ID {{ supplier.id.substring(0, 8) }}</span>
        <span :class="['text-sm font-semibold', statusColor]">{{ formatStatus }}</span>
      </div>
      <!-- Suspend Button -->
      <button 
        v-if="supplier.status !== 'suspended'"
        @click="$emit('suspend')" 
        class="text-gray-400 hover:text-brand-red transition-colors bg-red-100 p-2 rounded-full" 
        title="Suspend Supplier">
        <svg class="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
        </svg>
      </button>
    </div>

    <!-- Profile Header & Navigation -->
    <div class="p-6 pb-0">
      <!-- Logo & Name -->
      <div class="flex flex-col md:flex-row items-center md:items-start gap-4 mb-8">
        <img 
          :src="logoUrl" 
          class="w-16 h-16 rounded-full border border-gray-200 object-cover" 
          alt="Supplier Logo">
        <div class="text-center md:text-left pt-1">
          <h2 class="text-xl font-bold text-brand-dark">{{ supplier.business_name }}</h2>
          <p class="text-xs text-gray-500 uppercase tracking-wide font-medium mt-1">{{ formatSupplierType }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex overflow-x-auto flex-nowrap gap-2 border-b border-gray-100 pb-1">
        <button 
          v-for="tab in availableTabs" 
          :key="tab"
          @click="$emit('tab-change', tab)"
          :class="['px-6 py-2 rounded-lg text-sm font-medium transition-all mb-1 whitespace-nowrap', 
            activeTab === tab 
            ? 'bg-brand-tealLight text-brand-teal shadow-sm' 
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50']">
          {{ tab }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  supplier: any;
  activeTab: string;
}>();

defineEmits(['suspend', 'tab-change']);

// Generate initials avatar if no logo
const generateInitialsAvatar = (name: string): string => {
  const words = name.trim().split(' ').filter(w => w.length > 0);
  let initials = '';
  
  if (words.length === 1) {
    initials = words[0].substring(0, 2).toUpperCase();
  } else {
    initials = (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#E5E7EB"/>
      <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="#009986">${initials}</text>
    </svg>
  `;
  
  return 'data:image/svg+xml;base64,' + btoa(svg);
};

// Logo URL with /public variant
const logoUrl = computed(() => {
  if (props.supplier.logo_url) {
    return props.supplier.logo_url.replace('/card', '/profile');
  }
  return generateInitialsAvatar(props.supplier.business_name);
});

// Status color
const statusColor = computed(() => {
  const status = props.supplier.status;
  if (status === 'approved') return 'text-green-500';
  if (status === 'suspended') return 'text-red-500';
  if (status === 'pending') return 'text-orange-500';
  if (status === 'rejected') return 'text-gray-500';
  return 'text-gray-500';
});

// Format status for display
const formatStatus = computed(() => {
  const status = props.supplier.status;
  return status.charAt(0).toUpperCase() + status.slice(1);
});

// Format supplier type
const formatSupplierType = computed(() => {
  const typeMap: Record<string, string> = {
    'stay': 'Stay',
    'tour_operator': 'Tour Operator',
    'rental': 'Rental',
    'activity_provider': 'Activity Provider',
    'tour_guide': 'Tour Guide'
  };
  return typeMap[props.supplier.supplier_type] || props.supplier.supplier_type;
});

// Available tabs based on supplier type
const availableTabs = computed(() => {
  const tabs = ['Details', 'Finance', 'Other'];
  
  // Property tab only for stays
  if (props.supplier.supplier_type === 'stay') {
    tabs.push('Property');
  }
  
  return tabs;
});
</script>