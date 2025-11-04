import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@/pages/Portal.vue') },
    { path: '/ocean-booking-bank', component: () => import('@/pages/OceanBookingBank.vue') },
    { path: '/carrier-booking', component: () => import('@/pages/CarrierBooking.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

export default router
