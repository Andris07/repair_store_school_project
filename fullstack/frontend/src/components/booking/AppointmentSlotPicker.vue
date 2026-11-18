<script setup>

import { computed, ref, useId, watch } from 'vue'
import { buildMonthGrid, buildSlots, parseDateKey, toDateKey, toSlotValue } from '@utils/slots.mjs'

const model = defineModel({ type: String, default: '' })

const props = defineProps({
  booked: { type: Array, default: () => [] },
  closedDates: { type: Array, default: () => [] },
  openDays: { type: Array, default: () => [0, 1, 2, 3, 4] },
  open: { type: String, default: '08:00' },
  close: { type: String, default: '17:00' },
  slotMinutes: { type: Number, default: 30 },
  breakStart: { type: String, default: '' },
  breakEnd: { type: String, default: '' },
  maxDate: { type: String, default: '' },
  label: { type: String, default: 'Időpont' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

const uid = useId()
const weekdays = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V']

const now = new Date()
const todayKey = toDateKey(now)
const nowMinutes = now.getHours() * 60 + now.getMinutes()

const selectedDate = computed(() => model.value.slice(0, 10))
const selectedTime = computed(() => model.value.slice(11, 16))

const initial = selectedDate.value ? parseDateKey(selectedDate.value) : now
const viewYear = ref(initial.getFullYear())
const viewMonth = ref(initial.getMonth())

const monthTitle = computed(() =>
  new Date(viewYear.value, viewMonth.value, 1).toLocaleDateString('hu-HU', { year: 'numeric', month: 'long' })
)
const grid = computed(() => buildMonthGrid(viewYear.value, viewMonth.value))
const slots = computed(() =>
  buildSlots({ open: props.open, close: props.close, slotMinutes: props.slotMinutes, breakStart: props.breakStart, breakEnd: props.breakEnd })
)

const toMinutes = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5))
const slotBooked = (dateKey, time) => props.booked.includes(toSlotValue(dateKey, time))
const slotPast = (dateKey, time) => dateKey < todayKey || (dateKey === todayKey && toMinutes(time) <= nowMinutes)

function dayDisabled(day) {
  if (!day.inMonth) return true
  if (day.key < todayKey) return true
  if (props.maxDate && day.key > props.maxDate) return true
  if (!props.openDays.includes(day.weekday)) return true
  if (props.closedDates.includes(day.key)) return true
  return slots.value.every((t) => slotBooked(day.key, t) || slotPast(day.key, t))
}

const freeSlots = computed(() => (selectedDate.value ? slots.value.filter((t) => !slotBooked(selectedDate.value, t) && !slotPast(selectedDate.value, t)).length : 0))

const canGoPrev = computed(() => viewYear.value > now.getFullYear() || viewMonth.value > now.getMonth())
const canGoNext = computed(() => {
  if (!props.maxDate) return true
  const max = parseDateKey(props.maxDate)
  return viewYear.value < max.getFullYear() || (viewYear.value === max.getFullYear() && viewMonth.value < max.getMonth())
})

function shiftMonth(delta) {
  const d = new Date(viewYear.value, viewMonth.value + delta, 1)
  viewYear.value = d.getFullYear()
  viewMonth.value = d.getMonth()
}

function pickDay(day) {
  if (dayDisabled(day)) return
  const keepTime = selectedTime.value && !slotBooked(day.key, selectedTime.value) && !slotPast(day.key, selectedTime.value)
  model.value = keepTime ? toSlotValue(day.key, selectedTime.value) : day.key
}

function pickTime(time) {
  if (!selectedDate.value || slotBooked(selectedDate.value, time) || slotPast(selectedDate.value, time)) return
  model.value = toSlotValue(selectedDate.value, time)
}

watch(selectedDate, (key) => {
  if (!key) return
  const d = parseDateKey(key)
  viewYear.value = d.getFullYear()
  viewMonth.value = d.getMonth()
})

const summary = computed(() => {
  if (!selectedDate.value) return ''
  const day = parseDateKey(selectedDate.value).toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
  return selectedTime.value ? `${day}, ${selectedTime.value}` : day
})
</script>

<template>
  <fieldset :disabled="disabled" class="flex flex-col gap-3" :aria-describedby="error ? uid + '-error' : hint ? uid + '-hint' : undefined">
    <legend class="mb-1 text-sm leading-5 font-semibold text-text">{{ label }}</legend>
    <p v-if="hint && !error" :id="uid + '-hint'" class="text-sm leading-5 text-text-muted">{{ hint }}</p>

    <div :class="['grid gap-4 md:grid-cols-[minmax(0,20rem)_1fr]', disabled ? 'opacity-60' : '']">
      <div class="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
        <div class="flex items-center justify-between gap-2">
          <button
            type="button"
            :disabled="!canGoPrev"
            aria-label="Előző hónap"
            class="grid size-9 cursor-pointer place-items-center rounded-sm border border-border text-text hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40"
            @click="shiftMonth(-1)"
          >
            ‹
          </button>
          <span class="text-[15px] leading-5 font-semibold text-text capitalize" aria-live="polite">{{ monthTitle }}</span>
          <button
            type="button"
            :disabled="!canGoNext"
            aria-label="Következő hónap"
            class="grid size-9 cursor-pointer place-items-center rounded-sm border border-border text-text hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40"
            @click="shiftMonth(1)"
          >
            ›
          </button>
        </div>

        <div class="grid grid-cols-7 gap-1 text-center text-xs leading-4 font-medium text-text-muted">
          <span v-for="w in weekdays" :key="w" class="py-1">{{ w }}</span>
        </div>

        <div class="grid grid-cols-7 gap-1">
          <template v-for="day in grid" :key="day.key">
            <span v-if="!day.inMonth" aria-hidden="true" />
            <button
              v-else
              type="button"
              :disabled="dayDisabled(day)"
              :aria-pressed="day.key === selectedDate"
              :aria-label="parseDateKey(day.key).toLocaleDateString('hu-HU', { month: 'long', day: 'numeric', weekday: 'long' })"
              :class="[
                'grid aspect-square cursor-pointer place-items-center rounded-sm border text-sm leading-5 font-medium focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none',
                day.key === selectedDate
                  ? 'border-accent bg-accent text-accent-text'
                  : day.key === todayKey
                    ? 'border-accent text-accent hover:bg-accent-soft'
                    : 'border-transparent text-text hover:bg-surface-2',
                dayDisabled(day) ? 'text-text-muted/50 line-through decoration-transparent opacity-40' : ''
              ]"
              @click="pickDay(day)"
            >
              {{ day.day }}
            </button>
          </template>
        </div>
      </div>

      <div class="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4">
        <p class="text-[15px] leading-5 font-semibold text-text">Szabad időpontok</p>

        <p v-if="!selectedDate" class="text-sm leading-5 text-text-muted">Előbb válassz egy napot a naptárban.</p>
        <p v-else-if="!freeSlots" class="text-sm leading-5 text-text-muted">Ezen a napon nincs szabad időpont.</p>

        <div v-else class="grid grid-cols-3 gap-2 sm:grid-cols-4">
          <button
            v-for="time in slots"
            :key="time"
            type="button"
            :disabled="slotBooked(selectedDate, time) || slotPast(selectedDate, time)"
            :aria-pressed="time === selectedTime"
            :class="[
              'cursor-pointer rounded-sm border px-2 py-2 text-sm leading-5 font-semibold focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40',
              time === selectedTime ? 'border-accent bg-accent text-accent-text' : 'border-border bg-surface text-text hover:bg-surface-2'
            ]"
            @click="pickTime(time)"
          >
            {{ time }}
          </button>
        </div>
      </div>
    </div>

    <p v-if="summary" class="rounded-sm border border-border bg-surface-2 px-4 py-3 text-sm leading-5 text-text" aria-live="polite">
      Választott időpont: <strong>{{ summary }}</strong>
    </p>
    <p v-if="error" :id="uid + '-error'" role="alert" class="text-sm leading-5 text-danger">{{ error }}</p>
  </fieldset>
</template>
