<script setup>
import { computed } from 'vue';

const props = defineProps({
  label:
  {
    type: String,
    required: true
  },
  description:
  {
    type: String,
    default: ``
  },
  appointments:
  {
    type: Array,
    default: () => []
  },
  filter:
  {
    type: [Object, Function],
    default: null
  },
  count:
  {
    type: Number,
    default: null
  }
});

function matches(item)
{
  const { filter } = props;

  if (filter === null) return true;
  if (typeof filter === `function`) return Boolean(filter(item));

  return Object.entries(filter).every(
    ([field, expected]) => Array.isArray(expected) ? expected.includes(item[field]) : item[field] === expected
  );
}

const total = computed(() => props.count ?? props.appointments.filter(matches).length);
const displayTotal = computed(() => total.value.toLocaleString(`hu-HU`));
</script>

<template>
  <section
    data-slot="appointment-summary-card"
    class="flex flex-col gap-1 rounded-lg border border-border bg-surface p-5"
  >
    <p class="text-[13px] leading-4 font-medium tracking-[0.04em] text-text-muted uppercase">{{ label }}</p>
    <p class="font-heading text-[40px] leading-[44px] font-semibold text-text">{{ displayTotal }}</p>
    <p v-if="description" class="text-sm leading-5 text-text-muted">{{ description }}</p>
  </section>
</template>
