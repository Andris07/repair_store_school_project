// @utils/slots.mjs – naptár- és időpont-segédek az időpontválasztóhoz (helyi idő, időzóna-konverzió nélkül)

const pad = (n) => String(n).padStart(2, '0')

export const toDateKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
export const toSlotValue = (dateKey, time) => `${dateKey}T${time}`
export const parseDateKey = (key) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/** A hónap naptárrácsa hétfővel kezdve: 6 sor × 7 nap, a hónapon kívüli napok `inMonth: false`. */
export function buildMonthGrid(year, month) {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7 // hétfő = 0
  const start = new Date(year, month, 1 - offset)
  const days = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    days.push({ key: toDateKey(d), day: d.getDate(), inMonth: d.getMonth() === month, weekday: (d.getDay() + 6) % 7 })
  }
  return days
}

/** Napi időpontok "HH:mm" formában: [openTime, closeTime) között slotMinutes lépésekkel, a szünet kimarad. */
export function buildSlots({ open = '08:00', close = '17:00', slotMinutes = 30, breakStart = '', breakEnd = '' } = {}) {
  const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5))
  const fmt = (m) => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`
  const slots = []
  for (let m = toMin(open); m + slotMinutes <= toMin(close); m += slotMinutes) {
    if (breakStart && breakEnd && m < toMin(breakEnd) && m + slotMinutes > toMin(breakStart)) continue
    slots.push(fmt(m))
  }
  return slots
}
