/* msw mockServiceWorker.js (v2 lightweight distribution) */
self.addEventListener('install', function () { self.skipWaiting() })
self.addEventListener('activate', function (event) { event.waitUntil(self.clients.claim()) })
const INTEGRITY_CHECKSUM = 'msw-v2'
const msgType = { CLIENT_READY:'CLIENT_READY', SETUP:'SETUP', MOCK_SUCCESS:'MOCK_SUCCESS', MOCK_NOT_FOUND:'MOCK_NOT_FOUND' }
let clients = new Set()
self.addEventListener('message', event => {
  const { type } = event.data || {}
  if (type === 'KEEPALIVE_REQUEST') event.source?.postMessage({ type: 'KEEPALIVE_RESPONSE' })
})
self.addEventListener('fetch', function (event) {
  const req = event.request
  const accept = req.headers.get('accept') || ''
  if (accept.includes('text/event-stream')) return
  const channel = new MessageChannel()
  event.respondWith(new Promise((resolve) => {
    const requestId = Math.random().toString(16).slice(2)
    channel.port1.onmessage = (e) => {
      const { type, payload } = e.data || {}
      if (type === 'MOCK_RESPONSE') {
        const { status, statusText, headers, body } = payload
        resolve(new Response(body, { status, statusText, headers }))
      } else if (type === 'MOCK_NOT_FOUND') {
        resolve(fetch(req))
      }
    }
    event.clientId && self.clients.get(event.clientId).then(client => {
      client?.postMessage({ type: 'REQUEST', payload: { id: requestId, url: req.url, method: req.method, headers: Object.fromEntries(req.headers.entries()), cache: req.cache, mode: req.mode, credentials: req.credentials, redirect: req.redirect, referrer: req.referrer, referrerPolicy: req.referrerPolicy, integrity: req.integrity, keepalive: req.keepalive } }, [channel.port2])
    })
  }))
})
