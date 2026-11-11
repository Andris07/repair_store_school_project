<script setup>
import { useDark } from '@vueuse/core';
import { RouterLink } from 'vue-router';

const isDark = useDark();

const appName = import.meta.env.VITE_APP_NAME || 'Autószerviz-kezelő';
const logoLetter = appName.charAt(0).toUpperCase();

const statuses =
[
  { name: `Függőben`, classes: `bg-warn-soft text-warn` },
  { name: `Jóváhagyva`, classes: `bg-info-soft text-info` },
  { name: `Folyamatban`, classes: `bg-accent-soft text-accent` },
  { name: `Elkészült`, classes: `bg-ok-soft text-ok` }
];
</script>

<template>
  <div class="grid min-h-dvh bg-bg text-text xl:grid-cols-[minmax(0,40rem)_1fr]">
    <aside class="hidden flex-col justify-between gap-10 bg-surface-2 px-16 py-14 xl:flex">
      <RouterLink to="/" class="flex w-fit items-center gap-2.5">
        <span
          aria-hidden="true"
          class="flex size-[30px] items-center justify-center rounded-[7px] bg-accent text-lg font-semibold text-accent-text"
          >{{ logoLetter }}</span
        >
        <span class="text-lg leading-6 font-semibold text-text">{{ appName }}</span>
      </RouterLink>

      <div class="flex flex-col gap-5">
        <p class="text-[13px] leading-4 font-medium tracking-[0.04em] text-accent uppercase">Egy belépési pont</p>
        <p class="font-heading text-[60px] leading-[64px] font-semibold text-text">
          Az autód szervizelése egy helyen.
        </p>
        <p class="max-w-md text-base leading-6 text-text-muted">
          Ügyfélként foglalj időpontot és kövesd a javítást, dolgozóként kezeld a munkáidat, adminként tartsd kézben a
          szervizt.
        </p>
      </div>

      <ul class="flex flex-wrap gap-2" aria-label="A foglalások lehetséges állapotai">
        <li
          v-for="status in statuses"
          :key="status.name"
          :class="['rounded-full px-2.5 py-1 text-[13px] leading-4 font-medium tracking-[0.04em]', status.classes]"
        >
          {{ status.name }}
        </li>
      </ul>
    </aside>

    <main class="relative flex flex-col items-center justify-center gap-6 px-4 py-16">
      <button
        type="button"
        class="absolute top-4 right-4 cursor-pointer rounded-sm border border-border bg-surface px-3 py-1.5 text-sm leading-5 font-medium text-text-muted hover:text-text"
        @click="isDark = !isDark"
      >
        {{ isDark ? 'Világos mód' : 'Sötét mód' }}
      </button>

      <RouterLink to="/" class="flex items-center gap-2.5 xl:hidden">
        <span
          aria-hidden="true"
          class="flex size-[30px] items-center justify-center rounded-[7px] bg-accent text-lg font-semibold text-accent-text"
          >{{ logoLetter }}</span
        >
        <span class="text-lg leading-6 font-semibold text-text">{{ appName }}</span>
      </RouterLink>

      <slot />
    </main>
  </div>
</template>
