<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthLayout from '@layouts/AuthLayout.vue';
import AuthCard from '@components/auth/AuthCard.vue';
import { login } from '@utils/auth.mjs';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const error = ref(``);

const notice = computed(() => (route.query.registered ? `Sikeres regisztráció! Most már bejelentkezhetsz.` : ``));

async function handleLogin(credentials)
{
  loading.value = true;
  error.value = ``;

  try
  {
    await login(credentials)
    await router.push('/')
    // TODO: default home pages for different account roles (customer / worker / admin)
  }
  catch (e)
  {
    error.value = e.message
  }
  finally
  {
    loading.value = false
  }
}

function handleForgotPassword()
{
  // TODO: reset password
}
</script>

<template>
  <AuthLayout>
    <AuthCard
      mode="login"
      :loading="loading"
      :error="error"
      :notice="notice"
      @login="handleLogin"
      @forgot-password="handleForgotPassword"
    />
  </AuthLayout>
</template>

<route lang="yaml">
name: login
meta:
  title: Bejelentkezés
</route>
