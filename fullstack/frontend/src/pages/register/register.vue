<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthLayout from '@layouts/AuthLayout.vue';
import AuthCard from '@components/auth/AuthCard.vue';
import { register } from '@utils/auth.mjs';

const router = useRouter();

const loading = ref(false);
const error = ref('');

async function handleRegister(payload)
{
  loading.value = true;
  error.value = ``;

  try
  {
    await register(payload);
    await router.push({ path: '/login', query: { registered: '1' } });
  }
  catch (e)
  {
    error.value = e.message;
  }
  finally
  {
    loading.value = false;
  }
}
</script>

<template>
  <AuthLayout>
    <AuthCard mode="register" :loading="loading" :error="error" @register="handleRegister" />
  </AuthLayout>
</template>

<route lang="yaml">
name: register
meta:
  title: Regisztráció
</route>
