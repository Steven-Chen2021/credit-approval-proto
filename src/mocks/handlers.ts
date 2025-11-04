import { HttpResponse, http } from 'msw'
import db from './db'

function parseQuery(url: URL) {
  const query: Record<string, any> = {}
  url.searchParams.forEach((value, key) => {
    if (key.endsWith('[]')) {
      const realKey = key.slice(0, -2)
      if (!query[realKey]) query[realKey] = []
      query[realKey].push(value)
    } else {
      query[key] = value
    }
  })
  return query
}

export const handlers = [
  http.get('/api/ocean-bookings', ({ request }) => {
    const url = new URL(request.url)
    const data = db.ocean.list(parseQuery(url))
    return HttpResponse.json(data)
  }),

  http.get('/api/ocean-bookings/summary', () => {
    return HttpResponse.json(db.ocean.summary())
  }),

  http.get('/api/ocean-bookings/validate-unique', ({ request }) => {
    const url = new URL(request.url)
    const soNo = url.searchParams.get('soNo')
    const carrier = url.searchParams.get('carrier')
    const etd = url.searchParams.get('etd')
    const excludeId = url.searchParams.get('excludeId') || undefined
    if (!soNo || !carrier || !etd) {
      return HttpResponse.json({ unique: false })
    }
    return HttpResponse.json({ unique: db.ocean.ensureUnique(soNo, carrier, etd, excludeId) })
  }),

  http.post('/api/ocean-bookings', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(db.ocean.create(body))
  }),

  http.put('/api/ocean-bookings/:id', async ({ request, params }) => {
    const body = await request.json()
    return HttpResponse.json(db.ocean.update(params.id!, body))
  }),

  http.patch('/api/ocean-bookings/:id/status', async ({ request, params }) => {
    const body = await request.json()
    const ids = params.id === 'batch' ? body.ids || [] : [params.id!]
    return HttpResponse.json(db.ocean.updateStatus(ids, body.status))
  }),

  http.patch('/api/ocean-bookings/batch/status', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(db.ocean.updateStatus(body.ids || [], body.status))
  }),

  http.post('/api/carrier-bookings/drafts', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(db.ocean.assign(body.sourceIds || []))
  }),

  http.get('/api/carrier-bookings/drafts', () => {
    return HttpResponse.json(db.carrier.drafts())
  }),

  http.post('/api/seeds/reset', () => {
    db.reset()
    return HttpResponse.json({ ok: true })
  }),
]
