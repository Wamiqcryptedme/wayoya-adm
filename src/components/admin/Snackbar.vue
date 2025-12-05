<template>
  <transition name="slide-up">
    <div v-if="show" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-brand-dark border px-6 py-3 rounded-xl shadow-lg z-[120] flex items-center gap-3">
      <div :class="['w-6 h-6 rounded-full flex items-center justify-center shrink-0', 
                    type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600']">
        <svg v-if="type === 'success'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <span class="text-sm font-medium">{{ message }}</span>
    </div>
  </transition>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
  message: string;
  type: 'success' | 'error';
}>();
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease-out;
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>