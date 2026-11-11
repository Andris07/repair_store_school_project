<script setup>
/**
 * test.vue – komponens- és oldal-tesztelő (az index.vue ezt jeleníti meg 1:1).
 *
 * Branch-független: a reusable / auth / layout komponenseket és a layoutokat futásidőben keresi meg, és csak azokat
 * mutatja, amelyek az adott branchen léteznek és hibátlanul betöltődnek. A betöltési hibát (pl. rossz import) kiírja.
 * Új komponens kipróbálásához add hozzá a `demos` objektumhoz.
 */
import { computed, markRaw, onMounted, ref, shallowRef } from 'vue'
import { useDark, useLocalStorage } from '@vueuse/core'
import { useRouter } from 'vue-router'

const isDark = useDark()
const background = useLocalStorage('tester-bg', 'bg-bg')
const activeTab = useLocalStorage('tester-tab', 'all')

// ---------- betöltés ----------
const loaders = import.meta.glob([
  '/src/components/reusable/*.vue',
  '/src/components/auth/*.vue',
  '/src/components/layout/*.vue',
  '/src/layouts/*.vue'
])
const router = useRouter()
const components = shallowRef({})
const loadErrors = ref({})
const loaded = ref(false)

onMounted(async () => {
  const ok = {}
  const failed = {}
  await Promise.all(
    Object.entries(loaders).map(async ([path, load]) => {
      const name = path.split('/').pop().replace('.vue', '')
      try {
        const module = await load()
        ok[name] = markRaw(module.default)
      } catch (e) {
        failed[name] = e?.message ?? String(e)
      }
    })
  )
  components.value = ok
  loadErrors.value = failed
  loaded.value = true
})

// ---------- mintaadatok ----------
const statusCodes = {
  pending: { name: 'Függőben', fontColor: 'warn', backgroundColor: 'warn-soft' },
  approved: { name: 'Jóváhagyva', fontColor: 'info', backgroundColor: 'info-soft' },
  progress: { name: 'Folyamatban', fontColor: 'accent', backgroundColor: 'accent-soft' },
  done: { name: 'Elkészült', fontColor: 'ok', backgroundColor: 'ok-soft' },
  rejected: { name: 'Elutasítva', fontColor: 'danger', backgroundColor: 'danger-soft' }
}

const actionButtons = {
  approve: { key: 'approve', name: 'Jóváhagy', fontColor: 'accent-text', backgroundColor: 'accent', borderColor: 'accent' },
  reject: { key: 'reject', name: 'Elutasít', fontColor: 'danger', backgroundColor: 'surface', borderColor: 'danger' },
  open: { key: 'open', name: 'Megnyit', fontColor: 'text', backgroundColor: 'surface', borderColor: 'border' }
}

const dayOffset = (days) => {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}
const today = dayOffset(0)

const baseAppointments = [
  { id: 1, customer: 'Kiss Péter', plate: 'ABC-123', service: 'Olajcsere', date: dayOffset(0), status: 'pending' },
  { id: 2, customer: 'Nagy Anna', plate: 'DEF-456', service: 'Fékbetét', date: dayOffset(0), status: 'approved' },
  { id: 3, customer: 'Szabó Gábor', plate: 'GHI-789', service: 'Műszaki vizsga', date: dayOffset(1), status: 'pending' },
  { id: 4, customer: 'Tóth Éva', plate: 'JKL-012', service: 'Futómű', date: dayOffset(-1), status: 'progress' },
  { id: 5, customer: 'Varga Lajos', plate: 'MNO-345', service: 'Klíma töltés', date: dayOffset(-2), status: 'done' },
  { id: 6, customer: 'Kovács Bence', plate: 'PQR-678', service: 'Gumicsere', date: dayOffset(2), status: 'rejected' }
]
const appointments = ref(baseAppointments.map((a) => ({ ...a })))

// ---------- demók ----------
const demos = {
  StatusBadge: {
    description: 'Állapotcímke. A színek token-nevek vagy tetszőleges CSS színek.',
    variants: [
      ...Object.entries(statusCodes).map(([key, status]) => ({
        group: 'Állapotok',
        label: key,
        props: { status }
      })),
      {
        group: 'Háttér nélkül',
        label: 'displayBackground=false',
        props: { status: statusCodes.done, displayBackground: false }
      },
      {
        group: 'Egyedi szín',
        label: 'nyers CSS szín',
        props: { status: { name: 'Egyedi', fontColor: '#ffffff', backgroundColor: '#7c3aed' } }
      }
    ]
  },
  ActionButton: {
    description: 'Műveleti gomb. Kattintáskor `action` eseményt küld: { key, payload }.',
    events: ['action'],
    variants: [
      ...Object.entries(actionButtons).map(([key, action]) => ({
        group: 'sm (alap)',
        label: key,
        props: { action, payload: { id: 42 } }
      })),
      ...Object.entries(actionButtons).map(([key, action]) => ({
        group: 'md',
        label: key,
        props: { action, payload: { id: 42 }, size: 'md' }
      })),
      { group: 'Letiltva', label: 'disabled', props: { action: actionButtons.approve, disabled: true } }
    ]
  },
  AppointmentSummaryCard: {
    description: 'Összefoglaló kártya: a szűrőnek megfelelő foglalások száma (vagy a `count` felülírja).',
    itemClass: 'w-64',
    variants: [
      { group: 'Szűrő', label: 'mind', props: { label: 'Összes foglalás', description: 'Minden rekord', appointments } },
      {
        group: 'Szűrő',
        label: 'objektum',
        props: { label: 'Függőben', description: 'status = pending', appointments, filter: { status: 'pending' } }
      },
      {
        group: 'Szűrő',
        label: 'több érték',
        props: {
          label: 'Aktív',
          description: 'pending vagy approved',
          appointments,
          filter: { status: ['pending', 'approved'] }
        }
      },
      {
        group: 'Szűrő',
        label: 'függvény',
        props: {
          label: 'Mai foglalások',
          description: 'date = ma',
          appointments,
          filter: (a) => a.date === today
        }
      },
      { group: 'Felülírás', label: 'count=128', props: { label: 'Fix szám', description: 'count prop', count: 128 } },
      { group: 'Felülírás', label: 'count=1234', props: { label: 'Nagy szám', description: 'hu-HU formázás', count: 1234 } }
    ]
  },
  FormField: {
    description: 'Űrlapmező címkével, súgóval, hibával. v-model-lel használható.',
    events: ['blur'],
    itemClass: 'w-80',
    model: true,
    variants: [
      { group: 'Alap', label: 'szöveg', props: { label: 'Teljes név', name: 'name', placeholder: 'Kiss Péter' } },
      { group: 'Alap', label: 'opcionális', props: { label: 'Telefonszám', name: 'phone', optional: true } },
      { group: 'Alap', label: 'súgó', props: { label: 'Jelszó', type: 'password', name: 'pw', hint: 'Legalább 8 karakter.' } },
      { group: 'Hibás', label: 'hiba', props: { label: 'E-mail cím', name: 'email', error: 'Érvénytelen e-mail cím.' } }
    ]
  },
  AuthCard: {
    description: 'Belépő kártya (fülek + űrlap). Az űrlapok validálnak, érvényes adatnál eseményt küldenek.',
    events: ['login', 'register', 'forgot-password'],
    variants: [
      { group: 'Belépés', label: 'alap', props: { mode: 'login' } },
      { group: 'Belépés', label: 'tájékoztató sáv', props: { mode: 'login', notice: 'Sikeres regisztráció! Most már bejelentkezhetsz.' } },
      { group: 'Belépés', label: 'hiba', props: { mode: 'login', error: 'Hibás e-mail cím vagy jelszó.' } },
      { group: 'Belépés', label: 'töltés', props: { mode: 'login', loading: true } },
      { group: 'Regisztráció', label: 'alap', props: { mode: 'register' } }
    ]
  },
  LoginForm: {
    description: 'Belépési űrlap. Küld: submit { email, password, … }, forgot-password.',
    events: ['submit', 'forgot-password'],
    itemClass: 'w-96',
    variants: [
      { group: 'Állapotok', label: 'alap', props: {} },
      { group: 'Állapotok', label: 'hiba', props: { error: 'Hibás e-mail cím vagy jelszó.' } },
      { group: 'Állapotok', label: 'töltés', props: { loading: true } }
    ]
  },
  RegisterForm: {
    description: 'Regisztrációs űrlap. Küld: submit { name, email, phone, password }.',
    events: ['submit'],
    itemClass: 'w-96',
    variants: [
      { group: 'Állapotok', label: 'alap', props: {} },
      { group: 'Állapotok', label: 'hiba', props: { error: 'Ez az e-mail cím már foglalt.' } },
      { group: 'Állapotok', label: 'töltés', props: { loading: true } }
    ]
  },
  SidebarContent: {
    description: 'Oldalsáv tartalma szerepkör szerint (linkek, felhasználó, kijelentkezés).',
    events: ['navigate', 'logout'],
    itemClass: 'h-[480px] w-52 rounded-lg border border-border bg-surface p-3',
    variants: [
      { group: 'Szerepkörök', label: 'customer', props: { role: 'customer', userName: 'Kiss Péter' } },
      { group: 'Szerepkörök', label: 'admin', props: { role: 'admin', userName: 'Admin Anna' } },
      { group: 'Szerepkörök', label: 'worker', props: { role: 'worker', userName: 'Szabó Gábor' } }
    ]
  },
  BaseSidebar: {
    description: 'Oldalsáv: 1024 px alatt felső sáv + kihúzható menü, fölötte fix oldalsáv. A böngészőablakot méretezd.',
    events: ['logout'],
    variants: [
      { group: 'Szerepkörök', label: 'customer', props: { role: 'customer', userName: 'Kiss Péter' } },
      { group: 'Szerepkörök', label: 'admin', props: { role: 'admin', userName: 'Admin Anna' } },
      { group: 'Szerepkörök', label: 'worker', props: { role: 'worker', userName: 'Szabó Gábor' } }
    ]
  },
  BaseHeader: {
    description: 'Felső menüsáv (még helyőrző linkekkel).',
    variants: [{ group: 'Alap', label: 'alap', props: {} }]
  },
  BaseLayout: {
    description: 'Oldalsávos elrendezés a slot tartalmával.',
    events: ['logout'],
    variants: [
      { group: 'Szerepkörök', label: 'customer', props: { role: 'customer', userName: 'Kiss Péter' }, slot: 'Az oldal tartalma' },
      { group: 'Szerepkörök', label: 'admin', props: { role: 'admin', userName: 'Admin Anna' }, slot: 'Az oldal tartalma' }
    ]
  },
  AuthLayout: {
    description: 'Kétoszlopos belépő elrendezés (márkapanel 1280 px felett).',
    variants: [{ group: 'Alap', label: 'alap', props: {}, slot: 'A belépő kártya helye' }]
  }
}

// ---------- fülek ----------
const bigDemos = ['BaseSidebar', 'BaseHeader', 'BaseLayout', 'AuthLayout']
const available = computed(() => Object.keys(components.value).sort())
const demoable = computed(() => available.value.filter((n) => demos[n]))
const withoutDemo = computed(() => available.value.filter((n) => !demos[n]))
const hasAll = computed(() => ['StatusBadge', 'ActionButton', 'AppointmentSummaryCard'].every((n) => components.value[n]))

const tabs = computed(() => {
  const list = [{ key: 'all', label: 'Mind' }]
  demoable.value.forEach((n) => list.push({ key: n, label: n }))
  if (hasAll.value) list.push({ key: 'together', label: 'Együtt' })
  list.push({ key: 'pages', label: 'Oldalak' })
  return list
})
const currentTab = computed(() => (tabs.value.some((t) => t.key === activeTab.value) ? activeTab.value : 'all'))
const shownNames = computed(() => (currentTab.value === 'pages' ? [] : currentTab.value === 'all' ? demoable.value : demoable.value.filter((n) => n === currentTab.value)))
const pages = computed(() =>
  router
    .getRoutes()
    .filter((r) => r.path !== '/:path(.*)*' && !r.path.includes(':'))
    .map((r) => ({ path: r.path, name: String(r.name ?? ''), title: r.meta?.title ?? '' }))
    .sort((a, b) => a.path.localeCompare(b.path))
)
const previewPath = ref('')
const showTogether = computed(() => hasAll.value && ['all', 'together'].includes(currentTab.value))

function groupsOf(name) {
  const groups = []
  for (const variant of demos[name].variants) {
    let group = groups.find((g) => g.name === variant.group)
    if (!group) groups.push((group = { name: variant.group, items: [] }))
    group.items.push(variant)
  }
  return groups
}

// ---------- eseménynapló + v-model ----------
const log = ref([])
function addLog(source, event, data) {
  const stamp = new Date().toLocaleTimeString('hu-HU')
  let text
  try {
    text = JSON.stringify(data)
  } catch {
    text = String(data)
  }
  log.value = [{ id: crypto.randomUUID(), stamp, source, event, text }, ...log.value].slice(0, 30)
}

const models = ref({})
function listenersFor(name, variantKey, variant) {
  const listeners = {}
  for (const event of demos[name].events ?? []) {
    const camel = event.replace(/-(\w)/g, (_, c) => c.toUpperCase())
    const handler = 'on' + camel.charAt(0).toUpperCase() + camel.slice(1)
    listeners[handler] = (data) => addLog(name, event, data)
  }
  if (demos[name].model) {
    listeners.modelValue = models.value[variantKey] ?? ''
    listeners['onUpdate:modelValue'] = (v) => {
      models.value = { ...models.value, [variantKey]: v }
    }
  }
  return { ...variant.props, ...listeners }
}

// ---------- "Együtt" szakasz ----------
const statusOf = (a) => statusCodes[a.status]
function handleAction({ key, payload }) {
  const row = appointments.value.find((a) => a.id === payload.id)
  if (!row) return
  if (key === 'approve') row.status = 'approved'
  else if (key === 'reject') row.status = 'rejected'
  addLog('Együtt', key, payload)
}
function resetAppointments() {
  appointments.value = baseAppointments.map((a) => ({ ...a }))
}
const summaryCards = computed(() => [
  { label: 'Mai foglalások', description: 'Mára szólók', filter: (a) => a.date === today },
  { label: 'Függőben', description: 'Jóváhagyásra vár', filter: { status: 'pending' } },
  { label: 'Folyamatban', description: 'Épp dolgozunk rajta', filter: { status: 'progress' } },
  { label: 'Elkészült', description: 'Átvehető', filter: { status: 'done' } }
])
const rowActions = (a) => (a.status === 'pending' ? ['approve', 'reject', 'open'] : ['open'])

const backgrounds = [
  { key: 'bg-bg', label: 'Háttér' },
  { key: 'bg-surface', label: 'Felület' },
  { key: 'bg-surface-2', label: 'Felület 2' }
]
</script>

<template>
  <div class="mx-auto flex min-h-dvh max-w-6xl flex-col gap-6 bg-bg p-4 text-text lg:p-8">
      <header class="flex flex-wrap items-end justify-between gap-4">
        <div class="flex flex-col gap-1">
          <h1 class="font-heading text-[32px] leading-10 font-semibold">Komponens-tesztelő</h1>
          <p class="text-sm leading-5 text-text-muted">
            Az <code>src/components/reusable</code> mappa tartalmát mutatja – az adott branchen meglévő komponensek jelennek meg.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <div class="flex gap-1 rounded-md border border-border bg-surface-2 p-1" role="group" aria-label="Háttér">
            <button
              v-for="b in backgrounds"
              :key="b.key"
              type="button"
              :aria-pressed="background === b.key"
              :class="[
                'cursor-pointer rounded-sm border px-3 py-1.5 text-sm leading-5 font-medium',
                background === b.key ? 'border-border bg-surface text-text' : 'border-transparent text-text-muted hover:text-text'
              ]"
              @click="background = b.key"
            >
              {{ b.label }}
            </button>
          </div>
          <button
            type="button"
            class="cursor-pointer rounded-sm border border-border bg-surface px-3 py-1.5 text-sm leading-5 font-medium text-text-muted hover:text-text"
            @click="isDark = !isDark"
          >
            {{ isDark ? 'Világos mód' : 'Sötét mód' }}
          </button>
        </div>
      </header>

      <p v-if="!loaded" class="text-sm text-text-muted">Komponensek betöltése…</p>

      <template v-else>
        <div
          v-if="Object.keys(loadErrors).length"
          role="alert"
          class="flex flex-col gap-1 rounded-sm border border-danger bg-danger-soft px-4 py-3 text-sm leading-5 text-danger"
        >
          <p class="font-semibold">Nem sikerült betölteni:</p>
          <p v-for="(message, name) in loadErrors" :key="name">
            <strong>{{ name }}</strong> – {{ message }}
          </p>
          <p class="text-xs">Gyakori ok: a komponens importja (pl. <code>@utils/resolveColor.mjs</code>) nem található.</p>
        </div>

        <p
          v-if="!available.length"
          class="rounded-sm border border-border bg-surface px-4 py-6 text-center text-sm text-text-muted"
        >
          Ezen a branchen még nincs komponens az <code>src/components/reusable</code> mappában.
        </p>

        <template v-else>
          <nav class="flex flex-wrap gap-1 border-b border-border pb-3" aria-label="Komponensek">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              type="button"
              :aria-current="currentTab === tab.key ? 'true' : undefined"
              :class="[
                'cursor-pointer rounded-sm border px-3 py-1.5 text-[15px] leading-5 font-semibold',
                currentTab === tab.key ? 'border-accent bg-accent-soft text-accent' : 'border-transparent text-text-muted hover:text-text'
              ]"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </nav>

          <section v-if="currentTab === 'pages'" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <h2 class="font-heading text-2xl leading-8 font-semibold">Oldalak</h2>
              <p class="text-sm leading-5 text-text-muted">
                A routerben regisztrált oldalak (paraméter nélküliek). Megnyitás új lapon, vagy beágyazott előnézet.
              </p>
            </div>
            <ul class="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
              <li v-for="p in pages" :key="p.path" class="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div class="flex flex-col">
                  <span class="font-mono text-sm font-semibold">{{ p.path }}</span>
                  <span class="text-sm text-text-muted">{{ p.title || '–' }}<template v-if="p.name"> · {{ p.name }}</template></span>
                </div>
                <div class="flex gap-2">
                  <button
                    type="button"
                    class="cursor-pointer rounded-sm border border-border bg-surface px-3 py-1.5 text-sm font-medium text-text-muted hover:text-text"
                    @click="previewPath = previewPath === p.path ? '' : p.path"
                  >
                    {{ previewPath === p.path ? 'Előnézet bezárása' : 'Előnézet' }}
                  </button>
                  <RouterLink
                    :to="p.path"
                    class="rounded-sm border border-accent bg-accent px-3 py-1.5 text-sm font-semibold text-accent-text hover:opacity-90"
                  >
                    Megnyitás
                  </RouterLink>
                </div>
              </li>
            </ul>
            <iframe
              v-if="previewPath"
              :key="previewPath"
              :src="previewPath"
              :title="'Előnézet: ' + previewPath"
              class="h-[720px] w-full rounded-lg border border-border bg-bg"
            />
          </section>

          <section v-for="name in shownNames" :key="name" class="flex flex-col gap-4">
            <div class="flex flex-col gap-1">
              <h2 class="font-heading text-2xl leading-8 font-semibold">{{ name }}</h2>
              <p class="text-sm leading-5 text-text-muted">{{ demos[name].description }}</p>
            </div>
            <div :class="['flex flex-col gap-6 rounded-xl border border-border p-6', background]">
              <div v-for="group in groupsOf(name)" :key="group.name" class="flex flex-col gap-3">
                <h3 class="text-[13px] leading-4 font-medium tracking-[0.04em] text-text-muted uppercase">{{ group.name }}</h3>
                <div class="flex flex-wrap items-start gap-4">
                  <div
                    v-for="variant in group.items"
                    :key="variant.label"
                    :class="['flex flex-col gap-1.5', demos[name].itemClass, bigDemos.includes(name) ? 'w-full' : '']"
                  >
                    <div :class="bigDemos.includes(name) ? 'max-h-[640px] w-full overflow-auto rounded-lg border border-border' : 'contents'">
                    <component
                      :is="components[name]"
                      v-bind="listenersFor(name, name + group.name + variant.label, variant)"
                    >
                      <template v-if="variant.slot">{{ variant.slot }}</template>
                    </component>
                    </div>
                    <span class="text-xs leading-4 text-text-muted">{{ variant.label }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section v-if="showTogether" class="flex flex-col gap-4">
            <div class="flex items-end justify-between gap-4">
              <div class="flex flex-col gap-1">
                <h2 class="font-heading text-2xl leading-8 font-semibold">Együtt</h2>
                <p class="text-sm leading-5 text-text-muted">
                  A három komponens együtt: a Jóváhagy / Elutasít gomb átírja az állapotot, a kártyák számolnak.
                </p>
              </div>
              <button
                type="button"
                class="cursor-pointer rounded-sm border border-border bg-surface px-3 py-1.5 text-sm leading-5 font-medium text-text-muted hover:text-text"
                @click="resetAppointments"
              >
                Visszaállítás
              </button>
            </div>

            <div :class="['flex flex-col gap-6 rounded-xl border border-border p-6', background]">
              <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <component
                  :is="components.AppointmentSummaryCard"
                  v-for="card in summaryCards"
                  :key="card.label"
                  :label="card.label"
                  :description="card.description"
                  :appointments="appointments"
                  :filter="card.filter"
                />
              </div>

              <ul class="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface">
                <li v-for="a in appointments" :key="a.id" class="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <div class="flex flex-col">
                    <span class="text-[15px] leading-5 font-semibold">{{ a.customer }} · {{ a.plate }}</span>
                    <span class="text-sm leading-5 text-text-muted">{{ a.service }} · {{ a.date }}</span>
                  </div>
                  <div class="flex flex-wrap items-center gap-2">
                    <component :is="components.StatusBadge" :status="statusOf(a)" />
                    <component
                      :is="components.ActionButton"
                      v-for="key in rowActions(a)"
                      :key="key"
                      :action="actionButtons[key]"
                      :payload="{ id: a.id }"
                      @action="handleAction"
                    />
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <p v-if="withoutDemo.length" class="text-sm leading-5 text-text-muted">
            Demó nélküli komponensek: <strong>{{ withoutDemo.join(', ') }}</strong> – vedd fel a <code>demos</code> objektumba.
          </p>

          <section class="flex flex-col gap-2">
            <h2 class="text-[13px] leading-4 font-medium tracking-[0.04em] text-text-muted uppercase">Eseménynapló</h2>
            <p v-if="!log.length" class="text-sm text-text-muted">Még nem történt esemény – kattints egy gombra.</p>
            <ul v-else class="flex flex-col divide-y divide-border rounded-lg border border-border bg-surface font-mono text-xs leading-5">
              <li v-for="entry in log" :key="entry.id" class="flex flex-wrap gap-x-3 px-3 py-1.5">
                <span class="text-text-muted">{{ entry.stamp }}</span>
                <span class="font-semibold">{{ entry.source }}</span>
                <span class="text-accent">{{ entry.event }}</span>
                <span class="text-text-muted">{{ entry.text }}</span>
              </li>
            </ul>
          </section>
        </template>
      </template>
  </div>
</template>

<route lang="yaml">
name: index
meta:
  title: Főoldal
</route>
