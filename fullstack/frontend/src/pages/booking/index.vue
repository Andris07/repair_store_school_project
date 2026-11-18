<script setup>
import { computed, ref } from 'vue'
import BaseLayout from '@layouts/BaseLayout.vue'
import VehicleSelect from '@components/vehicles/VehicleSelect.vue'
import ServiceSelect from '@components/services/ServiceSelect.vue'
import AppointmentSlotPicker from '@components/booking/AppointmentSlotPicker.vue'

// TODO: valódi adat – GET /api/vehicles és GET /api/services (lásd @utils/http.mjs); addig mintaadat
const vehicles = ref([
  { id: 1, plate: 'ABC-123', make: 'Suzuki', model: 'Swift', year: 2018 },
  { id: 2, plate: 'DEF-456', make: 'Skoda', model: 'Octavia', year: 2020 }
])
const services = ref([
  { id: 1, name: 'Olajcsere', description: 'Motorolaj és olajszűrő csere, szintellenőrzés.', price: 18000, duration_minutes: 60 },
  { id: 2, name: 'Fékbetét csere', description: 'Első vagy hátsó fékbetét cseréje, fékrendszer-ellenőrzés.', price: 32000, duration_minutes: 90 },
  { id: 3, name: 'Műszaki vizsga felkészítés', description: 'Teljes átvizsgálás a műszaki vizsga előtt.', price: 25000, duration_minutes: 120 },
  { id: 4, name: 'Klímatöltés', description: 'Klímarendszer ellenőrzése és utántöltése.', price: 22000, duration_minutes: 45 }
])

const vehicleId = ref(null)
const serviceIds = ref([])
const date = ref('')
// TODO: a foglalt idősávok a backendről (GET /api/appointments?booked) – addig üres
const booked = ref([])

const submitted = ref(false)
const errors = computed(() => ({
  vehicle: vehicleId.value ? '' : 'Válassz egy gépjárművet.',
  services: serviceIds.value.length ? '' : 'Válassz legalább egy szolgáltatást.',
  date: date.value.length === 16 ? '' : 'Válassz napot és időpontot.'
}))
const show = (key) => (submitted.value ? errors.value[key] : '')

const sent = ref(false)
function submit() {
  submitted.value = true
  if (Object.values(errors.value).some(Boolean)) return
  // TODO: POST /api/booking  { vehicleId, serviceIds, appointmentDate }
  sent.value = true
}
</script>

<template>
  <BaseLayout role="customer" user-name="Kiss Péter">
    <div class="mx-auto flex max-w-3xl flex-col gap-6">
      <h1 class="font-heading text-[32px] leading-10 font-semibold text-text">Időpontfoglalás</h1>

      <p v-if="sent" role="status" class="rounded-sm border border-ok bg-ok-soft px-4 py-3 text-sm leading-5 text-ok">
        A foglalás rögzítve (helyőrző). A jóváhagyásról értesítést kapsz.
      </p>

      <form class="flex flex-col gap-8" novalidate @submit.prevent="submit">
        <VehicleSelect v-model="vehicleId" label="1. Gépjármű" :vehicles="vehicles" :error="show('vehicle')" />
        <ServiceSelect
          v-model="serviceIds"
          label="2. Szolgáltatás"
          multiple
          :services="services"
          :error="show('services')"
        />
        <AppointmentSlotPicker
          v-model="date"
          label="3. Kívánt időpont"
          :booked="booked"
          break-start="12:00"
          break-end="13:00"
          :error="show('date')"
        />

        <button
          type="submit"
          class="w-full cursor-pointer rounded-sm bg-accent px-5 py-3 text-[15px] leading-5 font-semibold text-accent-text hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-fit"
        >
          Foglalás elküldése
        </button>
      </form>
    </div>
  </BaseLayout>
</template>

<route lang="yaml">
name: booking
meta:
  title: Időpontfoglalás
</route>
