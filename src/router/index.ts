import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'courses',
      component: () => import('@/views/CoursesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/courses/:courseId/locations',
      name: 'locations',
      component: () => import('@/views/LocationsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/locations/:locationId/exams',
      name: 'exams',
      component: () => import('@/views/ExamsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import('@/views/UsersView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach(async (to, _, next) => {
  const authStore = useAuthStore()

  // Wait for auth to initialize on first load
  if (authStore.loading) {
    await authStore.initialize()
  }

  const requiresAuth = to.meta.requiresAuth !== false

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'courses' })
  } else {
    next()
  }
})

export default router
