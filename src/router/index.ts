import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  { path: '/login', name: 'login', component: () => import('@/pages/Login.vue'), meta: { public: true } },  
  { path: '/', component: () => import('@/pages/Test.vue') },
  { path: '/applications', component: () => import('@/pages/ApplicationsList.vue'), meta: { roles: ['Sales','Admin','Accounting','L1Manager','L2Manager','StationManager'] } },
  { path: '/applications/new', component: () => import('@/pages/ApplicationEdit.vue'), meta: { roles: ['Sales'] } },
  { path: '/applications/:id/edit', component: () => import('@/pages/ApplicationEdit.vue'), meta: { roles: ['Sales'] } },
  { path: '/applications/:id', component: () => import('@/pages/ApplicationDetail.vue'), meta: { roles: ['Sales','Admin','Accounting','L1Manager','L2Manager','StationManager'] } },
  { path: '/applications/:id/referrals', component: () => import('@/pages/ApplicationReferrals.vue'), meta: { roles: ['Accounting','Admin'] } },
  { path: '/reviews/l1', component: () => import('@/pages/ReviewsL1.vue'), meta: { roles: ['L1Manager'] } },
  { path: '/reviews/l2', component: () => import('@/pages/ReviewsL2.vue'), meta: { roles: ['L2Manager'] } },
  { path: '/reviews/station', component: () => import('@/pages/ReviewsStation.vue'), meta: { roles: ['StationManager'] } },
  { path: '/letters/preview', component: () => import('@/pages/LettersPreview.vue'), meta: { roles: ['Sales','Admin','L1Manager','L2Manager'] } },
  { path: '/diagnostics', component: () => import('@/pages/Diagnostics.vue'), meta: { roles: ['Admin'] } },
  { path: '/settings/i18n', component: () => import('@/pages/SettingsI18n.vue'), meta: { roles: ['Admin'] } },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()
  if (to.meta.public) return next()
  if (!auth.isAuthenticated) return next({ name: 'login' })
  const allowed = to.meta.roles as string[] | undefined
  if (allowed && !allowed.includes(auth.currentUser!.role)) {
    return next('/applications')
  }
  next()
})

export default router
