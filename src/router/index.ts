import { createRouter, createWebHistory } from 'vue-router';
import { supabase } from '@/lib/supabase';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/admin/login',
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/Login.vue'),
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAdmin: true },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: () => import('@/views/admin/Dashboard.vue'),
        },
        {
          path: 'suppliers',
          name: 'admin-suppliers',
          component: () => import('@/views/admin/Suppliers.vue'),
        },
        {
          path: 'suppliers/:id',
          name: 'supplier-profile',
          component: () => import('@/views/admin/SupplierProfile.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/admin/login',
    },
  ],
});

// Auth guard
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAdmin) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return next('/admin/login');
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (profile?.role !== 'admin') return next('/admin/login');
  }
  next();
});

export default router;