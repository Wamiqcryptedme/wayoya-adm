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

    <div class="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12">
      
      <!-- Commission (for ALL types) -->
      <div>
        <p class="text-sm font-semibold text-brand-dark mb-1">Commission</p>
        <p class="text-sm text-gray-500" v-if="supplier.supplier_type === 'tour_operator'">
          Tours: <span class="text-brand-dark font-medium">{{ getCommission('tours') }}%</span> / 
          Treks: <span class="text-brand-dark font-medium">{{ getCommission('treks') }}%</span>
        </p>
        <p class="text-sm text-gray-500" v-else>
          <span class="text-brand-dark font-medium">{{ getMainCommission() }}%</span>
        </p>
      </div>

      <!-- Tour Operator Specific (Additional Fields) -->
      <template v-if="supplier.supplier_type === 'tour_operator'">
        <div>
          <p class="text-sm font-semibold text-brand-dark mb-1">Group listings access</p>
          <p :class="['text-sm', details.group_listings_access ? 'text-brand-green font-medium' : 'text-gray-400']">
            {{ details.group_listings_access ? 'Allowed' : 'Not allowed' }}
          </p>
        </div>
        <div>
          <p class="text-sm font-semibold text-brand-dark mb-1">Foreign tourists access</p>
          <p :class="['text-sm', details.foreign_tourists_access ? 'text-brand-green font-medium' : 'text-gray-400']">
            {{ details.foreign_tourists_access ? 'Allowed' : 'Not allowed' }}
          </p>
        </div>
        <div class="md:col-span-3">
          <p class="text-sm font-semibold text-brand-dark mb-1">Coordinates</p>
          <p class="text-sm text-gray-500">{{ formatCoordinates() }}</p>
        </div>
      </template>

      <!-- Activity Provider Specific (Additional Fields) -->
      <template v-if="supplier.supplier_type === 'activity_provider'">
        <div>
          <p class="text-sm font-semibold text-brand-dark mb-1">Operational days</p>
          <p class="text-sm text-gray-500">{{ details.open_days || '--' }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-brand-dark mb-1">Open time</p>
          <p class="text-sm text-gray-500">{{ formatTime(details.open_hours, 'open') }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-brand-dark mb-1">Close time</p>
          <p class="text-sm text-gray-500">{{ formatTime(details.open_hours, 'close') }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-brand-dark mb-1">Activity type</p>
          <p class="text-sm text-gray-500">{{ details.activity_type_name || '--' }}</p>
        </div>
        <div class="md:col-span-2">
          <p class="text-sm font-semibold text-brand-dark mb-1">Coordinates</p>
          <p class="text-sm text-gray-500">{{ formatCoordinates() }}</p>
        </div>
      </template>

      <!-- Rental Specific (Additional Fields) -->
      <template v-if="supplier.supplier_type === 'rental'">
        <div>
          <p class="text-sm font-semibold text-brand-dark mb-1">Rental type</p>
          <p class="text-sm text-gray-500">{{ details.rental_type || '--' }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-brand-dark mb-1">Operational days</p>
          <p class="text-sm text-gray-500">{{ details.open_days || '--' }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-brand-dark mb-1">Open time</p>
          <p class="text-sm text-gray-500">{{ formatTime(details.open_hours, 'open') }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-brand-dark mb-1">Close time</p>
          <p class="text-sm text-gray-500">{{ formatTime(details.open_hours, 'close') }}</p>
        </div>
        <div class="md:col-span-2">
          <p class="text-sm font-semibold text-brand-dark mb-1">Coordinates</p>
          <p class="text-sm text-gray-500">{{ formatCoordinates() }}</p>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  supplier: any;
}>();

defineEmits(['edit']);

const details = computed(() => props.supplier.details || {});

// Get commission value
const getCommission = (type: string) => {
  const rates = props.supplier.commission_rates || {};
  return rates[type] || rates[type + 's'] || 0;
};

// Get main commission for non-tour-operator types
const getMainCommission = () => {
  const rates = props.supplier.commission_rates || {};
  const type = props.supplier.supplier_type;
  
  // Try different naming conventions
  return rates[type] || rates[type + 's'] || 
         rates.stay || rates.rooms || 
         rates.rental || rates.rentals || 
         rates.activity || rates.activities || 
         rates.guide || rates.experiences || 
         rates.tour_guide || 0;
};

// Format coordinates
const formatCoordinates = () => {
  if (!props.supplier.coordinates) return 'Not set';
  
  const coords = props.supplier.coordinates;
  if (coords.x && coords.y) {
    return `${coords.y}, ${coords.x}`; // Lat, Long
  }
  return 'Not set';
};

// Format time from "HH:MM - HH:MM" format
const formatTime = (timeRange: string | undefined, part: 'open' | 'close') => {
  if (!timeRange) return '--';
  
  const parts = timeRange.split(' - ');
  if (parts.length !== 2) return '--';
  
  return part === 'open' ? parts[0] : parts[1];
};
</script>