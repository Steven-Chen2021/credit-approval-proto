import { defineStore } from 'pinia'

export type OceanBookingStatus = 'Unused' | 'Used'
export type ContainerType = '20CNT' | '40CNT' | '40HQ'

export interface OceanBooking {
  id: string
  status: OceanBookingStatus
  soNo: string
  blNo?: string
  pol: string
  pod: string
  carrier: string
  etc?: string | null
  etd: string
  eta?: string | null
  vessel?: string
  voyage?: string
  containerType: ContainerType
  containerQty: number
  remarks?: string
  carrierBookingId?: string
  createdAt: string
  createdBy: string
  updatedAt?: string
}

export interface CarrierBookingDraft {
  id: string
  carrier: string
  pol: string
  pod: string
  etd: string
  containerType: ContainerType
  totalContainerQty: number
  sourceOceanBookingIds: string[]
  createdAt: string
  createdBy: string
  status: 'Draft' | 'Submitted'
}

export interface OceanBookingQuery {
  status?: OceanBookingStatus[]
  soNo?: string
  blNo?: string
  pol?: string
  pod?: string
  carrier?: string
  etcFrom?: string
  etcTo?: string
  etdFrom?: string
  etdTo?: string
  etaFrom?: string
  etaTo?: string
  vessel?: string
  voyage?: string
  containerType?: ContainerType[]
  page?: number
  pageSize?: number
  sortBy?: string
  sortDir?: 'asc' | 'desc'
}

export interface OceanBookingPayload {
  soNo: string
  blNo?: string | null
  pol: string
  pod: string
  carrier: string
  etc?: string | null
  etd: string
  eta?: string | null
  vessel?: string | null
  voyage?: string | null
  containerType: ContainerType
  containerQty: number
  remarks?: string | null
}

interface Summary {
  unused: number
  used: number
}

export const useOceanBookingStore = defineStore('oceanBookings', {
  state: () => ({
    items: [] as OceanBooking[],
    total: 0,
    loading: false,
    summary: null as Summary | null,
    lastQuery: null as OceanBookingQuery | null,
  }),
  actions: {
    async fetchList(query: OceanBookingQuery) {
      this.loading = true
      try {
        this.lastQuery = { ...query }
        const params = new URLSearchParams()
        Object.entries(query).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '') return
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(`${key}[]`, `${v}`))
          } else {
            params.set(key, `${value}`)
          }
        })
        const res = await fetch(`/api/ocean-bookings?${params.toString()}`)
        if (!res.ok) throw new Error('Failed to load bookings')
        const data = await res.json()
        this.items = data.items
        this.total = data.total
      } finally {
        this.loading = false
      }
    },
    async fetchSummary() {
      const res = await fetch('/api/ocean-bookings/summary')
      if (!res.ok) return
      this.summary = await res.json()
    },
    async create(payload: OceanBookingPayload) {
      const res = await fetch('/api/ocean-bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanPayload(payload)),
      })
      if (!res.ok) throw new Error('Failed to create booking')
      return res.json()
    },
    async update(id: string, payload: OceanBookingPayload) {
      const res = await fetch(`/api/ocean-bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanPayload(payload)),
      })
      if (!res.ok) throw new Error('Failed to update booking')
      return res.json()
    },
    async updateStatus(ids: string[], status: OceanBookingStatus) {
      const res = await fetch('/api/ocean-bookings/batch/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids, status }),
      })
      if (!res.ok) throw new Error('Failed to update status')
      const data = await res.json()
      await this.fetchSummary()
      return data as { updated: string[]; skipped: string[] }
    },
    async assignToCarrier(ids: string[]) {
      const res = await fetch('/api/carrier-bookings/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceIds: ids }),
      })
      if (!res.ok) throw new Error('Failed to assign to carrier booking')
      const data = await res.json()
      await this.fetchSummary()
      return data as CarrierBookingDraft[]
    },
    async checkUnique(soNo: string, carrier: string, etd: string, excludeId?: string) {
      const params = new URLSearchParams({ soNo, carrier, etd })
      if (excludeId) params.set('excludeId', excludeId)
      const res = await fetch(`/api/ocean-bookings/validate-unique?${params.toString()}`)
      if (!res.ok) return false
      const data = await res.json()
      return data.unique as boolean
    },
  },
})

function cleanPayload(payload: OceanBookingPayload) {
  const cleaned: Record<string, any> = {}
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    cleaned[key] = value
  })
  return cleaned
}
