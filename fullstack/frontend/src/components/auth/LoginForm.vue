<script setup>
import { computed, nextTick, reactive, ref } from 'vue';
import FormField from '@components/reusable/FormField.vue';
import { loginSchema, validate } from '@utils/validators.mjs';

defineProps({
  loading:
  {
    type: Boolean,
    default: false
  },
  error:
  {
    type: String,
    default: ``
  }
})

const emit = defineEmits([`submit`, `forgot-password`]);

const formElement = ref(null);
const values = reactive({ email: ``, password: ``, remember: false });
const touched = reactive({ email: false, password: false });
const submitted = ref(false);

const errors = computed(() => validate(values, loginSchema));

// show the error if the user already left the field (skipped) or tried to send an empty data
const visibleError = (field) => (touched[field] || submitted.value ? (errors.value[field] ?? ``) : ``);

async function onSubmit()
{
  submitted.value = true;

  if (Object.keys(errors.value).length > 0)
  {
    // jumps to the first faulty field
    await nextTick();
    formElement.value?.querySelector('[aria-invalid="true"]')?.focus();
    return;
  }

  emit(`submit`,
  {
    email: values.email.trim().toLowerCase(),
    password: values.password,
    remember: values.remember
  })
}
</script>

<template>
  <form ref="formElement" novalidate class="flex flex-col gap-5" @submit.prevent="onSubmit">
    <p
      v-if="error"
      role="alert"
      class="rounded-sm border border-danger bg-danger-soft px-3.5 py-2.5 text-sm leading-5 text-danger"
    >
      {{ error }}
    </p>

    <FormField
      v-model="values.email"
      label="E-mail cím"
      type="email"
      name="email"
      autocomplete="email"
      inputmode="email"
      placeholder="peter@example.com"
      :error="visibleError('email')"
      @blur="touched.email = true"
    />

    <FormField
      v-model="values.password"
      label="Jelszó"
      type="password"
      name="password"
      autocomplete="current-password"
      :error="visibleError('password')"
      @blur="touched.password = true"
    />

    <div class="flex items-center justify-between gap-3">
      <label class="flex cursor-pointer items-center gap-2 text-sm leading-5 text-text">
        <input v-model="values.remember" type="checkbox" class="size-4 cursor-pointer accent-accent" />
        Emlékezz rám
      </label>

      <button
        type="button"
        class="cursor-pointer rounded-sm text-sm leading-5 font-medium text-accent hover:underline focus-visible:outline-2 focus-visible:outline-accent"
        @click="emit('forgot-password')"
      >
        Elfelejtett jelszó?
      </button>
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full cursor-pointer rounded-sm bg-accent px-5 py-3 text-[15px] leading-5 font-semibold text-accent-text transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-60"
    >
      {{ loading ? `Bejelentkezés…` : `Bejelentkezés` }}
    </button>
  </form>
</template>
