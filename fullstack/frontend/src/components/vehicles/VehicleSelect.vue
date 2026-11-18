<script setup>
import { useId } from 'vue';

const model = defineModel({type: [Number, String], default: null});

defineProps({
  vehicles: { type: Array, default: () => [] },
  label: { type: String, default: `Gépjármű` },
  hint: { type: String, default: `` },
  error: { type: String, default: `` },
  disabled: { type: Boolean, default: false },
  name: { type: String, default: undefined },
  addable: { type: Boolean, default: false }
});

const emit = defineEmits([`add`]);

const uid = useId();
</script>

<template>
  <fieldset :disabled="disabled" class="flex flex-col gap-2" :aria-describedby="error ? uid + `-error` : hint ? uid + `-hint` : undefined">
    <legend class="mb-1 text-sm leading-5 font-semibold text-text">{{ label }}</legend>

    <p v-if="hint && !error" :id="uid + `-hint`" class="text-sm leading-5 text-text-muted">{{ hint }}</p>

    <p
      v-if="!vehicles.length"
      class="rounded-sm border border-dashed border-border px-4 py-5 text-center text-sm leading-5 text-text-muted"
    >
      Még nincs gépjárműved, először vegyél fel egyet.
    </p>

    <label
      v-for="vehicle in vehicles"
      :key="vehicle.id"
      :class="
      [
        'flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent',
        model === vehicle.id ? `border-accent bg-accent-soft` : `border-border bg-surface hover:bg-surface-2`,
        disabled ? `cursor-not-allowed opacity-60` : ``
      ]"
    >
      <input v-model="model" type="radio" :name="name ?? uid" :value="vehicle.id" class="sr-only" />
      <span
        aria-hidden="true"
        :class="
        [
          `grid size-5 shrink-0 place-items-center rounded-full border-2`,
          model === vehicle.id ? `border-accent` : `border-border`
        ]"
      >
        <span v-if="model === vehicle.id" class="size-2.5 rounded-full bg-accent" />
      </span>
      <span class="flex min-w-0 flex-col">
        <span class="font-mono text-[15px] leading-5 font-semibold tracking-wide text-text">{{ vehicle.plate }}</span>
        <span class="truncate text-sm leading-5 text-text-muted">
          {{ vehicle.make }} {{ vehicle.model }}<template v-if="vehicle.year"> | {{ vehicle.year }}</template>
        </span>
      </span>
    </label>

    <button
      v-if="addable"
      type="button"
      class="cursor-pointer rounded-lg border border-dashed border-border px-4 py-3 text-left text-sm leading-5 font-semibold text-accent hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent"
      @click="emit(`add`)"
    >
      + Új gépjármű felvétele
    </button>

    <p v-if="error" :id="uid + `-error`" role="alert" class="text-sm leading-5 text-danger">{{ error }}</p>
  </fieldset>
</template>
