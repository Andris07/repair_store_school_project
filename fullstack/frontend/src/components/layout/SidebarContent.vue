<script setup>
import { computed } from 'vue'
import { navigation, roleLabels } from '@utils/navigation.mjs'

const props = defineProps({
  role:
  {
    type: String,
    default: `customer`,
    validator: (value) => Object.hasOwn(navigation, value)
  },
  userName:
  {
    type: String,
    default: ``
  }
})

const emit = defineEmits([`navigate`, `logout`])

const title = import.meta.env.VITE_APP_NAME
const links = computed(() => navigation[props.role] ?? [])
const initial = computed(() => (title ?? `A`).trim().charAt(0).toUpperCase())
</script>

<template>
  <div data-slot="sidebar-content" class="flex h-full flex-col">
    <div class="px-2 pt-1">
      <RouterLink to="/" class="flex items-center gap-2.5" @click="emit(`navigate`)">
        <span class="grid size-7 shrink-0 place-items-center rounded-sm bg-accent text-sm font-bold text-accent-text">
          {{ initial }}
        </span>
        <span class="truncate text-[15px] font-semibold">{{ title }}</span>
      </RouterLink>
      <span
        class="mt-2 inline-block rounded-sm border border-border bg-surface-2 px-2 py-0.5 text-[10px] font-medium tracking-[0.08em] text-text-muted uppercase"
      >
        {{ roleLabels[role] }}
      </span>
    </div>

    <nav class="mt-5 flex flex-col gap-1">
      <RouterLink v-for="link of links" :key="link.to" v-slot="{ isActive, href, navigate }" :to="link.to" custom>
        <a
          :href
          :aria-current="isActive ? `page` : undefined"
          :class="[
            'flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] leading-5 font-semibold transition-colors',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent',
            isActive ? 'bg-accent-soft text-accent' : 'text-text hover:bg-surface-2'
          ]"
          @click="(event) => { navigate(event); emit(`navigate`) }"
        >
          <component :is="link.icon" :class="['size-4 shrink-0', isActive ? 'text-accent' : 'text-text-muted']" />
          <span class="truncate">{{ link.label }}</span>
        </a>
      </RouterLink>
    </nav>

    <div class="mt-auto flex items-center gap-2.5 border-t border-border px-2 pt-4">
      <span class="size-8 shrink-0 rounded-full bg-surface-2" aria-hidden="true" />
      <div class="min-w-0 text-[12px] leading-4">
        <p class="truncate font-medium">{{ userName }}</p>
        <button
          type="button"
          class="cursor-pointer text-text-muted hover:text-text focus-visible:outline-2 focus-visible:outline-accent"
          @click="emit(`logout`)"
        >
          Kijelentkezés
        </button>
      </div>
    </div>
  </div>
</template>
