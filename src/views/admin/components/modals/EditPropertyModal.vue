<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center px-4">
    <div @click="$emit('close')" class="absolute inset-0 bg-black/60"></div>
    <div class="bg-white rounded-xl shadow-modal w-full max-w-md p-6 relative z-10 overflow-y-auto max-h-[90vh]">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-bold text-brand-dark">Update property details</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Check-in time</label>
          <div class="relative">
            <select 
              v-model="form.check_in_time" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white appearance-none cursor-pointer">
              <option value="Anytime">Anytime</option>
              <option value="12 PM">12 PM</option>
              <option value="2 PM">2 PM</option>
              <option value="3 PM">3 PM</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Check-out time</label>
          <div class="relative">
            <select 
              v-model="form.check_out_time" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white appearance-none cursor-pointer">
              <option value="11 AM">11 AM</option>
              <option value="12 PM">12 PM</option>
              <option value="1 PM">1 PM</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>

        <div>
  <label class="block text-xs font-semibold text-gray-700 mb-1">Property type</label>
  <div class="relative">
    <select 
      v-model="form.property_type_id" 
      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white appearance-none cursor-pointer">
      <option value="">Select property type</option>
      <option v-for="type in propertyTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
    </select>
    <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
  </div>
</div>

        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Coordinates</label>
          <input 
            v-model="form.coordinatesText" 
            type="text" 
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white" 
            placeholder="Lat, Long (e.g. 75.443453, 35.404468)">
        </div>
      </div>

      <div class="mt-8">
        <button 
          @click="handleSave" 
          class="w-full bg-brand-teal text-white font-semibold py-3 rounded-xl hover:bg-brand-tealDark transition-colors">
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue';

const props = defineProps<{
  supplier: any;
  propertyTypes: any[];  // ADD THIS
}>();

const emit = defineEmits(['close', 'save']);

const form = reactive({
  check_in_time: '',
  check_out_time: '',
  property_type_id: '',  // Change from property_type to property_type_id
  coordinatesText: '',
  property_photos: [] as string[]
});

// Initialize form
const initForm = () => {
  const details = props.supplier.details || {};
  
  Object.assign(form, {
    check_in_time: details.check_in_time || 'Anytime',
    check_out_time: details.check_out_time || '11 AM',
    property_type_id: details.property_type_id || '',  // Use ID
    property_photos: details.property_photos || []
  });
  
  // Coordinates
  if (props.supplier.coordinates?.x && props.supplier.coordinates?.y) {
    form.coordinatesText = `${props.supplier.coordinates.y}, ${props.supplier.coordinates.x}`;
  }
};

const handleSave = () => {
  const updatedDetails = {
    ...props.supplier.details,
    check_in_time: form.check_in_time,
    check_out_time: form.check_out_time,
    property_type: form.property_type_id,
    property_photos: form.property_photos
  };
  
  // Handle coordinates if changed
  if (form.coordinatesText) {
    const parts = form.coordinatesText.split(',').map(s => s.trim());
    if (parts.length === 2) {
      // Note: You'll need to update coordinates separately in the parent
      // as it's a PostGIS column
    }
  }
  
  emit('save', updatedDetails);
};

watch(() => props.supplier, () => {
  initForm();
}, { immediate: true });
</script>