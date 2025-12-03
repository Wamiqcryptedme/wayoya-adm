<template>
  <div>
    <!-- Tabs -->
    <div class="flex gap-6 border-b border-gray-200 mb-6">
      <button 
        @click="activeTab = 'all'"
        :class="['pb-3 text-sm font-semibold transition-colors relative', 
                 activeTab === 'all' ? 'text-brand-teal' : 'text-gray-500 hover:text-gray-700']">
        All
        <div v-if="activeTab === 'all'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-teal"></div>
      </button>
      <button 
        @click="activeTab = 'new'"
        :class="['pb-3 text-sm font-semibold transition-colors relative flex items-center gap-2', 
                 activeTab === 'new' ? 'text-brand-teal' : 'text-gray-500 hover:text-gray-700']">
        New
        <span v-if="newCount > 0" class="bg-brand-dot text-white text-xs px-1.5 py-0.5 rounded-full">{{ newCount }}</span>
        <div v-if="activeTab === 'new'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-teal"></div>
      </button>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="w-8 h-8 border-4 border-brand-tealLight border-t-brand-teal rounded-full animate-spin"></div>
    </div>

    <!-- Tables -->
    <div v-else>
      <!-- All Suppliers Table -->
      <div v-if="activeTab === 'all'" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Business Name</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Category</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Contact</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">City</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Date</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="supplier in allSuppliers" :key="supplier.id" class="hover:bg-gray-50 cursor-pointer" @click="viewProfile(supplier.id)">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ supplier.business_name }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ getCategoryLabel(supplier.supplier_type) }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ supplier.profiles.email }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ supplier.places?.name || '-' }}</td>
              <td class="px-6 py-4">
                <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                              supplier.status === 'approved' ? 'bg-green-100 text-green-800' :
                              supplier.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              supplier.status === 'suspended' ? 'bg-gray-100 text-gray-800' :
                              'bg-yellow-100 text-yellow-800']">
                  {{ supplier.status === 'approved' ? 'Active' : supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(supplier.created_at) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="allSuppliers.length === 0" class="text-center py-12 text-gray-500">No suppliers found</div>
      </div>

      <!-- New Suppliers Table -->
      <div v-if="activeTab === 'new'" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Business Name</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Category</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Contact</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">City</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th class="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Date Submitted</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="supplier in newSuppliers" :key="supplier.id" class="hover:bg-gray-50 cursor-pointer" @click="openDetailsModal(supplier.id)">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ supplier.business_name }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ getCategoryLabel(supplier.supplier_type) }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ supplier.profiles.email }}</td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ supplier.places?.name || '-' }}</td>
              <td class="px-6 py-4">
                <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                              supplier.status === 'approved' ? 'bg-green-100 text-green-800' :
                              supplier.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800']">
                  {{ supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600">{{ formatDate(supplier.created_at) }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="newSuppliers.length === 0" class="text-center py-12 text-gray-500">No new suppliers</div>
      </div>
    </div>

    <!-- New Supplier Details Modal -->
    <div v-if="showDetailsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeDetailsModal">
      <div class="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Modal Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-gray-900">New supplier</h2>
            <p class="text-sm text-gray-500 mt-0.5">Review details and approve or reject</p>
          </div>
          <button @click="closeDetailsModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div v-if="selectedSupplier" class="p-6 space-y-6">
          <!-- Category Badge -->
          <div>
            <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-tealLight text-brand-teal">
              {{ getCategoryLabel(selectedSupplier.supplier_type) }}
            </span>
          </div>

          <!-- Row 1: Same for all -->
          <div class="grid grid-cols-3 gap-4">
            <div>
              <div class="text-xs font-semibold text-gray-500 mb-1">Business name</div>
              <div class="text-sm text-gray-900">{{ selectedSupplier.business_name }}</div>
            </div>
            <div>
              <div class="text-xs font-semibold text-gray-500 mb-1">Phone</div>
              <div class="text-sm text-gray-900">{{ selectedSupplier.phone || '-' }}</div>
            </div>
            <div>
              <div class="text-xs font-semibold text-gray-500 mb-1">Email</div>
              <div class="text-sm text-gray-900">{{ selectedSupplier.profiles.email }}</div>
            </div>
          </div>

          <!-- Row 2: Operation type dependent -->
          <div class="grid grid-cols-3 gap-4">
            <div>
              <div class="text-xs font-semibold text-gray-500 mb-1">Operation type</div>
              <div class="text-sm text-gray-900">{{ selectedSupplier.legal_status }}</div>
            </div>
            <div v-if="selectedSupplier.legal_status === 'Individual'">
              <div class="text-xs font-semibold text-gray-500 mb-1">Legal name</div>
              <div class="text-sm text-gray-900">{{ selectedSupplier.contact_person || '-' }}</div>
            </div>
            <div v-if="selectedSupplier.legal_status === 'Registered'">
              <div class="text-xs font-semibold text-gray-500 mb-1">Business name</div>
              <div class="text-sm text-gray-900">{{ selectedSupplier.business_name }}</div>
            </div>
            <div v-if="selectedSupplier.legal_status === 'Company'">
              <div class="text-xs font-semibold text-gray-500 mb-1">Company name</div>
              <div class="text-sm text-gray-900">{{ selectedSupplier.business_name }}</div>
            </div>
            <div v-if="selectedSupplier.legal_status !== 'Company'">
              <div class="text-xs font-semibold text-gray-500 mb-1">CNIC number</div>
              <div class="text-sm text-gray-900">{{ selectedSupplier.national_id || '-' }}</div>
            </div>
            <div v-if="selectedSupplier.legal_status === 'Company'">
              <div class="text-xs font-semibold text-gray-500 mb-1">Registration number</div>
              <div class="text-sm text-gray-900">{{ selectedSupplier.company_reg_number || '-' }}</div>
            </div>
            <div v-if="selectedSupplier.legal_status === 'Company'">
              <div class="text-xs font-semibold text-gray-500 mb-1">NTN number</div>
              <div class="text-sm text-gray-900">{{ selectedSupplier.ntn_number || '-' }}</div>
            </div>
          </div>

          <!-- Row 3: Category specific -->
          <div class="grid grid-cols-3 gap-4">
            <!-- Tour Operator -->
            <template v-if="selectedSupplier.supplier_type === 'tour_operator'">
              <div>
                <div class="text-xs font-semibold text-gray-500 mb-1">Services offered</div>
                <div class="text-sm text-gray-900">{{ getServicesOffered(selectedSupplier) }}</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-500 mb-1">Serve int'l tourists</div>
                <div class="text-sm text-gray-900">{{ selectedSupplier.details?.serve_international ? 'Yes' : 'No' }}</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-500 mb-1">Address</div>
                <div class="text-sm text-gray-900">{{ selectedSupplier.address || '-' }}</div>
              </div>
            </template>

            <!-- Stay -->
            <template v-if="selectedSupplier.supplier_type === 'stay'">
              <div>
                <div class="text-xs font-semibold text-gray-500 mb-1">Property type</div>
                <div class="text-sm text-gray-900">{{ selectedSupplier.details?.property_type || '-' }}</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-500 mb-1">Number of rooms</div>
                <div class="text-sm text-gray-900">{{ selectedSupplier.details?.room_count || '-' }}</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-500 mb-1">Address</div>
                <div class="text-sm text-gray-900">{{ selectedSupplier.address || '-' }}</div>
              </div>
            </template>

            <!-- Activity Provider -->
            <template v-if="selectedSupplier.supplier_type === 'activity_provider'">
              <div>
                <div class="text-xs font-semibold text-gray-500 mb-1">Type of activity</div>
                <div class="text-sm text-gray-900">{{ selectedSupplier.details?.activity_type || '-' }}</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-500 mb-1">Address</div>
                <div class="text-sm text-gray-900">{{ selectedSupplier.address || '-' }}</div>
              </div>
            </template>

            <!-- Rental -->
            <template v-if="selectedSupplier.supplier_type === 'rental'">
              <div>
                <div class="text-xs font-semibold text-gray-500 mb-1">Rental type</div>
                <div class="text-sm text-gray-900">{{ selectedSupplier.details?.rental_type || '-' }}</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-500 mb-1">Number of {{ selectedSupplier.details?.rental_type === 'Car' ? 'cars' : 'bikes' }}</div>
                <div class="text-sm text-gray-900">{{ selectedSupplier.details?.vehicle_count || '-' }}</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-500 mb-1">Address</div>
                <div class="text-sm text-gray-900">{{ selectedSupplier.address || '-' }}</div>
              </div>
            </template>

            <!-- Tour Guide -->
            <template v-if="selectedSupplier.supplier_type === 'tour_guide'">
              <div>
                <div class="text-xs font-semibold text-gray-500 mb-1">Foreign tourists</div>
                <div class="text-sm text-gray-900">{{ selectedSupplier.details?.serve_international ? 'Yes' : 'No' }}</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-500 mb-1">Guide since</div>
                <div class="text-sm text-gray-900">{{ selectedSupplier.details?.guide_since || '-' }}</div>
              </div>
              <div>
                <div class="text-xs font-semibold text-gray-500 mb-1">Address</div>
                <div class="text-sm text-gray-900">{{ selectedSupplier.address || '-' }}</div>
              </div>
            </template>
          </div>

          <!-- Row 4: Documents -->
          <div>
            <div class="text-xs font-semibold text-gray-500 mb-3">Documents</div>
            <div class="space-y-2">
              <!-- Company Registration (only for Company) -->
              <div v-if="selectedSupplier.legal_status === 'Company' && selectedSupplier.verification_docs?.companyReg" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <span class="text-sm text-gray-700">Company registration certificate</span>
                </div>
                <a :href="selectedSupplier.verification_docs.companyReg" target="_blank" class="text-brand-teal hover:underline text-sm font-medium">View</a>
              </div>

              <!-- DTS License (for Stay, Tour Operator, Guide) -->
              <div v-if="['stay', 'tour_operator', 'tour_guide'].includes(selectedSupplier.supplier_type) && selectedSupplier.verification_docs?.license" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div class="flex items-center gap-3">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 024 24">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
</svg>
<span class="text-sm text-gray-700">DTS License</span>
</div>
<a :href="selectedSupplier.verification_docs.license" target="_blank" class="text-brand-teal hover:underline text-sm font-medium">View</a>
</div>
          <!-- Optional License (for Rental, Activity) -->
          <div v-if="['rental', 'activity_provider'].includes(selectedSupplier.supplier_type) && selectedSupplier.verification_docs?.license" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span class="text-sm text-gray-700">License (Optional)</span>
            </div>
            <a :href="selectedSupplier.verification_docs.license" target="_blank" class="text-brand-teal hover:underline text-sm font-medium">View</a>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="selectedSupplier.status === 'pending'" class="flex gap-3 pt-4 border-t border-gray-200">
        <button 
          @click="openApproveModal"
          class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          Approve
        </button>
        <button 
          @click="openRejectModal"
          class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          Reject
        </button>
      </div>

      <!-- Status Display (if already processed) -->
      <div v-else class="pt-4 border-t border-gray-200">
        <div :class="['p-4 rounded-lg flex items-center gap-3',
                     selectedSupplier.status === 'approved' ? 'bg-green-50' : 'bg-red-50']">
          <svg v-if="selectedSupplier.status === 'approved'" class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <svg v-else class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <div>
            <div :class="['font-medium text-sm', selectedSupplier.status === 'approved' ? 'text-green-900' : 'text-red-900']">
              {{ selectedSupplier.status === 'approved' ? 'Approved' : 'Rejected' }}
            </div>
            <div v-if="selectedSupplier.admin_remarks" class="text-xs text-gray-600 mt-1">{{ selectedSupplier.admin_remarks }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Approve Modal -->
<div v-if="showApproveModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeApproveModal">
  <div class="bg-white rounded-xl max-w-md w-full p-6">
    <h3 class="text-lg font-bold text-gray-900 mb-4">Set commission rate</h3>
    <div class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Commission for {{ getCommissionLabel(selectedSupplier?.supplier_type) }}
      </label>
      <div class="relative">
        <input 
          type="number" 
          v-model="commissionRate" 
          min="0" 
          max="100" 
          step="0.5"
          class="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl focus:border-brand-teal outline-none text-sm">
        <span class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
      </div>
    </div>
    <div class="flex gap-3">
      <button 
        @click="closeApproveModal"
        class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
        Cancel
      </button>
      <button 
        @click="confirmApprove"
        :disabled="isProcessing"
        class="flex-1 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center">
        <span v-if="!isProcessing">Approve</span>
        <svg v-else class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </button>
    </div>
  </div>
</div>

<!-- Reject Modal -->
<div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click.self="closeRejectModal">
  <div class="bg-white rounded-xl max-w-md w-full p-6">
    <h3 class="text-lg font-bold text-gray-900 mb-4">Reject supplier</h3>
    <div class="mb-6">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Reason for rejection
      </label>
      <textarea 
        v-model="rejectRemarks" 
        rows="4"
        placeholder="Enter reason (will be sent to supplier via email)"
        class="w-full px-4 py-3 border-[1.5px] border-gray-200 rounded-xl focus:border-brand-teal outline-none text-sm resize-none"></textarea>
    </div>
    <div class="flex gap-3">
      <button 
        @click="closeRejectModal"
        class="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
        Cancel
      </button>
      <button 
        @click="confirmReject"
        :disabled="isProcessing || !rejectRemarks"
        class="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center">
        <span v-if="!isProcessing">Reject</span>
        <svg v-else class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </button>
    </div>
  </div>
</div>

<!-- Snackbar -->
<div v-if="showSnackbar" class="fixed bottom-6 right-6 z-50 animate-slide-up">
  <div :class="['px-6 py-4 rounded-lg shadow-lg flex items-center gap-3',
                snackbarType === 'success' ? 'bg-green-600' : 'bg-red-600']">
    <svg v-if="snackbarType === 'success'" class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
    </svg>
    <svg v-else class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
    </svg>
    <span class="text-white font-medium">{{ snackbarMessage }}</span>
  </div>
</div>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { adminService } from '@/services/adminService';

const router = useRouter();

// State
const activeTab = ref('new');
const isLoading = ref(false);
const isProcessing = ref(false);

const allSuppliers = ref<any[]>([]);
const newSuppliers = ref<any[]>([]);
const selectedSupplier = ref<any>(null);

const showDetailsModal = ref(false);
const showApproveModal = ref(false);
const showRejectModal = ref(false);

const commissionRate = ref(15);
const rejectRemarks = ref('');

const showSnackbar = ref(false);
const snackbarMessage = ref('');
const snackbarType = ref<'success' | 'error'>('success');

// Computed
const newCount = computed(() => newSuppliers.value.length);

// Methods
const fetchSuppliers = async () => {
  isLoading.value = true;
  try {
    const [all, pending] = await Promise.all([
      adminService.getAllSuppliers(),
      adminService.getPendingSuppliers(),
    ]);
    allSuppliers.value = all;
    newSuppliers.value = pending;
  } catch (error) {
    console.error('Failed to fetch suppliers:', error);
  } finally {
    isLoading.value = false;
  }
};

const openDetailsModal = async (supplierId: string) => {
  try {
    selectedSupplier.value = await adminService.getSupplierDetails(supplierId);
    showDetailsModal.value = true;
  } catch (error) {
    console.error('Failed to fetch supplier details:', error);
  }
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedSupplier.value = null;
};

const openApproveModal = () => {
  commissionRate.value = 15;
  showApproveModal.value = true;
};

const closeApproveModal = () => {
  showApproveModal.value = false;
};

const openRejectModal = () => {
  rejectRemarks.value = '';
  showRejectModal.value = true;
};

const closeRejectModal = () => {
  showRejectModal.value = false;
};

const confirmApprove = async () => {
  if (!selectedSupplier.value) return;

  isProcessing.value = true;
  try {
    const commissionType = getCommissionType(selectedSupplier.value.supplier_type);
    await adminService.approveSupplier(
      selectedSupplier.value.id,
      commissionRate.value,
      commissionType
    );

    showSnackbar.value = true;
    snackbarType.value = 'success';
    snackbarMessage.value = 'Supplier approved successfully';

    setTimeout(() => {
      showSnackbar.value = false;
    }, 3000);

    closeApproveModal();
    closeDetailsModal();
    fetchSuppliers();
  } catch (error: any) {
    console.error('Approval failed:', error);
    showSnackbar.value = true;
    snackbarType.value = 'error';
    snackbarMessage.value = 'Failed to approve supplier';
    setTimeout(() => {
      showSnackbar.value = false;
    }, 3000);
  } finally {
    isProcessing.value = false;
  }
};

const confirmReject = async () => {
  if (!selectedSupplier.value || !rejectRemarks.value) return;

  isProcessing.value = true;
  try {
    await adminService.rejectSupplier(selectedSupplier.value.id, rejectRemarks.value);

    showSnackbar.value = true;
    snackbarType.value = 'success';
    snackbarMessage.value = 'Supplier rejected';

    setTimeout(() => {
      showSnackbar.value = false;
    }, 3000);

    closeRejectModal();
    
    // Update the supplier in the modal
    selectedSupplier.value.status = 'rejected';
    selectedSupplier.value.admin_remarks = rejectRemarks.value;
    
    fetchSuppliers();
  } catch (error: any) {
    console.error('Rejection failed:', error);
    showSnackbar.value = true;
    snackbarType.value = 'error';
    snackbarMessage.value = 'Failed to reject supplier';
    setTimeout(() => {
      showSnackbar.value = false;
    }, 3000);
  } finally {
    isProcessing.value = false;
  }
};

const viewProfile = (supplierId: string) => {
  // TODO: Navigate to profile page (next phase)
  console.log('View profile:', supplierId);
};

const getCategoryLabel = (type: string) => {
  const map: Record<string, string> = {
    'stay': 'Stay',
    'tour_operator': 'Tour operator',
    'rental': 'Rental',
    'activity_provider': 'Activity provider',
    'tour_guide': 'Tour guide',
  };
  return map[type] || type;
};

const getCommissionLabel = (type: string) => {
  const map: Record<string, string> = {
    'stay': 'rooms',
    'tour_operator': 'tours & treks',
    'rental': 'cars & bikes',
    'activity_provider': 'activities',
    'tour_guide': 'experiences',
  };
  return map[type] || 'listings';
};

const getCommissionType = (type: string) => {
  const map: Record<string, string> = {
    'stay': 'room',
    'tour_operator': 'tour',
    'rental': 'rental',
    'activity_provider': 'activity',
    'tour_guide': 'experience',
  };
  return map[type] || 'default';
};

const getServicesOffered = (supplier: any) => {
  // TODO: Map attribute IDs to names
  return 'Tours, Treks';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Lifecycle
onMounted(() => {
  fetchSuppliers();
});
</script>
<style scoped>
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>