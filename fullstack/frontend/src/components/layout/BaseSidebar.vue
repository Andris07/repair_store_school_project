<script setup>
import { ref } from 'vue'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@components/ui/sheet'
import { Menu } from '@lucide/vue'
import SidebarContent from '@components/layout/SidebarContent.vue'

defineProps({
  role:
  {
    type: String,
    default: `customer`
  },
  userName:
  {
    type: String,
    default: ``
  }
})

const emit = defineEmits([`logout`])

const mobileOpen = ref(false)
const title = import.meta.env.VITE_APP_NAME
</script>

<template>
  <!-- Mobil: felső sáv + kihúzható menü -->
  <header class="flex items-center justify-between border-b border-border bg-surface p-3 lg:hidden">
    <span class="text-lg font-semibold">{{ title }}</span>
    <Sheet v-model:open="mobileOpen">
      <SheetTrigger asChild>
        <button
          type="button"
          class="cursor-pointer rounded-sm p-2 hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-accent"
        >
          <Menu class="size-6" />
          <span class="sr-only">Navigációs menü</span>
        </button>
      </SheetTrigger>
      <SheetContent side="left" class="w-60 bg-surface p-4">
        <SheetTitle class="sr-only">Navigációs menü</SheetTitle>
        <SidebarContent
          :role
          :user-name
          @navigate="mobileOpen = false"
          @logout="emit(`logout`)"
        />
      </SheetContent>
    </Sheet>
  </header>

  <!-- Asztali: fix bal oldali sáv -->
  <aside
    data-slot="base-sidebar"
    class="sticky top-0 hidden h-screen w-44 shrink-0 border-r border-border bg-surface px-3 py-4 lg:block"
  >
    <SidebarContent :role :user-name @logout="emit(`logout`)" />
  </aside>
</template>
