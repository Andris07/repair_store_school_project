<script setup>
import { ref } from 'vue'
import BaseLayout from '@layouts/BaseLayout.vue'
import WorkerRepairPanel from '@components/repairs/WorkerRepairPanel.vue'

// TODO: GET /api/worker/repairs; status change: PATCH /api/worker/repairs/:id
const repairs = ref(
[
  {
    id: 3,
    status: `progress`,
    date: `2026-11-12`,
    customer: `Kiss Péter`,
    phone: `+36 30 123 4567`,
    vehicle: { plate: `ABC-123`, make: `Suzuki`, model: `Swift`, year: 2018 },
    services: [{ name: `Fékbetét csere` }],
    worker: `Szabó Gábor`,
    estimatedDone: `2026-11-13`,
    updates: [{ at: `2026-11-12T08:10`, text: `A jármű beérkezett a műhelybe.` }]
  },
  {
    id: 5,
    status: `approved`,
    date: `2026-11-12`,
    customer: `Nagy Anna`,
    vehicle: { plate: `DEF-456`, make: `Skoda`, model: `Octavia`, year: 2020 },
    services: [{ name: `Olajcsere` }],
    worker: `Szabó Gábor`,
    updates: []
  }
]);

const nowStamp = () =>
{
  const d = new Date();
  const p = (n) => String(n).padStart(2, `0`);
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

function changeStatus({ id, status })
{
  const repair = repairs.value.find((r) => r.id === id);
  if (!repair) return;
  // TODO: PATCH /api/worker/repairs/:id { status }
  repair.status = status;
  repair.updates = [...repair.updates, { at: nowStamp(), text: status === `progress` ? `A javítás megkezdődött.` : `A javítás elkészült.` }];
}

function addUpdate({ id, text })
{
  const repair = repairs.value.find((r) => r.id === id);
  // TODO: POST /api/worker/repairs/:id/updates { text }
  if (repair) repair.updates = [...repair.updates, { at: nowStamp(), text }];
}
</script>

<template>
  <BaseLayout role="worker" user-name="Szabó Gábor">
    <div class="mx-auto flex max-w-2xl flex-col gap-4">
      <h1 class="font-heading text-[32px] leading-10 font-semibold text-text">Javítás részletei</h1>

      <WorkerRepairPanel
        v-for="repair in repairs"
        :key="repair.id"
        :repair="repair"
        @status-change="changeStatus"
        @add-update="addUpdate"
      />
    </div>
  </BaseLayout>
</template>

<route lang="yaml">
name: worker-repairs
meta:
  title: Javítás részletei
</route>
