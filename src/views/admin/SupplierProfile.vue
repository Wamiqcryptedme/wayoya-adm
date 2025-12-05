<template>
  <div class="flex-1 overflow-y-auto pb-[200px]">
    
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-[500px]">
      <div class="text-center">
        <div class="w-12 h-12 border-4 border-brand-tealLight border-t-brand-teal rounded-full animate-spin mx-auto mb-4"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-[500px]">
      <div class="text-center">
        <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </div>
        <p class="text-red-500 font-medium">{{ error }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else>
      <!-- Page Title -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-brand-dark mb-6">Supplier</h1>
      </div>

      <!-- Main Card -->
      <div class="bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[500px]">
        
        <!-- Header Component -->
        <SupplierHeader 
          :supplier="supplier"
          :active-tab="activeTab"
          @suspend="openSuspendModal"
          @tab-change="activeTab = $event"
        />

        <!-- Tab Content -->
        <div class="p-6">
          
          <!-- Details Tab -->
          <DetailsTab 
            v-if="activeTab === 'Details'"
            :supplier="supplier"
            @edit="openEditDetailsModal"
          />

          <!-- Finance Tab -->
          <FinanceTab 
            v-if="activeTab === 'Finance'"
            :supplier="supplier"
            @save="updateBankDetails"
          />

          <!-- Other Tab -->
          <OtherTab 
            v-if="activeTab === 'Other'"
            :supplier="supplier"
            @edit="openEditOtherModal"
          />

          <!-- Property Tab -->
          <PropertyTab 
            v-if="activeTab === 'Property'"
            :supplier="supplier"
            @edit="openEditPropertyModal"
            @delete-photo="openDeletePhotoModal"
          />

        </div>
      </div>
    </div>

    <!-- Modals -->
    <EditDetailsModal 
      v-if="modals.editDetails"
      :supplier="supplier"
      :places="places"
      @close="modals.editDetails = false"
      @save="saveDetails"
    />

    <EditOtherModal 
  v-if="modals.editOther"
  :supplier="supplier"
  :activity-types="activityTypes"
  @close="modals.editOther = false"
  @save="saveOther"
/>

<EditPropertyModal 
  v-if="modals.editProperty"
  :supplier="supplier"
  :property-types="propertyTypes"
  @close="modals.editProperty = false"
  @save="saveProperty"
/>

    <SuspendModal 
      v-if="modals.suspend"
      :supplier="supplier"
      @close="modals.suspend = false"
      @confirm="suspendSupplier"
    />

    <DeletePhotoModal 
      v-if="modals.deletePhoto"
      :photo-url="selectedPhoto"
      @close="modals.deletePhoto = false"
      @confirm="deletePhoto"
    />

    <!-- Snackbar -->
    <transition name="slide-up">
      <div v-if="snackbar.show" class="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white text-brand-dark border px-6 py-3 rounded-xl shadow-lg z-[120] flex items-center gap-3">
        <div class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-green-100 text-green-600">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <span class="text-sm font-medium">{{ snackbar.message }}</span>
      </div>
    </transition>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { supabase } from '@/lib/supabase';
import SupplierHeader from '@/views/admin/components/SupplierHeader.vue';
import DetailsTab from '@/views/admin/components/tabs/DetailsTab.vue';
import FinanceTab from '@/views/admin/components/tabs/FinanceTab.vue';
import OtherTab from '@/views/admin/components/tabs/OtherTab.vue';
import PropertyTab from '@/views/admin/components/tabs/PropertyTab.vue';
import EditDetailsModal from '@/views/admin/components/modals/EditDetailsModal.vue';
import EditOtherModal from '@/views/admin/components/modals/EditOtherModal.vue';
import EditPropertyModal from '@/views/admin/components/modals/EditPropertyModal.vue';
import SuspendModal from '@/views/admin/components/modals/SuspendModal.vue';
import DeletePhotoModal from '@/views/admin/components/modals/DeletePhotoModal.vue';

const route = useRoute();

// State
const isLoading = ref(true);
const error = ref('');
const activeTab = ref('Details');
const supplier = ref<any>(null);
const places = ref<any[]>([]);
const selectedPhoto = ref('');
const propertyTypes = ref<any[]>([]);  // ADD THIS
const activityTypes = ref<any[]>([]);  // ADD THIS

const modals = reactive({
  editDetails: false,
  editOther: false,
  editProperty: false,
  suspend: false,
  deletePhoto: false
});

const snackbar = reactive({
  show: false,
  message: ''
});

// Fetch supplier data
const fetchSupplier = async () => {
  try {
    isLoading.value = true;
    error.value = '';

    const supplierId = route.params.id as string;

    const { data, error: fetchError } = await supabase
      .from('suppliers')
      .select(`
        *,
        place:places(id, name),
        profile:profiles!inner(email)
      `)
      .eq('id', supplierId)
      .single();

    if (fetchError) throw fetchError;

    supplier.value = {
      ...data,
      email: data.profile.email,
      place_name: data.place?.name || null
    };

  } catch (err: any) {
    console.error('Failed to fetch supplier:', err);
    error.value = 'Failed to load supplier details';
  } finally {
    isLoading.value = false;
  }
};

// Fetch places for dropdown
const fetchPlaces = async () => {
  try {
    const { data } = await supabase
      .from('places')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (data) places.value = data;
  } catch (err) {
    console.error('Failed to fetch places:', err);
  }
};

// Add this function after fetchSupplier (around line 203)
const enrichSupplierWithAttributeNames = async () => {
  if (!supplier.value?.details) return;
  
  try {
    // Fetch property type name if exists
    if (supplier.value.details.property_type_id) {
      const { data: propertyType } = await supabase
        .from('attributes')
        .select('name')
        .eq('id', supplier.value.details.property_type_id)
        .single();
      
      if (propertyType) {
        supplier.value.details.property_type_name = propertyType.name;
      }
    }
    
    // Fetch activity type name if exists
    if (supplier.value.details.activity_type_id) {
      const { data: activityType } = await supabase
        .from('attributes')
        .select('name')
        .eq('id', supplier.value.details.activity_type_id)
        .single();
      
      if (activityType) {
        supplier.value.details.activity_type_name = activityType.name;
      }
    }
  } catch (err) {
    console.error('Failed to fetch attribute names:', err);
  }
};

// ADD THIS FUNCTION
const fetchAttributes = async () => {
  try {
    const [propertyTypesData, activityTypesData] = await Promise.all([
      supabase
        .from('attributes')
        .select('*')
        .eq('category', 'property_type')
        .eq('is_active', true)
        .order('name'),
      supabase
        .from('attributes')
        .select('*')
        .eq('category', 'activity_type')
        .eq('is_active', true)
        .order('name')
    ]);

    if (propertyTypesData.data) propertyTypes.value = propertyTypesData.data;
    if (activityTypesData.data) activityTypes.value = activityTypesData.data;
  } catch (err) {
    console.error('Failed to fetch attributes:', err);
  }
};

// Modal handlers
const openEditDetailsModal = () => {
  modals.editDetails = true;
};

const openEditOtherModal = () => {
  modals.editOther = true;
};

const openEditPropertyModal = () => {
  modals.editProperty = true;
};

const openSuspendModal = () => {
  modals.suspend = true;
};

const openDeletePhotoModal = (photoUrl: string) => {
  selectedPhoto.value = photoUrl;
  modals.deletePhoto = true;
};

// Save handlers
const saveDetails = async (updatedData: any) => {
  try {
    const { error: updateError } = await supabase
      .from('suppliers')
      .update(updatedData)
      .eq('id', supplier.value.id);

    if (updateError) throw updateError;

    // Update local state
    Object.assign(supplier.value, updatedData);
    
    modals.editDetails = false;
    showSnackbar('Details updated successfully');
    
    // Refresh to get updated place name
    await fetchSupplier();
  } catch (err: any) {
    console.error('Failed to update details:', err);
    alert('Failed to update details');
  }
};

const updateBankDetails = async (bankData: any) => {
  try {
    const { error: updateError } = await supabase
      .from('suppliers')
      .update({ bank_details: bankData })
      .eq('id', supplier.value.id);

    if (updateError) throw updateError;

    supplier.value.bank_details = bankData;
    showSnackbar('Bank details updated successfully');
  } catch (err: any) {
    console.error('Failed to update bank details:', err);
    alert('Failed to update bank details');
  }
};

const saveOther = async (updatedData: any) => {
  try {
    const { error: updateError } = await supabase
      .from('suppliers')
      .update(updatedData)
      .eq('id', supplier.value.id);

    if (updateError) throw updateError;

    Object.assign(supplier.value, updatedData);
    
    // Re-fetch attribute names after save
    await enrichSupplierWithAttributeNames();
    
    modals.editOther = false;
    showSnackbar('Settings updated successfully');
  } catch (err: any) {
    console.error('Failed to update settings:', err);
    alert('Failed to update settings');
  }
};

const saveProperty = async (updatedDetails: any) => {
  try {
    const { error: updateError } = await supabase
      .from('suppliers')
      .update({ details: updatedDetails })
      .eq('id', supplier.value.id);

    if (updateError) throw updateError;

    supplier.value.details = updatedDetails;
    
    // Re-fetch attribute names after save
    await enrichSupplierWithAttributeNames();
    
    modals.editProperty = false;
    showSnackbar('Property details updated successfully');
  } catch (err: any) {
    console.error('Failed to update property:', err);
    alert('Failed to update property details');
  }
};

const suspendSupplier = async () => {
  try {
    const { error: updateError } = await supabase
      .from('suppliers')
      .update({ status: 'suspended' })
      .eq('id', supplier.value.id);

    if (updateError) throw updateError;

    supplier.value.status = 'suspended';
    
    modals.suspend = false;
    showSnackbar('Supplier suspended successfully');
  } catch (err: any) {
    console.error('Failed to suspend supplier:', err);
    alert('Failed to suspend supplier');
  }
};

const deletePhoto = async () => {
  try {
    const updatedPhotos = supplier.value.details.property_photos.filter(
      (url: string) => url !== selectedPhoto.value
    );

    const updatedDetails = {
      ...supplier.value.details,
      property_photos: updatedPhotos
    };

    const { error: updateError } = await supabase
      .from('suppliers')
      .update({ details: updatedDetails })
      .eq('id', supplier.value.id);

    if (updateError) throw updateError;

    supplier.value.details.property_photos = updatedPhotos;
    
    modals.deletePhoto = false;
    showSnackbar('Photo deleted successfully');
  } catch (err: any) {
    console.error('Failed to delete photo:', err);
    alert('Failed to delete photo');
  }
};

const showSnackbar = (message: string) => {
  snackbar.message = message;
  snackbar.show = true;
  setTimeout(() => {
    snackbar.show = false;
  }, 3000);
};

// Set initial tab based on supplier type
const setInitialTab = () => {
  // Property tab only for stays
  if (supplier.value.supplier_type === 'stay') {
    // Keep Details as default
  }
};

onMounted(async () => {
  await fetchSupplier();
  await fetchPlaces();
  await enrichSupplierWithAttributeNames();
  await fetchAttributes();  // ADD THIS
  setInitialTab();
});
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s ease-out;
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>