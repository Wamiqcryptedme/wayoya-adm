<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div @click="$emit('close')" class="absolute inset-0 bg-black/60"></div>
      <div class="bg-white rounded-xl shadow-modal w-full max-w-md p-5 relative z-10">
        
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-brand-dark">Reject supplier</h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <label class="block text-xs font-semibold text-gray-700 mb-1">Explain</label>
          <textarea 
            v-model="localRemarks" 
            class="w-full text-sm px-4 py-3 border-[1.5px] border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal h-32 resize-none" 
            placeholder="Reason for rejection..."></textarea>
        </div>

        <button 
          @click="handleConfirm"
          :disabled="!localRemarks.trim() || isProcessing"
          class="w-full bg-brand-teal text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center">
          <span v-if="!isProcessing">Confirm</span>
          <svg v-else class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [remarks: string];
}>();

const isProcessing = ref(false);
const localRemarks = ref('');

watch(() => props.show, (newVal) => {
  if (newVal) {
    localRemarks.value = '';
    isProcessing.value = false;
  }
});

const handleConfirm = () => {
  if (!localRemarks.value.trim()) return;
  isProcessing.value = true;
  emit('confirm', localRemarks.value);
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>