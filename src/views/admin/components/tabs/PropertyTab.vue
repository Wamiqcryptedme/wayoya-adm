<template>
  <div class="relative mt-4">
    <!-- Edit Button -->
    <button 
      @click="$emit('edit')" 
      class="absolute top-0 right-0 w-8 h-8 rounded-full bg-gray-100 text-gray-400 hover:text-brand-teal hover:bg-brand-tealLight flex items-center justify-center transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
      </svg>
    </button>

    <!-- Property Photos -->
    <div class="mb-8">
      <h3 class="text-sm font-semibold text-brand-dark mb-4">Property photos</h3>
      <div v-if="propertyPhotos.length" class="grid grid-cols-5 md:grid-cols-7 gap-4">
        <div 
          v-for="(photo, idx) in propertyPhotos" 
          :key="idx"
          class="relative group aspect-[3/2]">
          <img 
            :src="photo" 
            class="w-full h-full object-cover rounded-xl border border-gray-200">
          <button 
            @click="$emit('delete-photo', photo)"
            class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
      <p v-else class="text-sm text-gray-500">No photos uploaded</p>
    </div>

    <!-- Property Details -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12">
      <div>
        <p class="text-sm font-semibold text-brand-dark mb-1">Check-in time</p>
        <p class="text-sm text-gray-500">{{ details.check_in_time || '--' }}</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-brand-dark mb-1">Check-out time</p>
        <p class="text-sm text-gray-500">{{ details.check_out_time || '--' }}</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-brand-dark mb-1">Property type</p>
        <p class="text-sm text-gray-500">{{ details.property_type_name || '--' }}</p>
      </div>
      <div class="md:col-span-3">
        <p class="text-sm font-semibold text-brand-dark mb-1">Coordinates</p>
        <p class="text-sm text-gray-500">{{ formatCoordinates() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  supplier: any;
}>();

defineEmits(['edit', 'delete-photo']);

const details = computed(() => props.supplier.details || {});

const propertyPhotos = computed(() => {
  return details.value.property_photos || [];
});

// Format coordinates
const formatCoordinates = () => {
  if (!props.supplier.coordinates) return 'Not set';
  
  const coords = props.supplier.coordinates;
  if (coords.x && coords.y) {
    return `${coords.y}, ${coords.x}`; // Lat, Long
  }
  return 'Not set';
};
</script>