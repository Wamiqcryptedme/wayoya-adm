<template>
  <transition name="fade">
    <div v-if="show && supplier" class="fixed inset-0 z-[100] flex items-center justify-center px-4">
      <div @click="$emit('close')" class="absolute inset-0 bg-black/60"></div>
      <div class="bg-white rounded-xl shadow-modal w-full max-w-3xl p-5 relative z-10 transform transition-all overflow-y-auto max-h-[90vh]">
        
        <!-- Header -->
        <div class="flex justify-between items-start mb-6">
          <div class="flex items-center gap-3 mt-1">
            <span class="text-gray-400 text-sm font-medium">ID {{ supplier.id.substring(0, 8) }}</span>
            <span :class="['text-sm font-semibold', statusColor]">{{ statusLabel }}</span>
          </div>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Title & Action Buttons -->
        <div class="mb-8 flex items-center justify-between">
          <div>
            <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">{{ categoryLabel }}</span>
            <h2 class="text-lg md:text-2xl font-bold text-brand-dark">{{ supplier.business_name }}</h2>
          </div>
          
          <!-- Action Buttons (Only if Pending) -->
          <div v-if="supplier.status === 'pending'" class="flex gap-3">
            <button @click="$emit('approve')" class="w-10 h-10 rounded-full bg-[#e6f5f3] hover:bg-brand-teal text-brand-teal hover:text-white flex items-center justify-center transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </button>
            <button @click="$emit('reject')" class="w-10 h-10 rounded-full bg-red-50 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Grid Info -->
        <div class="overflow-x-auto pb-4">
          <div class="grid grid-cols-4 gap-y-8 gap-x-4 mb-8 min-w-[800px]">
            
            <!-- Row 1: Common Fields -->
            <div>
              <p class="text-xs font-semibold text-gray-500 mb-1">Country</p>
              <p class="text-sm font-medium text-brand-dark">Pakistan</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 mb-1">Phone number</p>
              <p class="text-sm font-medium text-brand-dark">{{ supplier.phone || '-' }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 mb-1">City / region</p>
              <p class="text-sm font-medium text-brand-dark">{{ supplier.places?.name || '-' }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 mb-1">Email</p>
              <p class="text-sm font-medium text-brand-dark break-all">{{ supplier.profiles.email }}</p>
            </div>

            <!-- Row 2: Operation Type Dependent -->
            <div>
              <p class="text-xs font-semibold text-gray-500 mb-1">Operates as</p>
              <p class="text-sm font-medium text-brand-dark">{{ supplier.legal_status }}</p>
            </div>
            
            <!-- Individual -->
            <template v-if="supplier.legal_status === 'Individual'">
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Legal name</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.contact_person || '-' }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-xs font-semibold text-gray-500 mb-1">CNIC number</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.national_id || '-' }}</p>
              </div>
            </template>

            <!-- Registered Business -->
            <template v-if="supplier.legal_status === 'Registered'">
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Business name</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.business_name }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-xs font-semibold text-gray-500 mb-1">CNIC number</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.national_id || '-' }}</p>
              </div>
            </template>

            <!-- Company -->
            <template v-if="supplier.legal_status === 'Company'">
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Company name</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.business_name }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Reg. number</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.company_reg_number || '-' }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">NTN number</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.ntn_number || '-' }}</p>
              </div>
            </template>

            <!-- Row 3: Category Specific Fields -->
            
            <!-- Tour Operator -->
            <template v-if="supplier.supplier_type === 'tour_operator'">
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Foreign tourists</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.details?.serve_international ? 'Yes' : 'No' }}</p>
              </div>
              <div class="col-span-3">
                <p class="text-xs font-semibold text-gray-500 mb-1">Office address</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.address || '-' }}</p>
              </div>
            </template>

            <!-- Stay -->
            <template v-if="supplier.supplier_type === 'stay'">
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Property type</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.details?.property_type || '-' }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Number of rooms</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.details?.room_count || '-' }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-xs font-semibold text-gray-500 mb-1">Address</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.address || '-' }}</p>
              </div>
            </template>

            <!-- Activity Provider -->
            <template v-if="supplier.supplier_type === 'activity_provider'">
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Type of activity</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.details?.activity_type || '-' }}</p>
              </div>
              <div class="col-span-3">
                <p class="text-xs font-semibold text-gray-500 mb-1">Address</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.address || '-' }}</p>
              </div>
            </template>

            <!-- Rental -->
            <template v-if="supplier.supplier_type === 'rental'">
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Rental type</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.details?.rental_type || '-' }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Count</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.details?.vehicle_count || '-' }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-xs font-semibold text-gray-500 mb-1">Address</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.address || '-' }}</p>
              </div>
            </template>

            <!-- Tour Guide -->
            <template v-if="supplier.supplier_type === 'tour_guide'">
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Foreign tourists</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.details?.serve_international ? 'Yes' : 'No' }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Guide since</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.details?.guide_since || '-' }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-xs font-semibold text-gray-500 mb-1">Address</p>
                <p class="text-sm font-medium text-brand-dark">{{ supplier.address || '-' }}</p>
              </div>
            </template>

            <!-- Row 4: Documents -->
            
            <!-- Company Registration (only for Company) -->
            <template v-if="supplier.legal_status === 'Company' && supplier.verification_docs?.companyReg">
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">Company reg.</p>
                <a :href="supplier.verification_docs.companyReg" target="_blank" class="text-sm font-medium text-brand-dark underline hover:text-brand-teal">view</a>
              </div>
            </template>

            <!-- DTS License (Stay, Tour Operator, Tour Guide) -->
            <template v-if="['stay', 'tour_operator', 'tour_guide'].includes(supplier.supplier_type) && supplier.verification_docs?.license">
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">DTS License</p>
                <a :href="supplier.verification_docs.license" target="_blank" class="text-sm font-medium text-brand-dark underline hover:text-brand-teal">view</a>
              </div>
            </template>

            <!-- Optional License (Activity, Rental) -->
            <template v-if="['rental', 'activity_provider'].includes(supplier.supplier_type) && supplier.verification_docs?.license">
              <div>
                <p class="text-xs font-semibold text-gray-500 mb-1">License</p>
                <a :href="supplier.verification_docs.license" target="_blank" class="text-sm font-medium text-brand-dark underline hover:text-brand-teal">view</a>
              </div>
            </template>

          </div>
        </div>

        <!-- Status Display (if already processed) -->
        <div v-if="supplier.status !== 'pending'" class="pt-4 border-t border-gray-200">
          <div :class="['p-3 rounded-lg flex items-center gap-3',
                       supplier.status === 'approved' ? 'bg-green-50' : 'bg-red-100']">
            <svg v-if="supplier.status === 'approved'" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <svg v-else class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            <div>
              <div :class="['font-medium text-sm', supplier.status === 'approved' ? 'text-green-900' : 'text-red-700']">
                {{ supplier.status === 'approved' ? 'Approved' : 'Rejected' }}
              </div>
              <div v-if="supplier.admin_remarks" class="text-sm text-brand-text mt-1">{{ supplier.admin_remarks }}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  show: boolean;
  supplier: any;
}>();

defineEmits<{
  close: [];
  approve: [];
  reject: [];
}>();

const categoryLabel = computed(() => {
  const map: Record<string, string> = {
    'stay': 'Stay',
    'tour_operator': 'Tour operator',
    'rental': 'Rental',
    'activity_provider': 'Activity provider',
    'tour_guide': 'Tour guide',
  };
  return map[props.supplier?.supplier_type] || '';
});

const statusLabel = computed(() => {
  if (!props.supplier) return '';
  return props.supplier.status.charAt(0).toUpperCase() + props.supplier.status.slice(1);
});

const statusColor = computed(() => {
  if (!props.supplier) return '';
  switch(props.supplier.status) {
    case 'approved': return 'text-[#10b981]';
    case 'rejected': return 'text-[#ef4444]';
    case 'pending': return 'text-[#fe9705]';
    default: return 'text-gray-500';
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar for this modal */
:deep(*)::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

:deep(*)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(*)::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}

:deep(*)::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>