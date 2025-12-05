<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center px-4">
    <div @click="$emit('close')" class="absolute inset-0 bg-black/60"></div>
    <div class="bg-white rounded-xl shadow-modal w-full max-w-md p-6 relative z-10">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-bold text-brand-dark">Delete photo</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Photo Preview -->
      <div class="mb-6">
        <img 
          :src="photoUrl" 
          class="w-full h-48 object-cover rounded-xl border border-gray-200" 
          alt="Photo to delete">
      </div>

      <div class="bg-orange-100 text-orange-700 p-4 rounded-xl text-sm mb-6 flex items-start gap-3">
        <svg class="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <p class="leading-relaxed">Are you sure you want to delete this photo? This action cannot be undone.</p>
      </div>

      <div class="flex gap-3">
        <button 
          @click="$emit('close')" 
          class="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
          Cancel
        </button>
        <button 
          @click="$emit('confirm')" 
          class="flex-1 py-3 bg-brand-red text-white font-semibold rounded-xl hover:bg-red-600 transition-colors">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  photoUrl: string;
}>();

defineEmits(['close', 'confirm']);
</script>