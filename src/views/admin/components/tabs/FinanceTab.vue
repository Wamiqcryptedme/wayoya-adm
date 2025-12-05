<template>
  <div class="mt-4 max-w-4xl">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div>
        <label class="block text-sm font-semibold text-brand-dark mb-2">Bank</label>
        <input 
          v-model="bankForm.bank_name" 
          type="text" 
          class="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white" 
          placeholder="Bank Name">
      </div>
      <div>
        <label class="block text-sm font-semibold text-brand-dark mb-2">Account title</label>
        <input 
          v-model="bankForm.account_title" 
          type="text" 
          class="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white" 
          placeholder="Account Title">
      </div>
      <div>
        <label class="block text-sm font-semibold text-brand-dark mb-2">Account number</label>
        <input 
          v-model="bankForm.account_number" 
          type="text" 
          class="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white" 
          placeholder="Account Number">
      </div>
    </div>
    
    <div class="mb-8 w-full md:w-1/3">
      <label class="block text-sm font-semibold text-brand-dark mb-2">IBAN number</label>
      <input 
        v-model="bankForm.iban" 
        type="text" 
        class="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl focus:outline-none focus:border-brand-teal text-sm bg-white" 
        placeholder="IBAN">
    </div>

    <div class="flex justify-end">
      <button 
        @click="handleSave" 
        :disabled="!isFormChanged"
        :class="['px-8 py-3 rounded-xl text-sm font-semibold transition-colors', 
          isFormChanged 
          ? 'bg-brand-teal text-white hover:bg-brand-tealDark' 
          : 'bg-gray-200 text-gray-400 cursor-not-allowed']">
        Update
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue';

const props = defineProps<{
  supplier: any;
}>();

const emit = defineEmits(['save']);

const bankForm = reactive({
  bank_name: '',
  account_title: '',
  account_number: '',
  iban: ''
});

const originalData = ref('');

// Initialize form
const initForm = () => {
  if (props.supplier.bank_details) {
    Object.assign(bankForm, {
      bank_name: props.supplier.bank_details.bank_name || '',
      account_title: props.supplier.bank_details.account_title || '',
      account_number: props.supplier.bank_details.account_number || '',
      iban: props.supplier.bank_details.iban || ''
    });
  }
  originalData.value = JSON.stringify(bankForm);
};

// Check if form changed
const isFormChanged = computed(() => {
  return JSON.stringify(bankForm) !== originalData.value;
});

// Save handler
const handleSave = () => {
  emit('save', { ...bankForm });
  originalData.value = JSON.stringify(bankForm);
};

// Watch supplier changes
watch(() => props.supplier, () => {
  initForm();
}, { immediate: true });
</script>