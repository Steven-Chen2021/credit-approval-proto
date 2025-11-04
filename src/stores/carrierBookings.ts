import { defineStore } from 'pinia'
import type { CarrierBookingDraft } from './oceanBookings'

export const useCarrierBookingStore = defineStore('carrierBookings', {
  state: () => ({
    drafts: [] as CarrierBookingDraft[],
    loading: false,
  }),
  actions: {
    async fetchDrafts() {
      this.loading = true
      try {
        const res = await fetch('/api/carrier-bookings/drafts')
        if (!res.ok) throw new Error('Failed to load drafts')
        this.drafts = await res.json()
      } finally {
        this.loading = false
      }
    },
  },
})
