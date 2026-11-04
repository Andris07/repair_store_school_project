<script setup>
import { reactiveOmit } from '@vueuse/core'
import { NavigationMenuLink, useForwardPropsEmits } from 'reka-ui'
import { cn } from '@/lib/utils'

const props = defineProps({
  active: { type: Boolean, required: false },
  asChild: { type: Boolean, required: false },
  as: { type: [String, Object, Function], required: false },
  class: { type: null, required: false }
})
const emits = defineEmits(['select'])

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <NavigationMenuLink
    data-slot="navigation-menu-link"
    v-bind="forwarded"
    :class="
      cn(
        `'data-[active=true]:focus:bg-accent-soft data-[active=true]:hover:bg-accent-soft data-[active=true]:bg-accent-soft/50 data-[active=true]:text-accent hover:bg-accent-soft hover:text-accent focus:bg-accent-soft focus:text-accent ring-accent/10 dark:ring-accent/20 dark:outline-accent/40 outline-accent/50 [&_svg:not([class*='text-'])]:text-text-muted flex flex-col gap-1 rounded-sm p-2 text-sm transition-[color,box-shadow] focus-visible:ring-4 focus-visible:outline-1 [&_svg:not([class*='size-'])]:size-4'`,
        props.class
      )
    "
  >
    <slot />
  </NavigationMenuLink>
</template>
