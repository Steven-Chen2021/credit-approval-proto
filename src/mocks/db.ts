import faker from 'faker'
import { v4 as uuid } from 'uuid'

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

const carriers = ['COSCO', 'EMC', 'SITC']
const pols = ['CNSHA/Shanghai', 'CNSZX/Shenzhen', 'CNNGB/Ningbo']
const pods = ['USLAX/Los Angeles', 'USLGB/Long Beach', 'USSEA/Seattle']
const containerTypes: ContainerType[] = ['20CNT', '40CNT', '40HQ']

let oceanBookings: OceanBooking[] = []
let carrierDrafts: CarrierBookingDraft[] = []

function randomDateWithin(days: number) {
  const now = new Date()
  const end = new Date(now)
  end.setDate(end.getDate() + days)
  return faker.date.between(now, end)
}

function makeBooking(): OceanBooking {
  const id = uuid()
  const carrier = faker.random.arrayElement(carriers)
  const pol = faker.random.arrayElement(pols)
  const pod = faker.random.arrayElement(pods)
  const etdDate = randomDateWithin(90)
  const etcDate = new Date(etdDate.getTime() - faker.random.number({ min: 1, max: 3 }) * 24 * 60 * 60 * 1000)
  const etaDate = new Date(etdDate.getTime() + faker.random.number({ min: 12, max: 20 }) * 24 * 60 * 60 * 1000)
  const status: OceanBookingStatus = Math.random() < 0.7 ? 'Unused' : 'Used'
  return {
    id,
    status,
    soNo: `SO${faker.random.number({ min: 100000, max: 999999 })}`,
    blNo: Math.random() > 0.5 ? `BL${faker.random.number({ min: 100000, max: 999999 })}` : undefined,
    pol,
    pod,
    carrier,
    etc: etcDate.toISOString(),
    etd: etdDate.toISOString(),
    eta: etaDate.toISOString(),
    vessel: `${faker.random.arrayElement(['COSCO', 'EMC', 'SITC'])} ${faker.random.alpha({ count: 3, upcase: true })}`,
    voyage: `${faker.random.number({ min: 1000, max: 9999 })}`,
    containerType: faker.random.arrayElement(containerTypes),
    containerQty: faker.random.number({ min: 1, max: 6 }),
    remarks: Math.random() > 0.7 ? faker.lorem.sentence() : undefined,
    createdAt: new Date().toISOString(),
    createdBy: 'op.tpe01',
    updatedAt: undefined,
  }
}

function seed() {
  oceanBookings = Array.from({ length: 90 }).map(makeBooking)
  carrierDrafts = []
  // create drafts for subset of used bookings to simulate assignments
  const usedBookings = oceanBookings.filter((b) => b.status === 'Used').slice(0, 5)
  if (usedBookings.length) {
    createDrafts(usedBookings.map((b) => b.id))
  }
}

seed()

function toLower(str?: string) {
  return (str || '').toLowerCase()
}

function matches(value: string | undefined, keyword: string | undefined) {
  if (!keyword) return true
  return toLower(value).includes(keyword.toLowerCase())
}

function withinRange(value: string | undefined, from?: string, to?: string) {
  if (!value) return false
  const time = new Date(value).getTime()
  if (from && time < new Date(from).getTime()) return false
  if (to && time > new Date(to).getTime()) return false
  return true
}

function list(query: Record<string, any>) {
  const {
    status,
    soNo,
    blNo,
    pol,
    pod,
    carrier,
    etcFrom,
    etcTo,
    etdFrom,
    etdTo,
    etaFrom,
    etaTo,
    vessel,
    voyage,
    containerType,
    page = 1,
    pageSize = 20,
    sortBy = 'etd',
    sortDir = 'asc',
  } = query

  const statusList = Array.isArray(status) ? status : status ? [status] : []
  const containerList = Array.isArray(containerType) ? containerType : containerType ? [containerType] : []

  const items = oceanBookings.filter((b) => {
    if (statusList.length && !statusList.includes(b.status)) return false
    if (!matches(b.soNo, soNo)) return false
    if (!matches(b.blNo, blNo)) return false
    if (pol && toLower(b.pol) !== toLower(pol)) return false
    if (pod && toLower(b.pod) !== toLower(pod)) return false
    if (carrier && toLower(b.carrier) !== toLower(carrier)) return false
    if ((etcFrom || etcTo) && !withinRange(b.etc, etcFrom, etcTo)) return false
    if ((etdFrom || etdTo) && !withinRange(b.etd, etdFrom, etdTo)) return false
    if ((etaFrom || etaTo) && !withinRange(b.eta, etaFrom, etaTo)) return false
    if (!matches(b.vessel, vessel)) return false
    if (!matches(b.voyage, voyage)) return false
    if (containerList.length && !containerList.includes(b.containerType)) return false
    return true
  })

  const sorted = [...items].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1
    if (sortBy === 'containerQty') return (a.containerQty - b.containerQty) * dir
    const av = (a as Record<string, any>)[sortBy]
    const bv = (b as Record<string, any>)[sortBy]
    if (av === bv) return 0
    if (av === undefined || av === null) return -dir
    if (bv === undefined || bv === null) return dir
    return av > bv ? dir : -dir
  })

  const start = (Number(page) - 1) * Number(pageSize)
  const end = start + Number(pageSize)

  return {
    items: sorted.slice(start, end),
    total: sorted.length,
  }
}

function summary() {
  const unused = oceanBookings.filter((b) => b.status === 'Unused').length
  const used = oceanBookings.length - unused
  return { unused, used }
}

function ensureUnique(soNo: string, carrier: string, etd: string, excludeId?: string) {
  const dup = oceanBookings.find(
    (b) => b.soNo === soNo && b.carrier === carrier && b.etd === etd && b.id !== excludeId
  )
  return !dup
}

function create(data: Partial<OceanBooking>) {
  const now = new Date().toISOString()
  const booking: OceanBooking = {
    id: uuid(),
    status: 'Unused',
    soNo: data.soNo!,
    blNo: data.blNo,
    pol: data.pol!,
    pod: data.pod!,
    carrier: data.carrier!,
    etc: data.etc,
    etd: data.etd!,
    eta: data.eta,
    vessel: data.vessel,
    voyage: data.voyage,
    containerType: data.containerType as ContainerType,
    containerQty: data.containerQty!,
    remarks: data.remarks,
    createdAt: now,
    createdBy: 'op.tpe01',
    updatedAt: now,
  }
  oceanBookings.unshift(booking)
  return booking
}

function update(id: string, patch: Partial<OceanBooking>) {
  const idx = oceanBookings.findIndex((b) => b.id === id)
  if (idx === -1) throw new Error('Not found')
  const updated: OceanBooking = {
    ...oceanBookings[idx],
    ...patch,
    updatedAt: new Date().toISOString(),
  }
  oceanBookings[idx] = updated
  return updated
}

function updateStatus(ids: string[], status: OceanBookingStatus) {
  const updated: string[] = []
  const skipped: string[] = []
  const now = new Date().toISOString()
  ids.forEach((id) => {
    const booking = oceanBookings.find((b) => b.id === id)
    if (!booking) return
    if (booking.status === status) {
      skipped.push(id)
      return
    }
    booking.status = status
    booking.updatedAt = now
    if (status === 'Unused') {
      booking.carrierBookingId = undefined
    }
    updated.push(id)
  })
  return { updated, skipped }
}

function createDrafts(ids: string[]) {
  const grouped = new Map<string, OceanBooking[]>()
  ids
    .map((id) => oceanBookings.find((b) => b.id === id))
    .filter((b): b is OceanBooking => !!b)
    .forEach((booking) => {
      const key = [booking.carrier, booking.pol, booking.pod, booking.etd, booking.containerType].join('|')
      const list = grouped.get(key) || []
      list.push(booking)
      grouped.set(key, list)
    })

  const drafts: CarrierBookingDraft[] = []
  const now = new Date().toISOString()
  grouped.forEach((group) => {
    const first = group[0]
    const draft: CarrierBookingDraft = {
      id: uuid(),
      carrier: first.carrier,
      pol: first.pol,
      pod: first.pod,
      etd: first.etd,
      containerType: first.containerType,
      totalContainerQty: group.reduce((sum, item) => sum + item.containerQty, 0),
      sourceOceanBookingIds: group.map((item) => item.id),
      createdAt: now,
      createdBy: 'op.tpe01',
      status: 'Draft',
    }
    carrierDrafts.unshift(draft)
    group.forEach((booking) => {
      booking.status = 'Used'
      booking.carrierBookingId = draft.id
      booking.updatedAt = now
    })
    drafts.push(draft)
  })
  return drafts
}

function assign(ids: string[]) {
  return createDrafts(ids)
}

function getDrafts() {
  return carrierDrafts.slice(0, 50)
}

function reset() {
  seed()
}

export default {
  reset,
  ocean: {
    list,
    summary,
    ensureUnique,
    create,
    update,
    updateStatus,
    assign,
  },
  carrier: {
    drafts: getDrafts,
  },
}
