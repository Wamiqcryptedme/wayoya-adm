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

    // Verify admin role
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
   * Get all suppliers (for "All" tab)
   */
  async getAllSuppliers() {
    const { data, error } = await supabase
      .from('suppliers')
      .select(`
        *,
        profiles!inner(email, full_name),
        places(name)
      `)
      .in('status', ['approved', 'suspended'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get pending suppliers (for "New" tab)
   */
  async getPendingSuppliers() {
    const { data, error } = await supabase
      .from('suppliers')
      .select(`
        *,
        profiles!inner(email, full_name),
        places(name)
      `)
      .in('status', ['pending', 'rejected'])
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get single supplier details
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
   * Approve supplier with commission rates
   */
  async approveSupplier(supplierId: string, commissions: Record<string, number>) {
    const { error } = await supabase
      .from('suppliers')
      .update({
        status: 'approved',
        commission_rates: commissions,
        admin_remarks: null,
      })
      .eq('id', supplierId);

    if (error) throw error;

    // Trigger approval email
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      await fetch(`${supabaseUrl}/functions/v1/send-approval-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplierId, commissions }),
      });
    } catch (emailError) {
      console.error('Email trigger failed:', emailError);
      // Don't throw - supplier is already approved
    }

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
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      await fetch(`${supabaseUrl}/functions/v1/send-rejection-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplierId, remarks }),
      });
    } catch (emailError) {
      console.error('Email trigger failed:', emailError);
    }

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