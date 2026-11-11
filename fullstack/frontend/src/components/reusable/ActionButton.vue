<script setup>
import { computed } from 'vue';
import { resolveColor } from '@utils/resolveColor.mjs';

const props = defineProps({
  action:
  {
    type: Object,
    required: true,
    validator: (action) => typeof action?.name === `string` && action.name.length > 0
  },
  payload:
  {
    type: null,
    default: null
  },
  size:
  {
    type: String,
    default: `sm`,
    validator: (value) => [`sm`, `md`].includes(value)
  },
  disabled:
  {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([`action`]);

const colors = computed(() =>
({
  color: resolveColor(props.action.fontColor, `text`),
  backgroundColor: resolveColor(props.action.backgroundColor, `transparent`),
  borderColor: resolveColor(props.action.borderColor, `transparent`)
}));

function handleClick()
{
  emit(`action`,
  {
    key: props.action.key ?? props.action.name,
    payload: props.payload
  });
}
</script>

<template>
  <button
    type="button"
    data-slot="action-button"
    :disabled="disabled"
    :class="[
      'inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-sm border text-[15px] leading-5 font-semibold transition-opacity',
      'hover:opacity-90 active:opacity-80',
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
      'disabled:pointer-events-none disabled:opacity-50',
      size === 'md' ? 'px-5 py-3' : 'px-3.5 py-[7px]'
    ]"
    :style="colors"
    @click="handleClick"
  >
    <slot>{{ action.name }}</slot>
  </button>
</template>
