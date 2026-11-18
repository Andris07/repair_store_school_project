<script setup>
import { ref } from 'vue';
import BaseLayout from '@layouts/BaseLayout.vue';
import VehicleList from '@components/vehicles/VehicleList.vue';

// TODO: real data from database – GET /api/vehicles
const vehicles = ref(
[
  { id: 1, plate: `ABC-123`, make: `Suzuki`, model: `Swift`, year: 2018 },
  { id: 2, plate: `DEF-456`, make: `Skoda`, model: `Octavia`, year: 2020 },
  { id: 3, plate: `GHI-789`, make: `Opel`, model: `Astra`, year: 2015 },
  { id: 4, plate: `JKL-012`, make: `Ford`, model: `Focus`, year: 2012 }
]);

function removeVehicle(vehicle)
{
  // TODO: DELETE /api/vehicles/:id
  vehicles.value = vehicles.value.filter((v) => v.id !== vehicle.id)
}

function editVehicle(vehicle)
{
  // TODO: edit form
}
</script>

<template>
  <BaseLayout role="customer" user-name="Kiss Péter">
    <div class="mx-auto flex max-w-2xl flex-col gap-4">
      <h1 class="font-heading text-[32px] leading-10 font-semibold text-text">Gépjárműveim</h1>
      <VehicleList :vehicles="vehicles" mode="scroll" height="22rem" editable removable @edit="editVehicle" @remove="removeVehicle" />
    </div>
  </BaseLayout>
</template>

<route lang="yaml">
name: vehicles
meta:
  title: Gépjárműveim
</route>
