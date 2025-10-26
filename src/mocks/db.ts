
import faker from 'faker'
import type { Application } from '@/stores/applications'
import type { Status } from '@/utils/fsm'
import { canTransition } from '@/utils/fsm'
import { v4 as uuid } from 'uuid'

const referralTemplates = ['Alpha Trade','Beta Logistics','Gamma Capital']

type Referral = { id: string; appId: string; company: string; sentAt?: string; repliedAt?: string; verdict?: 'positive'|'negative'; highCredit?: number; openAR?: number; pastDue?: number; avgDays?: number; isSecured?: boolean; remarks?: string }
let referrals: Referral[] = []

function positiveCount(appId: string){
  const list = referrals.filter(r=>r.appId===appId && r.verdict)
  return list.filter(r=>r.verdict==='positive').length
}

function makeOwners(): Application['owners'] {
  const n = faker.random.number({ min: 1, max: 3 })
  return Array.from({ length: n }).map(() => ({
    name: faker.name.findName(), title: faker.name.jobTitle(),
    address: faker.address.streetAddress(), phone: faker.phone.phoneNumber(),
    email: faker.internet.email(), ssnMasked: `****-**-${faker.random.number({ min:1000, max:9999 })}`
  }))
}

function buildLifecycle(ageYears: number): Status[] {
  const core: Status[] = ageYears < 3
    ? ['Draft','Pending-StationMgr','Pending-CustomerInput','Referral-Sent','Referral-Received','Pending-L1ManagerApproval','Pending-L2ManagerApproval','Approved']
    : ['Draft','Pending-CustomerInput','Referral-Sent','Referral-Received','Pending-L1ManagerApproval','Pending-L2ManagerApproval','Approved']
  return core
}

function pickStatus(ageYears: number): Status {
  const flow = buildLifecycle(ageYears)
  const stageIdx = faker.random.number({ min: 0, max: flow.length - 1 })
  const status = flow[stageIdx]
  const rejectionEligible: Status[] = ['Pending-StationMgr','Referral-Received','Pending-L1ManagerApproval','Pending-L2ManagerApproval']
  if (rejectionEligible.includes(status) && faker.random.boolean()) {
    return 'Rejected'
  }
  return status
}

function genOne(): Application {
  const id = uuid()
  const ageYears = faker.random.number({ min: 0, max: 8 })
  const status = pickStatus(ageYears)
  const base: Application = {
    id,
    status,
    company: {
      name: faker.company.companyName(), address: faker.address.streetAddress(),
      city: faker.address.city(), state: faker.address.stateAbbr(), zip: faker.address.zipCode(),
      website: faker.internet.url(), ageYears, companyType: ageYears<3 ? 'Startup':'Corporation'
    },
    estimatedAnnualRevenue: faker.random.number({ min: 0, max: 50_000_000 }),
    salesArea: faker.address.country(),
    isBankruptcy: faker.random.boolean() && faker.random.number({min:0,max:50})===0,
    dateOrganized: faker.date.past(8).toISOString().slice(0,10),
    taxIdNo: faker.random.alphaNumeric(10).toUpperCase(),
    employees: faker.random.number({min:0,max:1500}),
    yearsAtLocation: faker.random.number({min:0,max:10}),
    landlord: faker.company.companyName(),
    landlordPhone: faker.phone.phoneNumber(),
    owners: makeOwners(),
    shipping: { unit: faker.random.arrayElement(['TON','TEU','FEU','CBM']), perMonth: faker.random.number({min:0,max:800}), estFreightUSD: faker.random.number({min:1000,max:2_000_000}) },
    references: Array.from({length: faker.random.number({min:1,max:3})}).map(()=>({
      company: faker.company.companyName(), contact: faker.name.findName(), address: faker.address.streetAddress(),
      phone: faker.phone.phoneNumber(), fax: faker.phone.phoneNumber(), website: faker.internet.url(), email: faker.internet.email()
    })),
    bankRefs: [{ bank: faker.company.companyName(), contact: faker.name.findName(), address: faker.address.streetAddress(), phone: faker.phone.phoneNumber(), checkingNoMasked: `***${faker.random.number({min:1000,max:9999})}`, yearsOpen: faker.random.number({min:0,max:20}) }],
    authorizedRep: { name: faker.name.findName(), title: 'CFO', date: new Date().toISOString().slice(0,10), ip: `${faker.random.number({min:1,max:255})}.${faker.random.number({min:0,max:255})}.${faker.random.number({min:0,max:255})}.${faker.random.number({min:0,max:255})}` },
    attachments: [],
    audit: [{ at: new Date().toISOString(), by: 'system', action: 'seed' }],
    referrals: [],
    createdBy: faker.random.arrayElement(['sales','admin'])
  }
  return base
}

let apps: Application[] = Array.from({length: 90}).map(genOne)

function sendReferrals(appId: string){
  referralTemplates.forEach(t=>{
    referrals.push({ id: uuid(), appId, company: t, sentAt: new Date().toISOString() })
  })
}

export default {
  reset(){ apps = Array.from({length: 90}).map(genOne); referrals = [] },
  apps: {
    all: () => apps,
    update: (id: string, patch: Partial<Application>) => {
      const i = apps.findIndex(a=>a.id===id); apps[i] = { ...apps[i], ...patch }
      apps[i].audit.push({ at:new Date().toISOString(), by:'user', action:'update' })
      return apps[i]
    },
    createDraft: (body: any) => {
      const item = genOne();
      item.status = 'Draft';
      Object.assign(item, body)
      apps.unshift(item)
      item.audit.push({ at:new Date().toISOString(), by:'sales', action:'create-draft' })
      return item
    },
    transition: (id: string, next: Status, note?: string) => {
      const i = apps.findIndex(a=>a.id===id); const a = apps[i]
      if (!canTransition[a.status].includes(next)) {
        throw new Error(`Invalid transition from ${a.status} to ${next}`)
      }
      if (a.company.ageYears < 3 && a.status==='Draft' && next!=='Pending-StationMgr') {
        throw new Error('Age<3 must go to Station Manager first')
      }
      if (a.status==='Referral-Received' && next==='Pending-L1ManagerApproval') {
        if (positiveCount(id) < 2) throw new Error('Need ≥2 positive referrals')
      }
      if (next==='Rejected' && !note) throw new Error('Reject requires reason')
      a.audit.push({ at:new Date().toISOString(), by:(next==='Rejected'?'manager':'system'), action:(next==='Rejected'?'reject':`to-${next}`), note })
      a.status = next
      return a
    }
  },
  referrals: {
    list: (appId: string) => referrals.filter(r=>r.appId===appId),
    send: (appId: string) => { sendReferrals(appId); return referrals.filter(r=>r.appId===appId) },
    reply: (appId: string, rid: string, payload: Partial<Referral>) => {
      const i = referrals.findIndex(r=>r.id===rid && r.appId===appId)
      const merged = { ...referrals[i], ...payload, repliedAt: new Date().toISOString() }
      if (merged.avgDays && merged.avgDays > 120) throw new Error('AvgDays must be <= 120')
      if ((merged.pastDue||0) > (merged.openAR||0)) throw new Error('PastDue must be <= OpenAR')
      referrals[i] = merged
      return referrals[i]
    }
  },
  i18n: {
    getAll: () => ({ }),
    update: (_patch: any) => ({ ok: true })
  },
  csv: {
    import: ({ rows, updateBlankOnly }: { rows: any[]; updateBlankOnly?: boolean }) => {
      const errors: any[] = []
      rows.forEach((r, idx) => {
        if (!r.CompanyName || !r.EstimatedAnnualRevenue) {
          errors.push({ idx, field: 'required', message: 'Missing CompanyName or EstimatedAnnualRevenue' })
        }
      })
      return { ok: errors.length===0, errors }
    },
    export: ({ filter }: { filter: any }) => {
      return { ok: true, rows: apps.map(a=>({ CompanyName: a.company.name, EstimatedAnnualRevenue: a.estimatedAnnualRevenue, CompanyType: a.company.companyType })) }
    }
  }
}
