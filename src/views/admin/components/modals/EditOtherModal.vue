<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center px-4">
    <div @click="$emit('close')" class="absolute inset-0 bg-black/60"></div>
    <div class="bg-white rounded-xl shadow-modal w-full max-w-lg p-5 relative z-10 overflow-y-auto max-h-[90vh]">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-bold text-brand-dark">Update details</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        
        <!-- Commission Fields -->
        <div v-if="supplier.supplier_type === 'tour_operator'">
          <label class="block text-xs font-semibold text-gray-700 mb-1">Commission - Tours (%)</label>
          <input 
            v-model.number="form.commission_rates.tours" 
            type="number" 
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white">
        </div>
        <div v-if="supplier.supplier_type === 'tour_operator'">
          <label class="block text-xs font-semibold text-gray-700 mb-1">Commission - Treks (%)</label>
          <input 
            v-model.number="form.commission_rates.treks" 
            type="number" 
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white">
        </div>
        <div v-if="!['tour_operator'].includes(supplier.supplier_type)">
          <label class="block text-xs font-semibold text-gray-700 mb-1">Commission (%)</label>
          <input 
            v-model.number="form.commission_rates.main" 
            type="number" 
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white">
        </div>

        <!-- Tour Operator Specific -->
        <template v-if="supplier.supplier_type === 'tour_operator'">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-2">Foreign tourists access</label>
            <div class="grid grid-cols-2 gap-3 p-1 bg-gray-50 rounded-xl border border-gray-200">
              <button 
                @click="form.details.foreign_tourists_access = true"
                :class="['py-2 rounded-lg text-sm font-medium transition-all', form.details.foreign_tourists_access ? 'bg-brand-teal text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100']">
                Allowed
              </button>
              <button 
                @click="form.details.foreign_tourists_access = false"
                :class="['py-2 rounded-lg text-sm font-medium transition-all', !form.details.foreign_tourists_access ? 'bg-brand-teal text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100']">
                Not allowed
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-2">Group listings access</label>
            <div class="grid grid-cols-2 gap-3 p-1 bg-gray-50 rounded-xl border border-gray-200">
              <button 
                @click="form.details.group_listings_access = true"
                :class="['py-2 rounded-lg text-sm font-medium transition-all', form.details.group_listings_access ? 'bg-brand-teal text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100']">
                Allowed
              </button>
              <button 
                @click="form.details.group_listings_access = false"
                :class="['py-2 rounded-lg text-sm font-medium transition-all', !form.details.group_listings_access ? 'bg-brand-teal text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100']">
                Not allowed
              </button>
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
        </template>

        <!-- Activity Provider Specific -->
        <template v-if="supplier.supplier_type === 'activity_provider'">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Operational days</label>
            <div class="relative">
              <select 
                v-model="form.details.open_days" 
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white appearance-none cursor-pointer">
                <option>Monday to Sunday</option>
                <option>Monday to Friday</option>
                <option>Monday to Saturday</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Open time</label>
            <input 
              v-model="form.openTime" 
              type="time" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Close time</label>
            <input 
              v-model="form.closeTime" 
              type="time" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Coordinates</label>
            <input 
              v-model="form.coordinatesText" 
              type="text" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white" 
              placeholder="Lat, Long">
          </div>
          <div>
  <label class="block text-xs font-semibold text-gray-700 mb-1">Activity type</label>
  <div class="relative">
    <select 
      v-model="form.details.activity_type_id" 
      class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white appearance-none cursor-pointer">
      <option value="">Select activity type</option>
      <option v-for="type in activityTypes" :key="type.id" :value="type.id">{{ type.name }}</option>
    </select>
    <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
  </div>
</div>
        </template>

        <!-- Rental Specific -->
        <template v-if="supplier.supplier_type === 'rental'">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-2">Rental type</label>
            <div class="grid grid-cols-2 gap-3 p-1 bg-gray-50 rounded-xl border border-gray-200">
              <button 
                @click="form.details.rental_type = 'Car'"
                :class="['py-2 rounded-lg text-sm font-medium transition-all', form.details.rental_type === 'Car' ? 'bg-brand-teal text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100']">
                Car
              </button>
              <button 
                @click="form.details.rental_type = 'Bike'"
                :class="['py-2 rounded-lg text-sm font-medium transition-all', form.details.rental_type === 'Bike' ? 'bg-brand-teal text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100']">
                Bike
              </button>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Operational days</label>
            <div class="relative">
              <select 
                v-model="form.details.open_days" 
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white appearance-none cursor-pointer">
                <option>Monday to Sunday</option>
                <option>Monday to Friday</option>
                <option>Monday to Saturday</option>
              </select>
              <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Open time</label>
            <input 
              v-model="form.openTime" 
              type="time" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Close time</label>
            <input 
              v-model="form.closeTime" 
              type="time" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Coordinates</label>
            <input 
              v-model="form.coordinatesText" 
              type="text" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white" 
              placeholder="Lat, Long">
          </div>
        </template>

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
  activityTypes: any[];
}>();

const emit = defineEmits(['close', 'save']);

const form = reactive({
  commission_rates: {} as any,
  details: {} as any,
  coordinatesText: '',
  openTime: '',
  closeTime: ''
});

// Initialize form
const initForm = () => {
  // Commission rates
  form.commission_rates = JSON.parse(JSON.stringify(props.supplier.commission_rates || {}));
  
  // Set main commission for non-tour-operators
  if (props.supplier.supplier_type !== 'tour_operator') {
    const type = props.supplier.supplier_type;
    form.commission_rates.main = form.commission_rates[type] || form.commission_rates[type + 's'] || 0;
  }
  
  // Details
  form.details = JSON.parse(JSON.stringify(props.supplier.details || {}));
  
  // Coordinates
  if (props.supplier.coordinates?.x && props.supplier.coordinates?.y) {
    form.coordinatesText = `${props.supplier.coordinates.y}, ${props.supplier.coordinates.x}`;
  }
  
  // Parse open hours
  if (form.details.open_hours) {
    const parts = form.details.open_hours.split(' - ');
    if (parts.length === 2) {
      form.openTime = parts[0];
      form.closeTime = parts[1];
    }
  }
};

const handleSave = () => {
  const updateData: any = {
    details: { ...form.details }  // This already contains activity_type_id
  };
  
  // Handle commission rates
  if (props.supplier.supplier_type === 'tour_operator') {
    updateData.commission_rates = {
      tours: form.commission_rates.tours || 0,
      treks: form.commission_rates.treks || 0
    };
  } else {
    const type = props.supplier.supplier_type;
    updateData.commission_rates = {
      [type]: form.commission_rates.main || 0
    };
  }
  
  // Handle coordinates
  if (form.coordinatesText) {
    const parts = form.coordinatesText.split(',').map(s => s.trim());
    if (parts.length === 2) {
      updateData.coordinates = `POINT(${parseFloat(parts[1])} ${parseFloat(parts[0])})`;
    }
  }
  
  // Handle open hours
  if (form.openTime && form.closeTime) {
    updateData.details.open_hours = `${form.openTime} - ${form.closeTime}`;
  }
  
  emit('save', updateData);
};

watch(() => props.supplier, () => {
  initForm();
}, { immediate: true });
</script>