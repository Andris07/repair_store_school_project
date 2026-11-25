<script setup>
import { computed, ref } from 'vue';
import CurrentRepair from '@components/repairs/CurrentRepair.vue';

const props = defineProps(
{
  repair:
  {
    type: Object,
    required: true
  },
  busy:
  {
    type: Boolean,
    default: false
  },
  error:
  {
    type: String,
    default: ``
  }
});

const emit = defineEmits([`status-change`, `add-update`]);

const transitions =
{
  approved: { to: `progress`, label: `Munka megkezdése` },
  progress: { to: `done`, label: `Késznek jelölöm` }
};

const next = computed(() => transitions[props.repair.status] ?? null);
const locked = computed(() => [`pending`, `rejected`].includes(props.repair.status));
const finished = computed(() => props.repair.status === `done`);

const text = ref(``);
const textError = ref(``);

function submitUpdate()
{
  const value = text.value.trim();
  if (!value)
  {
    textError.value = `Írd be az esemény szövegét.`;
    return;
  }
  textError.value = ``;
  emit(`add-update`, { id: props.repair.id, text: value });
  text.value = ``;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <CurrentRepair :appointment="repair" title="Javítás">
      <template #actions>
        <div class="flex w-full flex-col gap-4">
          <div v-if="repair.customer" class="text-sm leading-5 text-text-muted">
            Ügyfél: <span class="font-medium text-text">{{ repair.customer }}</span>
            <template v-if="repair.phone"> · {{ repair.phone }}</template>
          </div>

          <p v-if="locked" class="text-sm leading-5 text-text-muted">
            Ez a foglalás még {{ repair.status === `pending` ? `jóváhagyásra vár` : `el lett utasítva` }}, az állapotát nem módosíthatod.
          </p>
          <p v-else-if="finished" class="text-sm leading-5 text-ok">A javítás elkészült.</p>

          <button
            v-if="next"
            type="button"
            :disabled="busy"
            class="w-full cursor-pointer rounded-sm bg-accent px-5 py-3 text-[15px] leading-5 font-semibold text-accent-text hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-60 sm:w-fit"
            @click="emit('status-change', { id: repair.id, status: next.to })"
          >
            {{ next.label }}
          </button>

          <form v-if="!locked" class="flex flex-col gap-2" novalidate @submit.prevent="submitUpdate">
            <label :for="'update-' + repair.id" class="text-sm leading-5 font-semibold text-text">Új esemény</label>
            <textarea
              :id="'update-' + repair.id"
              v-model="text"
              rows="3"
              :disabled="busy"
              placeholder="Pl. Alkatrészre várunk, a fékbetét megérkezett…"
              :aria-invalid="textError ? 'true' : undefined"
              class="w-full rounded-sm border border-border bg-surface px-3.5 py-2.5 text-[15px] leading-5 text-text placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-accent aria-invalid:border-danger"
            />
            <p v-if="textError" role="alert" class="text-sm leading-5 text-danger">{{ textError }}</p>
            <button
              type="submit"
              :disabled="busy"
              class="w-full cursor-pointer rounded-sm border border-border bg-surface px-5 py-2.5 text-[15px] leading-5 font-semibold text-text hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-60 sm:w-fit"
            >
              Esemény rögzítése
            </button>
          </form>

          <p v-if="error" role="alert" class="rounded-sm border border-danger bg-danger-soft px-3.5 py-2.5 text-sm leading-5 text-danger">
            {{ error }}
          </p>
        </div>
      </template>
    </CurrentRepair>
  </div>
</template>
