import { supabase } from '@/lib/supabase';

export const adminService = {
  /**
   * Admin login
   */
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Verify user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single();

    if (profileError) throw profileError;

    if (profile.role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error('Unauthorized: Admin access required');
    }

    return data;
  },

  /**
   * Get all suppliers
   */
  async getSupplierDetails(supplierId: string) {
  const { data, error } = await supabase
    .from('suppliers')
    .select(`
      *,
      profiles!inner(email, full_name),
      places(name)
    `)
    .eq('id', supplierId)
    .single();

  if (error) throw error;
  return data;
},

/**
 * Approve supplier with commission
 */
async approveSupplier(supplierId: string, commissionRate: number, commissionType: string) {
  const { error } = await supabase
    .from('suppliers')
    .update({ 
      status: 'approved',
      commission_rates: { [commissionType]: commissionRate },
      admin_remarks: null,
    })
    .eq('id', supplierId);

  if (error) throw error;

  // Trigger approval email
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  await fetch(`${supabaseUrl}/functions/v1/send-approval-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ supplierId, commissionRate, commissionType }),
  });

  return { success: true };
},

/**
 * Reject supplier with remarks
 */
async rejectSupplier(supplierId: string, remarks: string) {
  const { error } = await supabase
    .from('suppliers')
    .update({ 
      status: 'rejected',
      admin_remarks: remarks,
    })
    .eq('id', supplierId);

  if (error) throw error;

  // Trigger rejection email
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  await fetch(`${supabaseUrl}/functions/v1/send-rejection-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ supplierId, remarks }),
  });

  return { success: true };
},

  /**
   * Logout
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};