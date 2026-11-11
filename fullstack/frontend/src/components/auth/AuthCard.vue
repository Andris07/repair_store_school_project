<script setup>
import { computed } from 'vue';
import LoginForm from '@components/auth/LoginForm.vue';
import RegisterForm from '@components/auth/RegisterForm.vue';

const props = defineProps({
  mode:
  {
    type: String,
    default: `login`,
    validator: (value) => [`login`, `register`].includes(value)
  },
  loading:
  {
    type: Boolean,
    default: false
  },
  error:
  {
    type: String,
    default: ``
  },
  notice:
  {
    type: String,
    default: ``
  }
});

const emit = defineEmits([`login`, `register`, `forgot-password`]);

const tabs =
[
  { mode: `login`, to: `/login`, label: `Bejelentkezés` },
  { mode: `register`, to: `/register`, label: `Regisztráció` }
];

const isLogin = computed(() => props.mode === `login`);
</script>

<template>
  <div class="w-full max-w-110 rounded-xl border border-border bg-surface p-6 sm:p-9">
    <div class="flex flex-col gap-5">
      <nav aria-label="Belépés vagy regisztráció" class="flex gap-1 rounded-md bg-surface-2 p-1">
        <RouterLink
          v-for="tab in tabs"
          :key="tab.mode"
          :to="tab.to"
          :aria-current="tab.mode === mode ? 'page' : undefined"
          :class="[
            'flex-1 rounded-sm border px-3 py-2 text-center text-[15px] leading-5 font-semibold',
            tab.mode === mode ? 'border-border bg-surface text-text' : 'border-transparent text-text-muted hover:text-text'
          ]"
        >
          {{ tab.label }}
        </RouterLink>
      </nav>

      <div class="flex flex-col gap-1">
        <h1 class="font-heading text-[28px] leading-8 font-semibold text-text">
          {{ isLogin ? `Üdv újra!` : `Először vagy itt?` }}
        </h1>
        <p class="text-sm leading-5 text-text-muted">
          {{ isLogin ? `Jelentkezz be a fiókodba.` : `Hozz létre fiókot.` }}
        </p>
      </div>

      <p
        v-if="notice"
        role="status"
        class="rounded-sm border border-ok bg-ok-soft px-3.5 py-2.5 text-sm leading-5 text-ok"
      >
        {{ notice }}
      </p>

      <LoginForm
        v-if="isLogin"
        :loading="loading"
        :error="error"
        @submit="emit('login', $event)"
        @forgot-password="emit('forgot-password')"
      />
      <RegisterForm v-else :loading="loading" :error="error" @submit="emit('register', $event)" />

      <p class="text-center text-sm leading-5 text-text-muted">
        <template v-if="isLogin">
          Nincs még fiókod?
          <RouterLink to="/register" class="font-semibold text-accent hover:underline">Regisztrálj</RouterLink>
        </template>
        <template v-else>
          Van már fiókod?
          <RouterLink to="/login" class="font-semibold text-accent hover:underline">Jelentkezz be</RouterLink>
        </template>
      </p>
    </div>
  </div>
</template>
