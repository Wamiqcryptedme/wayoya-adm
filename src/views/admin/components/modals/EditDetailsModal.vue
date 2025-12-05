<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center px-4">
    <div @click="$emit('close')" class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
    <div class="bg-white rounded-xl shadow-modal w-full max-w-lg p-6 relative z-10 overflow-y-auto max-h-[90vh]">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-lg font-bold text-brand-dark">Update details</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Business name</label>
          <input 
            v-model="form.business_name" 
            type="text" 
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
          <input 
            v-model="form.phone" 
            type="text" 
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Operates as</label>
          <div class="relative">
            <select 
              v-model="form.legal_status" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white appearance-none cursor-pointer">
              <option value="Individual">Individual</option>
              <option value="Registered">Registered</option>
              <option value="Company">Company</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Based in</label>
          <div class="relative">
            <select 
              v-model="form.place_id" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white appearance-none cursor-pointer">
              <option v-for="place in places" :key="place.id" :value="place.id">{{ place.name }}</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">
            {{ form.legal_status === 'stay' ? 'Property address' : 'Office address' }}
          </label>
          <textarea 
            v-model="form.address" 
            rows="2" 
            class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white resize-none"></textarea>
        </div>

        <!-- Dynamic Fields Based on Legal Status -->
        <template v-if="form.legal_status === 'Individual'">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Legal name</label>
            <input 
              v-model="form.contact_person" 
              type="text" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">CNIC</label>
            <input 
              v-model="form.national_id" 
              type="text" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white">
          </div>
        </template>

        <template v-else-if="form.legal_status === 'Registered'">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">CNIC (Owner)</label>
            <input 
              v-model="form.national_id" 
              type="text" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white">
          </div>
        </template>

        <template v-else-if="form.legal_status === 'Company'">
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">Registration number</label>
            <input 
              v-model="form.company_reg_number" 
              type="text" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white">
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-700 mb-1">NTN</label>
            <input 
              v-model="form.ntn_number" 
              type="text" 
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white">
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
  places: any[];
}>();

const emit = defineEmits(['close', 'save']);

const form = reactive({
  business_name: '',
  phone: '',
  legal_status: '',
  place_id: '',
  address: '',
  contact_person: '',
  national_id: '',
  company_reg_number: '',
  ntn_number: ''
});

// Initialize form
const initForm = () => {
  Object.assign(form, {
    business_name: props.supplier.business_name || '',
    phone: props.supplier.phone || '',
    legal_status: props.supplier.legal_status || 'Individual',
    place_id: props.supplier.place_id || '',
    address: props.supplier.address || '',
    contact_person: props.supplier.contact_person || '',
    national_id: props.supplier.national_id || '',
    company_reg_number: props.supplier.company_reg_number || '',
    ntn_number: props.supplier.ntn_number || ''
  });
};

const handleSave = () => {
  emit('save', { ...form });
};

watch(() => props.supplier, () => {
  initForm();
}, { immediate: true });
</script>