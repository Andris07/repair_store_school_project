<script setup>
import { computed } from `vue`;
import { resolveColor } from `@utils/resolveColor.mjs`;

const props = defineProps({
  status:
  {
    type: Object,
    required: true,
    validator: (status) => typeof status?.name === `string` && status.name.length > 0
  }
});

const showBackground = computed(() => props.status.displayBackground !== false);

const colors = computed(() =>
({
  color: resolveColor(props.status.fontColor, `text-muted`),
  backgroundColor: showBackground.value ? resolveColor(props.status.backgroundColor, `surface-2`) : `transparent`
}));
</script>

<template>
  <span
    data-slot="status-badge"
    :class="[
      'inline-flex items-center whitespace-nowrap text-[13px] leading-4 font-medium tracking-[0.04em]',
      showBackground ? 'rounded-full px-2.5 py-1' : ''
    ]"
    :style="colors"
  >{{ status.name }}</span>
</template>