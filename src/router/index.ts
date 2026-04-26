import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/signin', component: () => import('@/views/auth/SignInView.vue'), meta: { public: true, guestOnly: true } },
    { path: '/signup', component: () => import('@/views/auth/SignUpView.vue'), meta: { public: true, guestOnly: true } },
    {
      path: '/',
      component: () => import('@/components/layout/AuthenticatedLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '/home', component: () => import('@/views/HomeView.vue') },
        { path: '/books', component: () => import('@/views/books/BooksListView.vue'), meta: { roles: ['USER', 'ADMIN'] } },
        { path: '/books/new', component: () => import('@/views/books/BookCreateView.vue'), meta: { roles: ['USER', 'ADMIN'] } },
        { path: '/books/:id', component: () => import('@/views/books/BookDetailsView.vue'), meta: { roles: ['USER', 'ADMIN'] } },
        { path: '/books/:id/edit', component: () => import('@/views/books/BookEditView.vue'), meta: { roles: ['USER', 'ADMIN'] } },
        { path: '/me', component: () => import('@/views/MeView.vue') }
      ]
    },
    { path: '/404', component: () => import('@/views/NotFoundView.vue'), meta: { public: true } },
    { path: '/error', component: () => import('@/views/ErrorView.vue'), meta: { public: true } },
    { path: '/:pathMatch(.*)*', redirect: '/404' }
  ]
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  auth.init();
  if (to.meta.guestOnly && auth.isAuthenticated) return '/home';
  if (to.meta.public) return true;
  if (!auth.isAuthenticated) return '/signin';
  const roles = (to.meta.roles as string[] | undefined) ?? [];
  if (roles.length > 0 && !roles.some((r) => auth.roles.includes(r))) {
    return '/error?code=403&message=No%20permissions';
  }
  return true;
});

export default router;
