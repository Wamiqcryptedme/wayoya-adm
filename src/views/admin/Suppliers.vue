<template>
  <div>
    <!-- Page Title & Tabs -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-brand-dark mb-6">Suppliers</h1>
      
      <!-- Tabs -->
      <div class="flex flex-wrap gap-3">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          @click="activeTab = tab.value"
          :class="['px-5 py-2 rounded-xl text-sm font-semibold transition-colors', 
              activeTab === tab.value 
              ? 'bg-brand-teal text-white' 
              : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200']">
          {{ tab.label }}
        </button>
        
        <!-- Download CSV -->
        <button class="hidden sm:flex ml-auto items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-brand-dark hover:bg-gray-50 transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
          </svg>
          Download CSV
        </button>
      </div>
    </div>

    <!-- Main Card -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col min-h-[500px]">
      
      <!-- Toolbar -->
      <div class="p-4 md:p-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <h2 class="text-lg font-bold text-brand-dark hidden md:block">Suppliers</h2>
        
        <div class="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <!-- Search -->
          <div class="relative w-full sm:w-64">
            <span class="absolute left-3 top-2.5 text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </span>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search by ID, name, or category" 
              class="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal transition-colors"
            >
          </div>
          
          <div class="flex gap-3">
            <!-- Filter -->
            <div class="relative">
              <button 
                @click="isFilterOpen = !isFilterOpen"
                class="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-brand-dark hover:bg-gray-50 transition-colors w-full sm:w-auto">
                <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                </svg>
                Filters
              </button>

              <!-- Filter Menu -->
              <transition name="fade">
                <div v-if="isFilterOpen" class="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-menu border border-gray-200 p-4 z-50">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="font-bold text-lg text-brand-dark">Filter</h3>
                  </div>
                  
                  <!-- Category -->
                  <div class="mb-4">
                    <label class="block text-sm font-semibold text-gray-500 mb-2">Category</label>
                    <div class="flex flex-wrap gap-2">
                      <button 
                        v-for="cat in categories" 
                        :key="cat.value" 
                        @click="toggleFilter('category', cat.value)" 
                        :class="['px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors', 
                                 filters.category === cat.value ? 'bg-brand-teal border-brand-teal text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300']">
                        {{ cat.label }}
                      </button>
                    </div>
                  </div>

                  <!-- Status -->
                  <div class="mb-2">
                    <label class="block text-sm font-semibold text-gray-500 mb-2">Status</label>
                    <div class="flex flex-wrap gap-2">
                      <button 
                        v-for="stat in currentTabStatuses" 
                        :key="stat.value" 
                        @click="toggleFilter('status', stat.value)" 
                        :class="['px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors', 
                                 filters.status === stat.value ? 'bg-brand-teal border-brand-teal text-white' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300']">
                        {{ stat.label }}
                      </button>
                    </div>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Sort -->
            <div class="relative">
              <button 
                @click="isSortOpen = !isSortOpen"
                class="flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-brand-dark hover:bg-gray-50 transition-colors w-full sm:w-auto">
                <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path>
                </svg>
                Sort by
              </button>

              <!-- Sort Menu -->
              <transition name="fade">
                <div v-if="isSortOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-menu border border-gray-100 p-4 z-50">
                  <h3 class="font-bold text-lg text-brand-dark mb-3">Sort by</h3>
                  
                  <div class="mb-2">
                    <label class="block text-sm font-semibold text-gray-500 mb-2">Joined</label>
                    <div class="flex flex-wrap gap-2">
                      <button 
                        @click="setSort('date', 'desc')" 
                        :class="['px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors', 
                                 sort.field === 'date' && sort.dir === 'desc' ? 'bg-brand-teal border-brand-teal text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50']">
                        Newest
                      </button>
                      <button 
                        @click="setSort('date', 'asc')" 
                        :class="['px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors', 
                                 sort.field === 'date' && sort.dir === 'asc' ? 'bg-brand-teal border-brand-teal text-white' : 'border-gray-200 text-gray-600 hover:bg-gray-50']">
                        Oldest
                      </button>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex-1 flex items-center justify-center py-12">
        <div class="w-8 h-8 border-4 border-[#e6f5f3] border-t-brand-teal rounded-full animate-spin"></div>
      </div>

      <!-- Table -->
      <div v-else class="overflow-x-auto flex-1">
        <table class="w-full text-left border-collapse whitespace-nowrap">
          <thead class="bg-white sticky top-0 z-10">
            <tr class="text-xs text-gray-400 border-b border-gray-200">
              <th class="py-4 px-6 font-medium">ID</th>
              <th class="py-4 px-6 font-medium">Joined</th>
              <th class="py-4 px-6 font-medium">Category</th>
              <th class="py-4 px-6 font-medium">Name</th>
              <th class="py-4 px-6 font-medium">Location</th>
              <th v-if="activeTab === 'All'" class="py-4 px-6 font-medium">Listings</th>
              <th v-if="activeTab === 'All'" class="py-4 px-6 font-medium">Bookings</th>
              <th v-if="activeTab === 'New'" class="py-4 px-6 font-medium">Operates as</th>
              <th class="py-4 px-6 font-medium">Status</th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <tr 
  v-for="supplier in paginatedSuppliers"
  :key="supplier.id" 
  @click="handleRowClick(supplier)"
  class="border-b border-gray-200 hover:bg-gray-50/80 transition-colors cursor-pointer">
              <td class="py-4 px-6 font-medium text-brand-text">{{ supplier.id.substring(0, 8) }}</td>
              <td class="py-4 px-6 text-gray-500">{{ formatDate(supplier.created_at) }}</td>
              <td class="py-4 px-6 font-medium text-brand-dark">{{ getCategoryLabel(supplier.supplier_type) }}</td>
              <td class="py-4 px-6 text-brand-text">{{ supplier.business_name }}</td>
              <td class="py-4 px-6 text-brand-text">{{ supplier.places?.name || '-' }}</td>
              <template v-if="activeTab === 'All'">
                <td class="py-4 px-6 text-brand-dark">0</td>
                <td class="py-4 px-6 text-brand-dark">0</td>
              </template>
              <template v-else>
                <td class="py-4 px-6 text-brand-dark">{{ supplier.legal_status }}</td>
              </template>
              <td class="py-4 px-6">
                <span :class="['text-sm font-semibold', getStatusColor(supplier.status)]">
                  {{ getStatusLabel(supplier.status) }}
                </span>
              </td>
            </tr>
            
            <!-- Empty State -->
            <tr v-if="filteredSuppliers.length === 0">
              <td :colspan="activeTab === 'All' ? 8 : 7" class="py-12 text-center text-gray-400">
                No suppliers found matching your criteria.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <!-- Pagination -->
<div class="p-4 border-t border-gray-100 flex items-center justify-between shrink-0 bg-white">
  <span class="text-xs text-gray-400">
    Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} - 
    {{ Math.min(currentPage * itemsPerPage, filteredSuppliers.length) }} 
    of {{ filteredSuppliers.length }}
  </span>
  <div class="flex gap-2">
    <button 
      @click="prevPage"
      :disabled="currentPage === 1"
      class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
    </button>
    
    <!-- Page Numbers -->
    <template v-for="page in totalPages" :key="page">
      <button 
        v-if="page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)"
        @click="goToPage(page)"
        :class="['w-8 h-8 flex items-center justify-center rounded-lg font-medium transition-colors',
                 currentPage === page ? 'text-brand' : 'hover:bg-gray-100 text-gray-600']">
        {{ page }}
      </button>
      <span v-else-if="page === currentPage - 2 || page === currentPage + 2" class="w-8 h-8 flex items-center justify-center text-gray-400">
        ...
      </span>
    </template>
    
    <button 
      @click="nextPage"
      :disabled="currentPage === totalPages"
      class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
      </svg>
    </button>
  </div>
</div>
    </div>

    <!-- Modals -->
    <SupplierDetailsModal 
      :show="showDetailsModal"
      :supplier="selectedSupplier"
      @close="closeDetailsModal"
      @approve="openApproveModal"
      @reject="openRejectModal"
    />

    <ApproveModal 
      :show="showApproveModal"
      :category="selectedSupplier?.supplier_type"
      :rental-type="selectedSupplier?.details?.rental_type"
      @close="closeApproveModal"
      @confirm="handleApprove"
    />

    <RejectModal 
      :show="showRejectModal"
      @close="closeRejectModal"
      @confirm="handleReject"
    />

    <!-- Snackbar -->
    <Snackbar 
      :show="snackbar.show"
      :message="snackbar.message"
      :type="snackbar.type"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { adminService } from '@/services/adminService';
import { useRouter } from 'vue-router';
import SupplierDetailsModal from '@/components/admin/SupplierDetailsModal.vue';
import ApproveModal from '@/components/admin/ApproveModal.vue';
import RejectModal from '@/components/admin/RejectModal.vue';
import Snackbar from '@/components/admin/Snackbar.vue';

// Router
const router = useRouter();

// State
const activeTab = ref('All');
const tabs = [
  { label: 'All', value: 'All' },
  { label: 'New', value: 'New' }
];

const searchQuery = ref('');
const isFilterOpen = ref(false);
const isSortOpen = ref(false);
const isLoading = ref(false);

// NEW: Add these here ⬇️
const currentPage = ref(1);
const itemsPerPage = ref(10);

const filters = ref({
  category: null as string | null,
  status: null as string | null,
});
const categories = [
{ label: 'Tour operator', value: 'tour_operator' },
{ label: 'Stay', value: 'stay' },
{ label: 'Activity provider', value: 'activity_provider' },
{ label: 'Rental', value: 'rental' },
{ label: 'Tour guide', value: 'tour_guide' },
];
const currentTabStatuses = computed(() => {
return activeTab.value === 'All'
? [
{ label: 'Live', value: 'approved' },
{ label: 'Deactivated', value: 'suspended' }
]
: [
{ label: 'Pending', value: 'pending' },
{ label: 'Rejected', value: 'rejected' },
{ label: 'Approved', value: 'approved' }
];
});
const sort = ref({
field: 'date',
dir: 'desc' as 'asc' | 'desc'
});
// Data
const allSuppliers = ref<any[]>([]);
const newSuppliers = ref<any[]>([]);
// Modals
const showDetailsModal = ref(false);
const showApproveModal = ref(false);
const showRejectModal = ref(false);
const selectedSupplier = ref<any>(null);
// Snackbar
const snackbar = ref({
show: false,
message: '',
type: 'success' as 'success' | 'error'
});

// Computed
const filteredSuppliers = computed(() => {
let result = activeTab.value === 'All' ? allSuppliers.value : newSuppliers.value;
// Search
if (searchQuery.value) {
const q = searchQuery.value.toLowerCase();
result = result.filter(s =>
s.id.toLowerCase().includes(q) ||
s.business_name.toLowerCase().includes(q) ||
s.supplier_type.toLowerCase().includes(q)
);
}
// Filters
if (filters.value.category) {
result = result.filter(s => s.supplier_type === filters.value.category);
}
if (filters.value.status) {
result = result.filter(s => s.status === filters.value.status);
}
// Sort
if (sort.value.field === 'date') {
result = [...result].sort((a, b) => {
const dateA = new Date(a.created_at).getTime();
const dateB = new Date(b.created_at).getTime();
return sort.value.dir === 'asc' ? dateA - dateB : dateB - dateA;
});
}
return result;
});
const paginatedSuppliers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredSuppliers.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredSuppliers.value.length / itemsPerPage.value);
});
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
showSnackbarMessage('Failed to load suppliers', 'error');
} finally {
isLoading.value = false;
}
};
const handleRowClick = async (supplier: any) => {
if (activeTab.value === 'New') {
try {
selectedSupplier.value = await adminService.getSupplierDetails(supplier.id);
showDetailsModal.value = true;
} catch (error) {
console.error('Failed to fetch supplier details:', error);
showSnackbarMessage('Failed to load supplier details', 'error');
}
 } else {
    // Navigate to supplier profile page
    router.push({ name: 'supplier-profile', params: { id: supplier.id } });
  }
};
const closeDetailsModal = () => {
showDetailsModal.value = false;
};
const openApproveModal = () => {
  showDetailsModal.value = false;  // ✅ Close details modal first
  showApproveModal.value = true;
};

const closeApproveModal = () => {
  showApproveModal.value = false;
};

const openRejectModal = () => {
  showDetailsModal.value = false;  // ✅ Close details modal first
  showRejectModal.value = true;
};

const closeRejectModal = () => {
  showRejectModal.value = false;
};
const handleApprove = async (commissions: Record<string, number>) => {
  if (!selectedSupplier.value) return;
  try {
    // 1. Approve the supplier in database
    await adminService.approveSupplier(selectedSupplier.value.id, commissions);
    
    // 2. Send approval email
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-approval-email`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ 
          supplierId: selectedSupplier.value.id,
          commissions: commissions
        }),
      });
      
      if (!emailResponse.ok) {
        console.error('Email sending failed:', await emailResponse.text());
        // Don't throw - we still want to show success since approval worked
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't throw - approval was successful, just email failed
    }
    
    showSnackbarMessage('Supplier approved successfully', 'success');
    closeApproveModal();
    closeDetailsModal();
    fetchSuppliers();
  } catch (error: any) {
    console.error('Approval failed:', error);
    showSnackbarMessage('Failed to approve supplier', 'error');
  }
};
const handleReject = async (remarks: string) => {
  if (!selectedSupplier.value) return;
  try {
    // 1. Reject the supplier in database
    await adminService.rejectSupplier(selectedSupplier.value.id, remarks);
    
    // 2. Send rejection email
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const emailResponse = await fetch(`${supabaseUrl}/functions/v1/send-rejection-email`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ 
          supplierId: selectedSupplier.value.id,
          remarks: remarks
        }),
      });
      
      if (!emailResponse.ok) {
        console.error('Email sending failed:', await emailResponse.text());
        // Don't throw - we still want to show success since rejection worked
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Don't throw - rejection was successful, just email failed
    }
    
    showSnackbarMessage('Supplier rejected', 'success');
    closeRejectModal();
    
    // Update local state
    selectedSupplier.value.status = 'rejected';
    selectedSupplier.value.admin_remarks = remarks;
    
    fetchSuppliers();
  } catch (error: any) {
    console.error('Rejection failed:', error);
    showSnackbarMessage('Failed to reject supplier', 'error');
  }
};
const toggleFilter = (key: string, value: string) => {
if (key === 'category') {
filters.value.category = filters.value.category === value ? null : value;
} else {
filters.value.status = filters.value.status === value ? null : value;
}
};
const setSort = (field: string, dir: 'asc' | 'desc') => {
sort.value = { field, dir };
isSortOpen.value = false;
};
const showSnackbarMessage = (message: string, type: 'success' | 'error' = 'success') => {
snackbar.value = { show: true, message, type };
setTimeout(() => {
snackbar.value.show = false;
}, 3000);
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
const getStatusLabel = (status: string) => {
if (status === 'approved') return 'Live';
if (status === 'suspended') return 'Suspended';
return status.charAt(0).toUpperCase() + status.slice(1);
};
const getStatusColor = (status: string) => {
switch(status) {
case 'approved': return 'text-[#10b981]';
case 'suspended': return 'text-[#b23939]';
case 'rejected': return 'text-[#ef4444]';
case 'pending': return 'text-[#fe9705]';
default: return 'text-gray-500';
}
};
const formatDate = (dateString: string) => {
const date = new Date(dateString);
return date.toLocaleDateString('en-GB', {
day: '2-digit',
month: '2-digit',
year: 'numeric',
hour: '2-digit',
minute: '2-digit',
hour12: true
}).replace(',', '');
};

// NEW: Pagination methods
const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Reset to page 1 when filters/search/tab changes
watch([searchQuery, filters, activeTab], () => {
  currentPage.value = 1;
}, { deep: true });

// Lifecycle
onMounted(() => {
fetchSuppliers();
});
</script>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

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

@media (max-width: 524px) {
        ::-webkit-scrollbar { width: 0px; height: 6px; }
        }
</style>