<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps(
{
  vehicles: { type: Array, default: () => [] },
  mode: { type: String, default: `scroll`, validator: (v) => [`scroll`, `pages`].includes(v) },
  pageSize: { type: Number, default: 2 },
  height: { type: String, default: `22rem` },
  selectedId: { type: [Number, String], default: null },
  title: { type: String, default: `Gépjárműveim` },
  emptyText: { type: String, default: `Még nincs rögzített gépjárműved.` },
  selectable: { type: Boolean, default: false },
  editable: { type: Boolean, default: false },
  removable: { type: Boolean, default: false }
});

const emit = defineEmits([`select`, `edit`, `remove`]);

const page = ref(1);
const pageCount = computed(() => Math.max(1, Math.ceil(props.vehicles.length / props.pageSize)));
const shown = computed(() =>
{
  if (props.mode !== `pages`) return props.vehicles;
  const start = (page.value - 1) * props.pageSize;
  return props.vehicles.slice(start, start + props.pageSize);
});

// don't stay on a non-existing page if the list shortens (after deletion for example)
watch(pageCount, (count) =>
{
  if (page.value > count) page.value = count;
});
</script>

<template>
  <section class="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4" :aria-label="title">
    <header class="flex items-baseline justify-between gap-3">
      <h2 class="font-heading text-xl leading-7 font-semibold text-text">{{ title }}</h2>
      <span class="text-sm leading-5 text-text-muted">{{ vehicles.length }} db</span>
    </header>

    <p
      v-if="!vehicles.length"
      class="rounded-sm border border-dashed border-border px-4 py-8 text-center text-sm leading-5 text-text-muted"
    >
      {{ emptyText }}
    </p>

    <ul
      v-else
      :class="[`flex flex-col gap-2`, mode === `scroll` ? `overflow-y-auto pr-1` : ``]"
      :style="mode === `scroll` ? { height } : undefined"
      :tabindex="mode === `scroll` ? 0 : undefined"
      :aria-label="mode === `scroll` ? title + ` (görgethető lista)` : undefined"
    >
      <li
        v-for="vehicle in shown"
        :key="vehicle.id"
        :class="[
          `flex flex-wrap items-center justify-between gap-3 rounded-lg border px-4 py-3`,
          vehicle.id === selectedId ? `border-accent bg-accent-soft` : `border-border bg-surface`
        ]"
      >
        <div class="flex min-w-0 flex-col gap-0.5">
          <span class="font-mono text-[15px] leading-5 font-semibold tracking-wide text-text">{{ vehicle.plate }}</span>
          <span class="truncate text-sm leading-5 text-text-muted">
            {{ vehicle.make }} {{ vehicle.model }}<template v-if="vehicle.year"> · {{ vehicle.year }}</template>
          </span>
          <span v-if="vehicle.note" class="truncate text-xs leading-4 text-text-muted">{{ vehicle.note }}</span>
        </div>

        <div class="flex gap-2">
          <button
            v-if="selectable"
            type="button"
            class="cursor-pointer rounded-sm border border-border bg-surface px-3 py-1.5 text-sm leading-5 font-semibold text-text hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent"
            @click="emit(`select`, vehicle)"
          >
            Kiválaszt
          </button>
          <button
            v-if="editable"
            type="button"
            class="cursor-pointer rounded-sm border border-border bg-surface px-3 py-1.5 text-sm leading-5 font-semibold text-text hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent"
            @click="emit(`edit`, vehicle)"
          >
            Szerkeszt
          </button>
          <button
            v-if="removable"
            type="button"
            class="cursor-pointer rounded-sm border border-danger bg-surface px-3 py-1.5 text-sm leading-5 font-semibold text-danger hover:bg-danger-soft focus-visible:outline-2 focus-visible:outline-danger"
            @click="emit(`remove`, vehicle)"
          >
            Töröl
          </button>
        </div>
      </li>
    </ul>

    <nav
      v-if="mode === `pages` && pageCount > 1"
      class="flex items-center justify-between gap-3 border-t border-border pt-3"
      aria-label="Lapozás"
    >
      <button
        type="button"
        :disabled="page <= 1"
        class="cursor-pointer rounded-sm border border-border bg-surface px-3 py-1.5 text-sm leading-5 font-semibold text-text hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-50"
        @click="page--"
      >
        Előző
      </button>
      <span class="text-sm leading-5 text-text-muted" aria-live="polite">{{ page }} / {{ pageCount }}</span>
      <button
        type="button"
        :disabled="page >= pageCount"
        class="cursor-pointer rounded-sm border border-border bg-surface px-3 py-1.5 text-sm leading-5 font-semibold text-text hover:bg-surface-2 disabled:pointer-events-none disabled:opacity-50"
        @click="page++"
      >
        Következő
      </button>
    </nav>
  </section>
</template>
