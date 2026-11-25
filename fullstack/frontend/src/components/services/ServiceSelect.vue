<script setup>
import { computed, ref, useId } from 'vue'
import ServiceCard from '@components/services/ServiceCard.vue'
import { formatDuration, formatPrice } from '@utils/format.mjs'

const model = defineModel({ type: [Number, String, Array], default: null })

const props = defineProps({
  services: { type: Array, default: () => [] },
  multiple: { type: Boolean, default: false },
  searchable: { type: Boolean, default: false },
  label: { type: String, default: 'Szolgáltatás' },
  hint: { type: String, default: '' },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  name: { type: String, default: undefined }
})

const uid = useId()
const query = ref('')

const visible = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.services
  return props.services.filter((s) => `${s.name} ${s.description ?? ''}`.toLowerCase().includes(q))
})

const isSelected = (id) => (props.multiple ? (model.value ?? []).includes(id) : model.value === id)

const chosen = computed(() => props.services.filter((s) => isSelected(s.id)))
const totalPrice = computed(() => chosen.value.reduce((sum, s) => sum + (Number(s.price) || 0), 0))
const totalMinutes = computed(() => chosen.value.reduce((sum, s) => sum + (s.duration_minutes || 0), 0))

if (props.multiple && !Array.isArray(model.value)) model.value = []
</script>

<template>
  <fieldset :disabled="disabled" class="flex flex-col gap-3" :aria-describedby="error ? uid + '-error' : hint ? uid + '-hint' : undefined">
    <legend class="mb-1 text-sm leading-5 font-semibold text-text">{{ label }}</legend>
    <p v-if="hint && !error" :id="uid + '-hint'" class="text-sm leading-5 text-text-muted">{{ hint }}</p>

    <input
      v-if="searchable"
      v-model="query"
      type="search"
      placeholder="Keresés a szolgáltatások között…"
      aria-label="Szolgáltatások szűrése"
      class="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-[15px] leading-5 text-text placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-accent"
    />

    <p v-if="!services.length" class="rounded-sm border border-dashed border-border px-4 py-6 text-center text-sm text-text-muted">
      Jelenleg nincs elérhető szolgáltatás.
    </p>
    <p v-else-if="!visible.length" class="rounded-sm border border-dashed border-border px-4 py-6 text-center text-sm text-text-muted">
      Nincs találat a keresésre.
    </p>

    <div class="grid gap-3 sm:grid-cols-2">
      <label
        v-for="service in visible"
        :key="service.id"
        :class="[
          'block cursor-pointer rounded-xl has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent',
          disabled ? 'cursor-not-allowed opacity-60' : ''
        ]"
      >
        <input
          v-model="model"
          :type="multiple ? 'checkbox' : 'radio'"
          :name="name ?? uid"
          :value="service.id"
          class="sr-only"
        />
        <ServiceCard :service="service" :selected="isSelected(service.id)" compact />
      </label>
    </div>

    <p
      v-if="multiple && chosen.length"
      class="flex flex-wrap justify-between gap-x-4 rounded-sm border border-border bg-surface-2 px-4 py-3 text-sm leading-5 text-text"
      aria-live="polite"
    >
      <span class="font-semibold">{{ chosen.length }} szolgáltatás</span>
      <span>
        {{ formatPrice(totalPrice) }}<template v-if="totalMinutes"> · {{ formatDuration(totalMinutes) }}</template>
      </span>
    </p>

    <p v-if="error" :id="uid + '-error'" role="alert" class="text-sm leading-5 text-danger">{{ error }}</p>
  </fieldset>
</template>
