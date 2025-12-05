<template>
  <div class="relative">
    <!-- Edit Button -->
    <button 
      @click="$emit('edit')" 
      class="absolute top-0 right-0 w-8 h-8 rounded-full bg-gray-100 text-gray-400 hover:text-brand-teal hover:bg-brand-tealLight flex items-center justify-center transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
      </svg>
    </button>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-12 mt-4">
      <div>
        <p class="text-sm font-semibold text-brand-dark mb-1">Email</p>
        <p class="text-sm text-gray-500 break-all">{{ supplier.email || '--' }}</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-brand-dark mb-1">Phone</p>
        <p class="text-sm text-gray-500">{{ supplier.phone || '--' }}</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-brand-dark mb-1">Based in</p>
        <p class="text-sm text-gray-500">{{ supplier.place_name || '--' }}</p>
      </div>
      <div>
        <p class="text-sm font-semibold text-brand-dark mb-1">Operates as</p>
        <p class="text-sm text-gray-500">{{ formatLegalStatus }}</p>
      </div>
      <div class="md:col-span-2">
        <p class="text-sm font-semibold text-brand-dark mb-1">Address</p>
        <p class="text-sm text-gray-500">{{ supplier.address || '--' }}</p>
      </div>

      <!-- Dynamic Fields Based on Legal Status -->
      <template v-if="supplier.legal_status === 'Individual'">
        <div>
          <p class="text-sm font-semibold text-brand-dark mb-1">Legal name</p>
          <p class="text-sm text-gray-500">{{ supplier.contact_person || '--' }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-brand-dark mb-1">CNIC</p>
          <p class="text-sm text-gray-500">{{ supplier.national_id || '--' }}</p>
        </div>
      </template>

      <template v-else-if="supplier.legal_status === 'Registered'">
        <div>
          <p class="text-sm font-semibold text-brand-dark mb-1">Business name</p>
          <p class="text-sm text-gray-500">{{ supplier.business_name || '--' }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-brand-dark mb-1">CNIC</p>
          <p class="text-sm text-gray-500">{{ supplier.national_id || '--' }}</p>
        </div>
      </template>

      <template v-else-if="supplier.legal_status === 'Company'">
        <div>
          <p class="text-sm font-semibold text-brand-dark mb-1">Company name</p>
          <p class="text-sm text-gray-500">{{ supplier.business_name || '--' }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-brand-dark mb-1">Registration number</p>
          <p class="text-sm text-gray-500">{{ supplier.company_reg_number || '--' }}</p>
        </div>
        <div>
          <p class="text-sm font-semibold text-brand-dark mb-1">NTN</p>
          <p class="text-sm text-gray-500">{{ supplier.ntn_number || '--' }}</p>
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

const formatLegalStatus = computed(() => {
  const statusMap: Record<string, string> = {
    'Individual': 'Individual',
    'Registered': 'Registered Business',
    'Company': 'Company'
  };
  return statusMap[props.supplier.legal_status] || props.supplier.legal_status;
});
</script>