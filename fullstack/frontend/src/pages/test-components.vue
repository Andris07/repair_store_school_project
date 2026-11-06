<script setup>
/**
 * Komponens-tesztoldal – CSAK FEJLESZTÉSHEZ. Elérhető: /test-components
 *
 * Bal oldalon kiválasztod a komponenst, jobb oldalon látod:
 *   - a variánsait csoportokban (a háttér és a világos/sötét mód váltható),
 *   - egy "játszóteret", ahol JSON-ban átírhatod a paramétereket, és élőben látod az eredményt,
 *   - az eseménynaplót (pl. mit küld az ActionButton kattintáskor).
 *
 * Új komponens felvétele: src/dev/componentDemos.js
 */
import { computed, ref, watch } from 'vue'
import { useDark, useLocalStorage } from '@vueuse/core'
import BaseLayout from '@layouts/BaseLayout.vue'
import { componentDemos } from '@/dev/componentDemos.js'

// ---------- téma és háttér ----------
const isDark = useDark()

const backgrounds = [
  { id: 'bg', label: 'Oldal', class: 'bg-bg' },
  { id: 'surface', label: 'Kártya', class: 'bg-surface' },
  { id: 'surface-2', label: 'Másodlagos', class: 'bg-surface-2' }
]
const backgroundId = useLocalStorage('test-components:background', 'bg')
const previewClass = computed(() => backgrounds.find((b) => b.id === backgroundId.value)?.class ?? 'bg-bg')

// ---------- kiválasztott komponens ----------
const selectedName = useLocalStorage('test-components:component', componentDemos[0]?.name ?? '')
const selected = computed(() => componentDemos.find((d) => d.name === selectedName.value) ?? componentDemos[0])

// a variánsok csoportokba rendezve (a `group` mező alapján, a sorrend megmarad)
const groups = computed(() => {
  const result = []
  for (const variant of selected.value?.variants ?? []) {
    const title = variant.group ?? ''
    let group = result.find((g) => g.title === title)
    if (!group) {
      group = { title, items: [] }
      result.push(group)
    }
    group.items.push(variant)
  }
  return result
})

// ---------- megjelenítő segédek ----------
const replacer = (key, value) => (typeof value === 'function' ? '[függvény]' : value)
const pretty = (value) => JSON.stringify(value, replacer, 2)

// ---------- eseménynapló ----------
const eventLog = ref([])
let logCounter = 0

function logEvent(name, args) {
  const payload = args.length === 1 ? args[0] : args
  eventLog.value.unshift({
    id: ++logCounter,
    time: new Date().toLocaleTimeString('hu-HU'),
    name,
    payload: JSON.stringify(payload, replacer)
  })
  eventLog.value.splice(30)
}

// a demóban felsorolt eseményekre egy-egy figyelő, ami a naplóba ír
const listeners = computed(() =>
  Object.fromEntries((selected.value?.events ?? []).map((name) => [name, (...args) => logEvent(name, args)]))
)

// ---------- játszótér (JSON-szerkesztő) ----------
const playgroundText = ref('')
const playgroundProps = ref({})
const playgroundError = ref('')

function resetPlayground() {
  playgroundText.value = pretty(selected.value?.playground ?? {})
}

watch(
  selected,
  () => {
    resetPlayground()
    eventLog.value = []
  },
  { immediate: true }
)

watch(
  playgroundText,
  (text) => {
    try {
      const parsed = JSON.parse(text)
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        playgroundError.value = 'A paramétereket objektumként kell megadni: { ... }'
        return
      }
      playgroundProps.value = parsed
      playgroundError.value = ''
    } catch (error) {
      // hibás JSON esetén az utolsó érvényes állapot marad látható
      playgroundError.value = error.message
    }
  },
  { immediate: true }
)

const itemClass = computed(() => selected.value?.itemClass ?? 'items-start')
const layoutClass = computed(() => selected.value?.layoutClass ?? 'flex flex-wrap items-start gap-x-6 gap-y-5')
</script>

<template>
  <BaseLayout>
    <div class="space-y-6 px-4 py-8">
      <!-- fejléc és eszköztár -->
      <header class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="font-heading text-[40px] leading-[44px] font-semibold text-text">Komponens teszt</h1>
          <p class="text-text-muted">Válassz komponenst, és nézd meg a különböző állapotait.</p>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-2">
            <span class="text-sm text-text-muted">Háttér</span>
            <div class="flex overflow-hidden rounded-sm border border-border">
              <button
                v-for="bg in backgrounds"
                :key="bg.id"
                type="button"
                :aria-pressed="backgroundId === bg.id"
                :class="[
                  'cursor-pointer px-3 py-[7px] text-sm leading-5 font-medium',
                  backgroundId === bg.id ? 'bg-accent text-accent-text' : 'bg-surface text-text'
                ]"
                @click="backgroundId = bg.id"
              >
                {{ bg.label }}
              </button>
            </div>
          </div>

          <button
            type="button"
            class="cursor-pointer rounded-sm border border-border bg-surface px-3.5 py-[7px] text-[15px] leading-5 font-semibold text-text"
            @click="isDark = !isDark"
          >
            {{ isDark ? 'Világos mód' : 'Sötét mód' }}
          </button>
        </div>
      </header>

      <div class="grid gap-6 lg:grid-cols-[220px_1fr]">
        <!-- komponenslista -->
        <nav aria-label="Komponensek" class="flex flex-row flex-wrap gap-2 lg:flex-col lg:self-start">
          <button
            v-for="demo in componentDemos"
            :key="demo.name"
            type="button"
            :aria-current="selected?.name === demo.name ? 'true' : undefined"
            :class="[
              'cursor-pointer rounded-sm px-3 py-2 text-left text-[15px] leading-5 font-semibold',
              selected?.name === demo.name
                ? 'bg-accent-soft text-accent'
                : 'text-text hover:bg-surface-2'
            ]"
            @click="selectedName = demo.name"
          >
            {{ demo.name }}
          </button>
          <p v-if="componentDemos.length === 0" class="text-sm text-text-muted">
            Még nincs felvett komponens (src/dev/componentDemos.js).
          </p>
        </nav>

        <!-- kiválasztott komponens -->
        <div v-if="selected" class="min-w-0 space-y-10">
          <section class="space-y-1">
            <h2 class="font-heading text-[28px] leading-8 font-semibold text-text">{{ selected.name }}</h2>
            <p class="font-mono text-xs text-text-muted">{{ selected.path }}</p>
            <p class="text-text-muted">{{ selected.description }}</p>
          </section>

          <!-- variánsok -->
          <section class="space-y-5">
            <h3 class="text-lg leading-6 font-semibold text-text">Variánsok</h3>

            <div v-for="group in groups" :key="group.title" class="space-y-2">
              <p v-if="group.title" class="text-sm font-medium text-text-muted">{{ group.title }}</p>

              <div :class="['rounded-lg border border-border p-5', previewClass]">
                <div :class="layoutClass">
                  <div v-for="(variant, index) in group.items" :key="variant.label + index" :class="['flex flex-col gap-1.5', itemClass]">
                    <component :is="selected.component" v-bind="variant.props" v-on="listeners">
                      <template v-if="variant.slot" #default>{{ variant.slot }}</template>
                    </component>

                    <p class="text-xs text-text-muted">
                      {{ variant.label }}<template v-if="variant.note"> · {{ variant.note }}</template>
                    </p>

                    <details class="text-xs text-text-muted">
                      <summary class="cursor-pointer">props</summary>
                      <pre class="mt-1 max-w-xs overflow-x-auto rounded-sm border border-border bg-surface-2 p-2 text-text">{{
                        pretty(variant.props)
                      }}</pre>
                    </details>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- játszótér -->
          <section class="space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <h3 class="text-lg leading-6 font-semibold text-text">Játszótér</h3>
              <button
                type="button"
                class="cursor-pointer rounded-sm border border-border bg-surface px-3.5 py-[7px] text-sm leading-5 font-semibold text-text"
                @click="resetPlayground"
              >
                Visszaállítás
              </button>
            </div>
            <p class="text-sm text-text-muted">Írd át a paramétereket JSON-ban, az eredmény azonnal frissül.</p>

            <div class="grid gap-4 xl:grid-cols-2">
              <div class="space-y-2">
                <textarea
                  v-model="playgroundText"
                  spellcheck="false"
                  aria-label="Paraméterek JSON-ban"
                  rows="14"
                  class="w-full rounded-lg border border-border bg-surface p-3 font-mono text-sm leading-5 text-text"
                />
                <p v-if="playgroundError" class="text-sm text-danger" role="alert">{{ playgroundError }}</p>
              </div>

              <div :class="['flex min-h-40 items-start rounded-lg border border-border p-5', previewClass]">
                <component :is="selected.component" v-bind="playgroundProps" v-on="listeners" />
              </div>
            </div>
          </section>

          <!-- eseménynapló -->
          <section v-if="selected.events?.length" class="space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <h3 class="text-lg leading-6 font-semibold text-text">Eseménynapló</h3>
              <button
                type="button"
                class="cursor-pointer rounded-sm border border-border bg-surface px-3.5 py-[7px] text-sm leading-5 font-semibold text-text"
                @click="eventLog = []"
              >
                Napló törlése
              </button>
            </div>
            <p class="text-sm text-text-muted">
              Figyelt események: {{ selected.events.join(', ') }}. Kattints a fenti elemekre, és itt látod, mit kapna a
              szülő oldal.
            </p>

            <ul class="divide-y divide-border rounded-lg border border-border bg-surface font-mono text-sm text-text">
              <li v-if="eventLog.length === 0" class="px-3 py-2 text-text-muted">Még nem érkezett esemény.</li>
              <li v-for="entry in eventLog" :key="entry.id" class="flex flex-wrap gap-x-3 px-3 py-2">
                <span class="text-text-muted">{{ entry.time }}</span>
                <span class="font-semibold text-accent">{{ entry.name }}</span>
                <span class="break-all">{{ entry.payload }}</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  </BaseLayout>
</template>

<route lang="yaml">
name: test-components
meta:
  title: Komponens teszt
</route>
