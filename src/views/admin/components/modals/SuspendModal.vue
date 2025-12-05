<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center px-4">
    <div @click="$emit('close')" class="absolute inset-0 bg-black/60"></div>
    <div class="bg-white rounded-xl shadow-modal w-full max-w-md p-5 relative z-10">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-brand-dark">Confirm</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <div class="bg-red-100 text-red-700 p-4 rounded-xl text-sm mb-6 flex items-start gap-3">
        <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <p class="leading-relaxed">Suspending this supplier will immediately remove their access to the dashboard and deactivate all of their listings. Existing bookings will remain active and unchanged.</p>
      </div>

      <button 
        @click="$emit('confirm')" 
        class="w-full bg-brand-red text-white font-semibold py-3 rounded-xl hover:bg-red-600 transition-colors">
        Suspend
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  supplier: any;
}>();

defineEmits(['close', 'confirm']);
</script>