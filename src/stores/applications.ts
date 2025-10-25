import { defineStore } from 'pinia'
import type { Status } from '@/utils/fsm'

export interface Owner { name: string; title: string; address: string; phone: string; email: string; ssnMasked: string }
export interface Reference { company: string; contact: string; address: string; phone: string; fax?: string; website?: string; email: string }
export interface BankRef { bank: string; contact: string; address: string; phone: string; fax?: string; email?: string; checkingNoMasked?: string; savingsNoMasked?: string; yearsOpen?: number }
export interface ShippingInfo { unit: 'TON'|'TEU'|'FEU'|'CBM'; perMonth: number; estFreightUSD: number }
export interface AuditItem { at: string; by: string; action: string; note?: string }
export interface ReferralItem { id: string; company: string; highCredit?: number; openAR?: number; pastDue?: number; avgDays?: number; isSecured?: boolean; remarks?: string; verdict?: 'positive'|'negative' }

export interface Application {
  id: string
  status: Status
  company: { name: string; address: string; city: string; state: string; zip: string; website?: string; ageYears: number; companyType?: string }
  estimatedAnnualRevenue?: number
  salesArea?: string
  companyType?: string
  isBankruptcy?: boolean
  dateOrganized?: string
  taxIdNo?: string
  employees?: number
  yearsAtLocation?: number
  landlord?: string
  landlordPhone?: string
  owners: Owner[]
  shipping: ShippingInfo
  references: Reference[]
  bankRefs: BankRef[]
  authorizedRep: { name: string; title: string; signatureDataUrl?: string; date?: string; ip?: string }
  attachments: { name: string; type: string; size: number }[]
  audit: AuditItem[]
  referrals: ReferralItem[]
  createdBy: string
}

export const useApplicationsStore = defineStore('apps', {
  state: () => ({ list: [] as Application[], total: 0 }),
  actions: {
    async fetch(){
      const res = await fetch('/api/applications')
      this.list = await res.json()
      this.total = this.list.length
    },
    async createDraft(payload: Partial<Application>){
      const res = await fetch('/api/applications', { method:'POST', body: JSON.stringify(payload) })
      const item = await res.json(); this.list.unshift(item)
    },
    async update(id: string, patch: Partial<Application>){
      const res = await fetch(`/api/applications/${id}`, { method:'PATCH', body: JSON.stringify(patch) })
      const updated = await res.json();
      const i = this.list.findIndex(x=>x.id===id); if(i>-1) this.list[i]=updated
    },
    async transition(id: string, next: Status, note?: string){
      const res = await fetch(`/api/applications/${id}/transition`, { method:'POST', body: JSON.stringify({ next, note }) })
      const updated = await res.json();
      const i = this.list.findIndex(x=>x.id===id); if(i>-1) this.list[i]=updated
    }
  }
})
