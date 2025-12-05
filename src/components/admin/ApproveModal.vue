<template>
  <transition name="fade">
    <div v-if="show" class="fixed inset-0 z-[110] flex items-center justify-center px-4">
      <div @click="$emit('close')" class="absolute inset-0 bg-black/60"></div>
      <div class="bg-white rounded-xl shadow-modal w-full max-w-md p-5 relative z-10">
        
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-brand-dark">Set commission</h3>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="space-y-4 mb-6">
          <!-- Tour Operator -->
          <template v-if="category === 'tour_operator'">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Tours (%)</label>
              <input v-model.number="localCommissions.tours" type="number" min="0" max="100" step="0.5"
                     class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal bg-gray-50" 
                     placeholder="e.g. 10">
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Treks (%)</label>
              <input v-model.number="localCommissions.treks" type="number" min="0" max="100" step="0.5"
                     class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal bg-gray-50" 
                     placeholder="e.g. 10">
            </div>
          </template>

          <!-- Stay -->
          <div v-else-if="category === 'stay'">
            <label class="block text-xs font-semibold text-gray-700 mb-1">Rooms (%)</label>
            <input v-model.number="localCommissions.rooms" type="number" min="0" max="100" step="0.5"
                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal" 
                   placeholder="e.g. 15">
          </div>

          <!-- Activity Provider -->
          <div v-else-if="category === 'activity_provider'">
            <label class="block text-xs font-semibold text-gray-700 mb-1">Activity (%)</label>
            <input v-model.number="localCommissions.activity" type="number" min="0" max="100" step="0.5"
                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal" 
                   placeholder="e.g. 10">
          </div>

          <!-- Rental -->
          <div v-else-if="category === 'rental'">
            <label class="block text-xs font-semibold text-gray-700 mb-1">
              {{ rentalType === 'Car' ? 'Car' : 'Bike' }} (%)</label>
            <input v-model.number="localCommissions.rental" type="number" min="0" max="100" step="0.5"
                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal" 
                   placeholder="e.g. 10">
          </div>

          <!-- Tour Guide -->
          <div v-else-if="category === 'tour_guide'">
            <label class="block text-xs font-semibold text-gray-700 mb-1">Experiences (%)</label>
            <input v-model.number="localCommissions.experiences" type="number" min="0" max="100" step="0.5"
                   class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal" 
                   placeholder="e.g. 15">
          </div>
        </div>

        <button 
          @click="handleConfirm" 
          :disabled="!isValid || isProcessing"
          class="w-full bg-brand-teal text-white font-semibold py-3 rounded-xl transition-colors hover:bg-brand-tealDark disabled:opacity-50 flex items-center justify-center">
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
import { ref, computed, watch } from 'vue';

const props = defineProps<{
  show: boolean;
  category: string;
  rentalType?: string;
}>();

const emit = defineEmits<{
  close: [];
  confirm: [commissions: Record<string, number>];
}>();

const isProcessing = ref(false);
const localCommissions = ref<Record<string, number>>({
  tours: 15,
  treks: 15,
  rooms: 15,
  activity: 15,
  rental: 15,
  experiences: 15,
});

// Reset when modal opens
watch(() => props.show, (newVal) => {
  if (newVal) {
    localCommissions.value = {
      tours: 15,
      treks: 15,
      rooms: 15,
      activity: 15,
      rental: 15,
      experiences: 15,
    };
    isProcessing.value = false;
  }
});

const isValid = computed(() => {
  if (props.category === 'tour_operator') {
    return localCommissions.value.tours > 0 && localCommissions.value.treks > 0;
  }
  const relevantKey = props.category === 'stay' ? 'rooms' : 
                      props.category === 'activity_provider' ? 'activity' :
                      props.category === 'rental' ? 'rental' : 'experiences';
  return localCommissions.value[relevantKey] > 0;
});

const handleConfirm = () => {
  if (!isValid.value) return;
  isProcessing.value = true;
  
  // Only send relevant commissions
  const relevantCommissions: Record<string, number> = {};
  if (props.category === 'tour_operator') {
    relevantCommissions.tours = localCommissions.value.tours;
    relevantCommissions.treks = localCommissions.value.treks;
  } else if (props.category === 'stay') {
    relevantCommissions.rooms = localCommissions.value.rooms;
  } else if (props.category === 'activity_provider') {
    relevantCommissions.activity = localCommissions.value.activity;
  } else if (props.category === 'rental') {
    relevantCommissions.rental = localCommissions.value.rental;
  } else if (props.category === 'tour_guide') {
    relevantCommissions.experiences = localCommissions.value.experiences;
  }
  
  emit('confirm', relevantCommissions);
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin { animation: spin 1s linear infinite; }
</style>