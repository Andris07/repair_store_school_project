<script setup>
import BaseSidebar from '@components/layout/BaseSidebar.vue'

defineProps({
  role:
  {
    type: String,
    default: `customer`
  },
  userName:
  {
    type: String,
    default: `Kiss Péter`
  }
})

const emit = defineEmits([`logout`])
</script>

<template>
  <div class="flex min-h-screen flex-col lg:flex-row">
    <BaseSidebar :role :user-name @logout="emit(`logout`)" />
    <main class="min-w-0 flex-1 p-4 lg:p-8">
      <slot />
    </main>
  </div>
</template>
