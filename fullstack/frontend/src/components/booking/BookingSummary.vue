<script setup>
import { computed } from 'vue'
import { formatDuration, formatPrice } from '@utils/format.mjs'

const props = defineProps({
  vehicle: { type: Object, default: null },
  services: { type: Array, default: () => [] },
  dateTime: { type: String, default: '' },
  note: { type: String, default: '' },
  editable: { type: Boolean, default: false },
  title: { type: String, default: 'Foglalás összegzése' }
})

const emit = defineEmits(['edit'])

const totalPrice = computed(() => props.services.reduce((sum, s) => sum + (Number(s.price) || 0), 0))
const totalMinutes = computed(() => props.services.reduce((sum, s) => sum + (s.duration_minutes || 0), 0))

const vehicleText = computed(() =>
  props.vehicle ? [props.vehicle.make, props.vehicle.model, props.vehicle.year ? `(${props.vehicle.year})` : ''].filter(Boolean).join(' ') : ''
)

const slotText = computed(() => {
  if (!props.dateTime) return ''
  const [date, time] = props.dateTime.split('T')
  const day = new Date(date + 'T00:00').toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
  return time ? `${day}, ${time}` : day
})

const sections = computed(() => [
  { key: 'vehicle', label: 'Gépjármű', filled: !!props.vehicle, empty: 'Még nincs kiválasztva' },
  { key: 'services', label: 'Szolgáltatások', filled: props.services.length > 0, empty: 'Még nincs kiválasztva' },
  { key: 'slot', label: 'Időpont', filled: !!props.dateTime, empty: 'Még nincs kiválasztva' }
])
const filled = (key) => sections.value.find((s) => s.key === key)
</script>

<template>
  <aside class="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5" :aria-label="title">
    <h2 class="font-heading text-xl leading-7 font-semibold text-text">{{ title }}</h2>

    <dl class="flex flex-col divide-y divide-border">
      <div v-for="section in sections" :key="section.key" class="flex flex-col gap-1 py-3 first:pt-0">
        <div class="flex items-center justify-between gap-3">
          <dt class="text-sm leading-5 text-text-muted">{{ section.label }}</dt>
          <button
            v-if="editable && section.filled"
            type="button"
            class="cursor-pointer text-sm leading-5 font-semibold text-accent hover:underline focus-visible:outline-2 focus-visible:outline-accent"
            @click="emit('edit', section.key)"
          >
            Módosít
          </button>
        </div>

        <dd v-if="!section.filled" class="text-sm leading-5 text-text-muted italic">{{ section.empty }}</dd>

        <dd v-else-if="section.key === 'vehicle'" class="text-[15px] leading-5 font-medium text-text">
          <span class="font-mono font-semibold tracking-wide">{{ vehicle.plate }}</span>
          <span v-if="vehicleText" class="block text-sm font-normal text-text-muted">{{ vehicleText }}</span>
        </dd>

        <dd v-else-if="section.key === 'services'">
          <ul class="flex flex-col gap-1.5">
            <li v-for="s in services" :key="s.id" class="flex items-baseline justify-between gap-3 text-[15px] leading-5 text-text">
              <span>{{ s.name }}</span>
              <span class="shrink-0 text-sm text-text-muted">{{ formatPrice(s.price) }}</span>
            </li>
          </ul>
        </dd>

        <dd v-else class="text-[15px] leading-5 font-medium text-text">{{ slotText }}</dd>
      </div>
    </dl>

    <p v-if="note" class="rounded-sm border border-border bg-surface-2 px-3.5 py-2.5 text-sm leading-5 text-text">
      <span class="font-semibold">Megjegyzés:</span> {{ note }}
    </p>

    <div class="flex items-baseline justify-between gap-3 border-t border-border pt-4">
      <span class="text-sm leading-5 text-text-muted">
        Becsült ár<template v-if="totalMinutes"> · {{ formatDuration(totalMinutes) }}</template>
      </span>
      <span class="font-heading text-[28px] leading-8 font-semibold text-text">{{ formatPrice(totalPrice) || '0 Ft' }}</span>
    </div>

    <div v-if="$slots.actions" class="flex flex-col gap-2"><slot name="actions" /></div>
  </aside>
</template>
