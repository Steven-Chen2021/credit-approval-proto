const TIME_ZONE = 'Asia/Taipei'
const OFFSET = '+08:00'

export function formatDateTime(value?: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const datePart = date.toLocaleDateString('en-CA', { timeZone: TIME_ZONE })
  const timePart = date.toLocaleTimeString('en-GB', {
    timeZone: TIME_ZONE,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${datePart} ${timePart}`
}

export function localDateTimeToISO(value?: string | null): string | null {
  if (!value) return null
  const normalized = value.trim()
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(normalized)) return null
  const iso = new Date(`${normalized.replace(' ', 'T')}:00${OFFSET}`).toISOString()
  return iso
}

export function isoToLocalInput(value?: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const datePart = date.toLocaleDateString('en-CA', { timeZone: TIME_ZONE })
  const timePart = date.toLocaleTimeString('en-GB', {
    timeZone: TIME_ZONE,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  })
  return `${datePart} ${timePart}`
}

export function compareLocalDateTime(a?: string | null, b?: string | null): number {
  const ia = localDateTimeToISO(a ?? '')
  const ib = localDateTimeToISO(b ?? '')
  if (!ia || !ib) return 0
  return new Date(ia).getTime() - new Date(ib).getTime()
}

export const timeZoneLabel = 'UTC+8 · Asia/Taipei'
