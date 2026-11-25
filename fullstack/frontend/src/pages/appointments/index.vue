<script setup>
import { computed, ref } from 'vue';
import BaseLayout from '@layouts/BaseLayout.vue';
import CurrentRepair from '@components/repairs/CurrentRepair.vue';

// TODO: GET /api/appointments addig
const appointments = ref(
[
  {
    id: 3,
    status: `progress`,
    date: `2026-11-12`,
    vehicle: { plate: `ABC-123`, make: `Suzuki`, model: `Swift`, year: 2018 },
    services: [{ name: `Fékbetét csere` }],
    worker: `Szabó Gábor`,
    estimatedDone: `2026-11-13`,
    note: `A hátsó tárcsákat is cserélni kell, jóváhagyásra várunk.`,
    updates:
    [
      { at: `2026-11-12T08:10`, text: `A jármű beérkezett a műhelybe.` },
      { at: `2026-11-12T09:30`, text: `A javítás megkezdődött.` }
    ]
  }
]);

// last unfinished repairment job is the current one
const current = computed(() => appointments.value.find((a) => [`pending`, `approved`, `progress`].includes(a.status)) ?? null)
</script>

<template>
  <BaseLayout role="customer" user-name="Kiss Péter">
    <div class="mx-auto flex max-w-2xl flex-col gap-4">
      <h1 class="font-heading text-[32px] leading-10 font-semibold text-text">Foglalásaim</h1>

      <CurrentRepair v-if="current" :appointment="current" />
      <p v-else class="rounded-sm border border-dashed border-border px-4 py-8 text-center text-sm leading-5 text-text-muted">
        Jelenleg nincs folyamatban lévő javításod.
      </p>
    </div>
  </BaseLayout>
</template>

<route lang="yaml">
name: appointments
meta:
  title: Foglalásaim
</route>
