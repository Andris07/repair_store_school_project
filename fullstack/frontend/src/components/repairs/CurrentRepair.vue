<script setup>
import { computed } from 'vue';
import StatusBadge from '@components/reusable/StatusBadge.vue';
import { statusCodes, statusSteps } from '@utils/statuses.mjs';

const props = defineProps(
{
  appointment:
  {
    type: Object,
    required: true
  },
  title:
  {
    type: String,
    default: `Aktuális javítás`
  }
});

const status = computed(() => statusCodes[props.appointment.status] ?? statusCodes.pending);
const rejected = computed(() => props.appointment.status === `rejected`);
const currentIndex = computed(() => statusSteps.indexOf(props.appointment.status));

const steps = computed(() =>
  statusSteps.map((key, index) =>
  ({
    key,
    name: statusCodes[key].name,
    state: index < currentIndex.value || props.appointment.status === `done` ? `done` : index === currentIndex.value ? `current` : `todo`
  }))
);

const fmtDate = (value) =>
  value ? new Date(value.length === 10 ? value + `T00:00` : value).toLocaleDateString(`hu-HU`, { year: `numeric`, month: `long`, day: `numeric` }) : ``;
const fmtDateTime = (value) =>
  new Date(value).toLocaleString(`hu-HU`, { month: `short`, day: `numeric`, hour: `2-digit`, minute: `2-digit` });

const vehicleText = computed(() =>
{
  const v = props.appointment.vehicle ?? {};
  return [v.make, v.model, v.year ? `(${v.year})` : ``].filter(Boolean).join(` `);
});

const updates = computed(() => [...(props.appointment.updates ?? [])].sort((a, b) => b.at.localeCompare(a.at)));
</script>

<template>
  <section class="flex flex-col gap-5 rounded-xl border border-border bg-surface p-5 sm:p-6" :aria-label="title">
    <header class="flex flex-wrap items-start justify-between gap-3">
      <div class="flex flex-col gap-1">
        <p class="text-[13px] leading-4 font-medium tracking-[0.04em] text-text-muted uppercase">{{ title }}</p>
        <h2 class="font-heading text-2xl leading-8 font-semibold text-text">
          {{ (appointment.services ?? []).map((s) => s.name).join(`, `) || `Javítás` }}
        </h2>
      </div>
      <StatusBadge :status="status" />
    </header>

    <dl class="grid gap-x-6 gap-y-3 text-sm leading-5 sm:grid-cols-2">
      <div>
        <dt class="text-text-muted">Gépjármű</dt>
        <dd class="font-medium text-text">
          <span class="font-mono font-semibold tracking-wide">{{ appointment.vehicle?.plate }}</span>
          <span v-if="vehicleText"> · {{ vehicleText }}</span>
        </dd>
      </div>
      <div>
        <dt class="text-text-muted">Időpont</dt>
        <dd class="font-medium text-text">{{ fmtDate(appointment.date) }}</dd>
      </div>
      <div v-if="appointment.worker">
        <dt class="text-text-muted">Felelős szerelő</dt>
        <dd class="font-medium text-text">{{ appointment.worker }}</dd>
      </div>
      <div v-if="appointment.estimatedDone && !rejected">
        <dt class="text-text-muted">Várható elkészülés</dt>
        <dd class="font-medium text-text">{{ fmtDate(appointment.estimatedDone) }}</dd>
      </div>
    </dl>

    <p v-if="rejected" role="status" class="rounded-sm border border-danger bg-danger-soft px-4 py-3 text-sm leading-5 text-danger">
      A foglalást elutasítottuk.<template v-if="appointment.note"> {{ appointment.note }}</template>
    </p>

    <ol v-else class="grid grid-cols-4 gap-2" aria-label="A javítás lépései">
      <li v-for="(step, index) in steps" :key="step.key" class="flex flex-col gap-2" :aria-current="step.state === `current` ? `step` : undefined">
        <span
          :class="
          [
            'h-1.5 rounded-full',
            step.state === 'done' ? 'bg-ok' : step.state === 'current' ? 'bg-accent' : 'bg-surface-2'
          ]"
        />
        <span
          :class="
          [
            'text-[13px] leading-4 font-medium',
            step.state === 'todo' ? 'text-text-muted' : step.state === 'current' ? 'text-accent' : 'text-text'
          ]"
        >
          {{ index + 1 }}. {{ step.name }}
        </span>
      </li>
    </ol>

    <p v-if="appointment.note && !rejected" class="rounded-sm border border-border bg-surface-2 px-4 py-3 text-sm leading-5 text-text">
      <span class="font-semibold">Megjegyzés a szervizből:</span> {{ appointment.note }}
    </p>

    <div v-if="updates.length" class="flex flex-col gap-2">
      <h3 class="text-sm leading-5 font-semibold text-text">Események</h3>
      <ul class="flex flex-col gap-2 border-l-2 border-border pl-4">
        <li v-for="update in updates" :key="update.at + update.text" class="flex flex-col">
          <span class="text-xs leading-4 text-text-muted">{{ fmtDateTime(update.at) }}</span>
          <span class="text-sm leading-5 text-text">{{ update.text }}</span>
        </li>
      </ul>
    </div>

    <div v-if="$slots.actions" class="flex flex-wrap gap-2 border-t border-border pt-4">
      <slot name="actions" />
    </div>
  </section>
</template>
