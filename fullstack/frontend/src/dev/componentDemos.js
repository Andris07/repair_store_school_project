// frontend/src/dev/componentDemos.js
//
// A /test-components oldal ebből a listából dolgozik. Új komponens felvétele = új elem a
// `componentDemos` tömbbe (a lista végén van egy másolható sablon).
//
// Egy demó mezői:
//   name         a komponens neve (a bal oldali listában ez látszik)
//   component    maga a komponens (importálva)
//   path         hol található (csak tájékoztatás)
//   description  rövid leírás
//   events       az emit-ált események nevei, ezeket a naplóba írja az oldal (pl. ['action'])
//   layoutClass  hogyan rendezze el a variánsokat (Tailwind-osztályok; alapértelmezés: egymás mellett)
//   itemClass    egy variáns tartója (alapértelmezés: 'items-start' = nem nyújtja szét az elemet)
//   playground   a "Játszótér" JSON-szerkesztő kezdőértéke – csak JSON-ban leírható adat lehet (függvény nem)
//   variants     [{ group?, label, props, slot?, note? }] – a kipróbálandó esetek
//                (itt a props lehet függvényt is tartalmazó, pl. filter: (a) => ...)

import StatusBadge from '@components/reusable/StatusBadge.vue'
import ActionButton from '@components/reusable/ActionButton.vue'
import AppointmentSummaryCard from '@components/reusable/AppointmentSummaryCard.vue'

// ---------- közös minta adatok (később a végleges adatfájlból jönnek majd) ----------
export const statusCodes = [
  { name: 'Függőben', fontColor: 'warn', backgroundColor: 'warn-soft', displayBackground: true },
  { name: 'Jóváhagyva', fontColor: 'info', backgroundColor: 'info-soft', displayBackground: true },
  { name: 'Folyamatban', fontColor: 'accent', backgroundColor: 'accent-soft', displayBackground: true },
  { name: 'Elkészült', fontColor: 'ok', backgroundColor: 'ok-soft', displayBackground: true },
  { name: 'Lemondva', fontColor: 'danger', backgroundColor: 'danger-soft', displayBackground: true }
]

export const actionButtons = [
  { key: 'approve', name: 'Jóváhagy', fontColor: 'accent-text', backgroundColor: 'accent' },
  { key: 'reject', name: 'Elutasít', fontColor: 'danger', backgroundColor: 'transparent', borderColor: 'danger' },
  { key: 'open', name: 'Megnyit', fontColor: 'text', backgroundColor: 'surface', borderColor: 'border' }
]

const dayOffset = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('sv-SE') // YYYY-MM-DD, helyi idő szerint
}
const today = dayOffset(0)

const appointments = [
  { id: 1, status: 'Függőben', appointmentDate: `${today} 09:00` },
  { id: 2, status: 'Függőben', appointmentDate: `${today} 10:30` },
  { id: 3, status: 'Jóváhagyva', appointmentDate: `${dayOffset(1)} 13:00` },
  { id: 4, status: 'Folyamatban', appointmentDate: `${today} 14:00` },
  { id: 5, status: 'Függőben', appointmentDate: `${dayOffset(1)} 11:00` },
  { id: 6, status: 'Elkészült', appointmentDate: `${dayOffset(-2)} 14:00` },
  { id: 7, status: 'Lemondva', appointmentDate: `${dayOffset(-3)} 09:00` }
]

const repairs = [
  { id: 1, status: 'Folyamatban' },
  { id: 2, status: 'Folyamatban' },
  { id: 3, status: 'Folyamatban' },
  { id: 4, status: 'Folyamatban' },
  { id: 5, status: 'Elkészült', finishedAt: dayOffset(-1) },
  { id: 6, status: 'Elkészült', finishedAt: dayOffset(-3) },
  { id: 7, status: 'Elkészült', finishedAt: dayOffset(-20) }
]

const isToday = (appointment) => appointment.appointmentDate.startsWith(today)
const isDoneThisWeek = (repair) => repair.status === 'Elkészült' && repair.finishedAt >= dayOffset(-7)

// ---------- a demók ----------
export const componentDemos = [
  {
    name: 'StatusBadge',
    component: StatusBadge,
    path: 'components/reusable/StatusBadge.vue',
    description: 'Állapotcímke. Paraméter: status = { name, fontColor, backgroundColor, displayBackground }.',
    events: [],
    playground: {
      status: { name: 'Függőben', fontColor: 'warn', backgroundColor: 'warn-soft', displayBackground: true }
    },
    variants: [
      ...statusCodes.map((status) => ({ group: 'Az 5 állapot (háttérrel)', label: status.name, props: { status } })),
      ...statusCodes.map((status) => ({
        group: 'Háttér nélkül (displayBackground: false)',
        label: status.name,
        props: { status: { ...status, displayBackground: false } }
      })),
      {
        group: 'Különleges esetek',
        label: 'Egyedi hex szín',
        props: { status: { name: 'Egyedi hex', fontColor: '#7c3aed', backgroundColor: '#ede9fe' } }
      },
      {
        group: 'Különleges esetek',
        label: 'Nincs szín megadva (tartalék szürke)',
        props: { status: { name: 'Nincs szín' } }
      },
      {
        group: 'Különleges esetek',
        label: 'Hosszú név (nem törhet sort)',
        props: { status: { ...statusCodes[2], name: 'Várakozás alkatrészre és engedélyre' } }
      }
    ]
  },

  {
    name: 'ActionButton',
    component: ActionButton,
    path: 'components/reusable/ActionButton.vue',
    description:
      'Műveletgomb. Paraméterek: action = { key, name, fontColor, backgroundColor, borderColor? }, payload, size, disabled. Kattintáskor `action` eseményt küld.',
    events: ['action'],
    playground: {
      action: { key: 'approve', name: 'Jóváhagy', fontColor: 'accent-text', backgroundColor: 'accent' },
      payload: 42,
      size: 'sm',
      disabled: false
    },
    variants: [
      ...actionButtons.map((action) => ({ group: 'size="sm" (táblázatba)', label: action.name, props: { action, payload: 42 } })),
      ...actionButtons.map((action) => ({
        group: 'size="md"',
        label: action.name,
        props: { action, payload: 42, size: 'md' }
      })),
      ...actionButtons.map((action) => ({
        group: 'disabled',
        label: action.name,
        props: { action, payload: 42, disabled: true }
      })),
      {
        group: 'Különleges esetek',
        label: 'Egyedi hex szín',
        props: { action: { key: 'custom', name: 'Egyedi', fontColor: '#ffffff', backgroundColor: '#7c3aed' } }
      },
      {
        group: 'Különleges esetek',
        label: 'Saját tartalom (slot) a felirat helyett',
        props: { action: actionButtons[0], payload: 42 },
        slot: '✓ Jóváhagy (slot)'
      },
      {
        group: 'Különleges esetek',
        label: 'Hosszú felirat',
        props: { action: { ...actionButtons[2], name: 'Javítás összefoglalójának megnyitása' }, payload: 42 }
      }
    ]
  },

  {
    name: 'AppointmentSummaryCard',
    component: AppointmentSummaryCard,
    path: 'components/reusable/AppointmentSummaryCard.vue',
    description:
      'Összefoglaló kártya. Paraméterek: label, description, appointments, filter (objektum vagy függvény), count (előre kiszámolt szám).',
    events: [],
    layoutClass: 'grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4',
    itemClass: 'items-stretch',
    playground: {
      label: 'Új, jóváhagyásra vár',
      description: 'Függő foglalás',
      appointments: [{ status: 'Függőben' }, { status: 'Függőben' }, { status: 'Jóváhagyva' }],
      filter: { status: 'Függőben' }
    },
    variants: [
      {
        group: 'Admin – Foglalások kártyák',
        label: 'Objektum szűrő',
        note: 'elvárt: 3',
        props: { label: 'Új, jóváhagyásra vár', description: 'Függő foglalás', appointments, filter: { status: 'Függőben' } }
      },
      {
        group: 'Admin – Foglalások kártyák',
        label: 'Függvény szűrő (ma)',
        note: 'elvárt: 3',
        props: { label: 'Ma', description: 'Időpont', appointments, filter: isToday }
      },
      {
        group: 'Admin – Foglalások kártyák',
        label: 'Javítások (objektum szűrő)',
        note: 'elvárt: 4',
        props: { label: 'Folyamatban', description: 'Javítás', appointments: repairs, filter: { status: 'Folyamatban' } }
      },
      {
        group: 'Admin – Foglalások kártyák',
        label: 'Javítások (függvény szűrő)',
        note: 'elvárt: 2',
        props: { label: 'E héten elkészült', description: 'Javítás', appointments: repairs, filter: isDoneThisWeek }
      },
      {
        group: 'Szűrő módok',
        label: 'Tömb érték (több állapot)',
        note: 'elvárt: 4',
        props: {
          label: 'Függőben vagy jóváhagyva',
          description: 'Több érték',
          appointments,
          filter: { status: ['Függőben', 'Jóváhagyva'] }
        }
      },
      {
        group: 'Szűrő módok',
        label: 'Nincs szűrő (mindet számolja), nincs leírás',
        note: 'elvárt: 7',
        props: { label: 'Összes foglalás', appointments }
      },
      {
        group: 'Szűrő módok',
        label: 'count paraméter (előre kiszámolt szám)',
        note: 'elvárt: 1234 (a magyar számformázás négyjegyűnél nem tesz szóközt, 10 000-től igen)',
        props: { label: 'Kézzel megadott szám', description: 'count paraméter', count: 1234 }
      },
      {
        group: 'Szűrő módok',
        label: 'Üres lista',
        note: 'elvárt: 0',
        props: { label: 'Üres lista', description: 'Nincs adat', appointments: [] }
      },
      {
        group: 'Különleges esetek',
        label: 'Hosszú címke és leírás',
        props: {
          label: 'Nagyon hosszú címke, ami több sorba tördelődik a kártyán belül',
          description: 'Ez egy hosszabb tájékoztató szöveg, ami szintén sortörést igényel, hogy lássuk a kártya viselkedését.',
          appointments,
          filter: { status: 'Függőben' }
        }
      }
    ]
  }

  // ---------- ÚJ KOMPONENS SABLON (másold ki, vedd ki a kommentet, és töltsd ki) ----------
  // {
  //   name: 'ComponentName',
  //   component: ComponentName,            // import ComponentName from '@components/reusable/ComponentName.vue'
  //   path: 'components/reusable/ComponentName.vue',
  //   description: 'Mit csinál, milyen paramétereket vár.',
  //   events: [],                          // pl. ['action']
  //   playground: { /* JSON-ban leírható props */ },
  //   variants: [
  //     { group: 'Alap', label: 'Alapeset', props: { /* ... */ } }
  //   ]
  // }
]