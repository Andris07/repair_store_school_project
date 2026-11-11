<script setup>
import { computed, nextTick, reactive, ref } from 'vue';
import FormField from '@components/reusable/FormField.vue';
import { registerSchema, validate } from '@utils/validators.mjs';

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
});

const emit = defineEmits([`submit`]);

const formElement = ref(null);
const values = reactive({ name: ``, email: ``, phone: ``, password: ``, passwordConfirm: `` });
const touched = reactive({ name: false, email: false, phone: false, password: false, passwordConfirm: false });
const submitted = ref(false);

const errors = computed(() => validate(values, registerSchema));

// show the error if the user already left the field (skipped) or tried to send an empty data
const visibleError = (field) => (touched[field] || submitted.value ? (errors.value[field] ?? ``) : ``);

async function onSubmit()
{
  submitted.value = true;

  if (Object.keys(errors.value).length > 0)
  {
    await nextTick();
    formElement.value?.querySelector(`[aria-invalid="true"]`)?.focus();
    return;
  }

  emit(`submit`,
  {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    phone: values.phone.trim() === `` ? null : values.phone.trim(),
    password: values.password
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
      v-model="values.name"
      label="Teljes név"
      name="name"
      autocomplete="name"
      placeholder="Kiss Péter"
      :error="visibleError('name')"
      @blur="touched.name = true"
    />

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
      v-model="values.phone"
      label="Telefonszám"
      type="tel"
      name="phone"
      autocomplete="tel"
      inputmode="tel"
      placeholder="+36 30 123 4567"
      optional
      :error="visibleError('phone')"
      @blur="touched.phone = true"
    />

    <FormField
      v-model="values.password"
      label="Jelszó"
      type="password"
      name="password"
      autocomplete="new-password"
      hint="Legalább 8 karakter, betűvel és számmal."
      :error="visibleError('password')"
      @blur="touched.password = true"
    />

    <FormField
      v-model="values.passwordConfirm"
      label="Jelszó megerősítése"
      type="password"
      name="passwordConfirm"
      autocomplete="new-password"
      :error="visibleError('passwordConfirm')"
      @blur="touched.passwordConfirm = true"
    />

    <button
      type="submit"
      :disabled="loading"
      class="w-full cursor-pointer rounded-sm bg-accent px-5 py-3 text-[15px] leading-5 font-semibold text-accent-text transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-60"
    >
      {{ loading ? `Regisztráció…` : `Regisztráció` }}
    </button>
  </form>
</template>
