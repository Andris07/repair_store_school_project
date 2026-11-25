<script setup>
import { dismiss, toasts } from '@utils/notification.mjs'

const styles = {
  success: 'border-ok bg-ok-soft text-ok',
  error: 'border-danger bg-danger-soft text-danger',
  info: 'border-info bg-info-soft text-info'
}
</script>

<template>
  <div class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-2 sm:inset-x-auto sm:right-4">
    <div
      v-for="item in toasts"
      :key="item.id"
      :role="item.type === 'error' ? 'alert' : 'status'"
      :class="['pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-sm border px-4 py-3 text-sm leading-5 shadow-sm', styles[item.type]]"
    >
      <span class="flex-1">{{ item.message }}</span>
      <button
        type="button"
        aria-label="Bezárás"
        class="cursor-pointer font-semibold focus-visible:outline-2 focus-visible:outline-current"
        @click="dismiss(item.id)"
      >
        ×
      </button>
    </div>
  </div>
</template>
