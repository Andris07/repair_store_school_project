<script setup>
import { computed } from 'vue';
import { formatDuration, formatPrice } from '@utils/format.mjs';

const props = defineProps(
{
  service:
  {
    type: Object,
    required: true
  },
  selected:
  {
    type: Boolean,
    default: false
  },
  compact:
  {
    type: Boolean,
    default: false
  }
});

const price = computed(() => formatPrice(props.service.price));
const duration = computed(() => formatDuration(props.service.duration_minutes));
</script>

<template>
  <article
    :class="
    [
      'flex h-full flex-col gap-3 rounded-xl border',
      compact ? 'p-4' : 'p-5',
      selected ? 'border-accent bg-accent-soft' : 'border-border bg-surface'
    ]"
  >
    <div class="flex items-start justify-between gap-3">
      <h3 class="font-heading text-xl leading-7 font-semibold text-text">{{ service.name }}</h3>
      <span v-if="selected" class="shrink-0 rounded-full bg-accent px-2.5 py-1 text-[13px] leading-4 font-medium tracking-[0.04em] text-accent-text">
        Kiválasztva
      </span>
    </div>

    <p v-if="service.description" :class="['text-sm leading-5 text-text-muted', compact ? 'line-clamp-2' : 'line-clamp-4']">
      {{ service.description }}
    </p>

    <div class="mt-auto flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pt-1">
      <span class="text-[17px] leading-6 font-semibold text-text">{{ price }}</span>
      <span v-if="duration" class="text-sm leading-5 text-text-muted">{{ duration }}</span>
    </div>

    <div v-if="$slots.actions" class="flex flex-wrap gap-2 border-t border-border pt-3">
      <slot name="actions" />
    </div>
  </article>
</template>
