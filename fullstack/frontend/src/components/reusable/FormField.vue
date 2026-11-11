<script setup>
import { computed, ref, useId } from 'vue';

const model = defineModel({ type: String, default: `` });

const props = defineProps({
  label:
  {
    type: String,
    required: true
  },
  type:
  {
    type: String,
    default: `text`
  },
  name:
  {
    type: String,
    default: undefined
  },
  placeholder:
  {
    type: String,
    default: ``
  },
  autocomplete:
  {
    type: String,
    default: undefined
  },
  inputmode:
  {
    type: String,
    default: undefined
  },
  error:
  {
    type: String,
    default: ``
  },
  hint:
  {
    type: String,
    default: ``
  },
  optional:
  {
    type: Boolean,
    default: false
  },
  disabled:
  {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([`blur`]);

const id = useId();
const hintId = `${id}-hint`;
const errorId = `${id}-error`;

const isPassword = computed(() => props.type === `password`);
const revealed = ref(false);
const inputType = computed(() => (isPassword.value && revealed.value ? `text` : props.type));

const describedBy = computed(() =>
{
  if (props.error) return errorId;
  if (props.hint) return hintId;
  return undefined;
})
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label :for="id" class="flex items-baseline justify-between text-sm leading-5 font-medium text-text">
      <span>{{ label }}</span>
      <span v-if="optional" class="font-normal text-text-muted">opcionális</span>
    </label>

    <div class="relative">
      <input
        :id="id"
        v-model="model"
        :type="inputType"
        :name="name"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :inputmode="inputmode"
        :disabled="disabled"
        :aria-invalid="error ? 'true' : undefined"
        :aria-describedby="describedBy"
        :class="[
          'w-full rounded-sm border bg-surface px-3.5 py-3 text-base leading-6 text-text placeholder:text-text-muted',
          'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent disabled:opacity-60',
          error ? 'border-danger' : 'border-border',
          isPassword ? 'pr-20' : ''
        ]"
        @blur="emit('blur')"
      />

      <button
        v-if="isPassword"
        type="button"
        :aria-pressed="revealed"
        class="absolute inset-y-1.5 right-1.5 cursor-pointer rounded-sm px-2.5 text-sm font-semibold text-accent focus-visible:outline-2 focus-visible:outline-accent"
        @click="revealed = !revealed"
      >
        {{ revealed ? 'Rejt' : 'Mutat' }}<span class="sr-only"> (jelszó)</span>
      </button>
    </div>

    <p v-if="error" :id="errorId" class="text-sm leading-5 text-danger">{{ error }}</p>
    <p v-else-if="hint" :id="hintId" class="text-sm leading-5 text-text-muted">{{ hint }}</p>
  </div>
</template>
