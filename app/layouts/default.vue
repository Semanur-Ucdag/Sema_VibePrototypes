<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const open = ref(false)
const { accountType } = useCurrentUser()

const therapistLinks = [{
  label: 'Dashboard',
  icon: 'i-lucide-house',
  to: '/',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Agenda',
  icon: 'i-lucide-calendar',
  to: '/agenda',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Tasks',
  icon: 'i-lucide-square-check-big',
  to: '/tasks',
  badge: '4',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Caseloads',
  icon: 'i-lucide-briefcase-medical',
  to: '/caseloads',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Chats',
  icon: 'i-lucide-message-square',
  to: '/chats',
  badge: '1',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Insights',
  icon: 'i-lucide-chart-column',
  to: '/insights',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Knowledge Hub',
  icon: 'i-lucide-book-open',
  to: '/knowledge-hub',
  onSelect: () => {
    open.value = false
  }
}] satisfies NavigationMenuItem[]

const clientLinks = [{
  label: 'Dashboard',
  icon: 'i-lucide-house',
  to: '/',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Sessions',
  icon: 'i-lucide-clapperboard',
  to: '/sessions',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Agenda',
  icon: 'i-lucide-calendar',
  to: '/agenda',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Tasks',
  icon: 'i-lucide-square-check-big',
  to: '/tasks',
  badge: '4',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Chats',
  icon: 'i-lucide-message-square',
  to: '/chats',
  badge: '1',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Insights',
  icon: 'i-lucide-chart-column',
  to: '/insights',
  onSelect: () => {
    open.value = false
  }
}, {
  label: 'Knowledge Hub',
  icon: 'i-lucide-book-open',
  to: '/knowledge-hub',
  onSelect: () => {
    open.value = false
  }
}] satisfies NavigationMenuItem[]

const commonLinks = [{
  label: 'Settings',
  icon: 'i-lucide-settings',
  to: '/settings',
  onSelect: () => {
    open.value = false
  }
}] satisfies NavigationMenuItem[]

const links = computed<NavigationMenuItem[][]>(() => {
  return [
    accountType.value === 'client' ? clientLinks : therapistLinks,
    commonLinks
  ]
})
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <div class="w-full flex justify-center">
          <img
            v-if="collapsed"
            src="/svgs/mental-care-group-small.svg"
            alt="Mental Care Group"
            class="size-9"
          >
          <img
            v-else
            src="/svgs/mental-care-group-full.svg"
            alt="Mental Care Group"
            class="h-9 w-auto"
          >
        </div>
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <TherapistSupportCard v-if="!collapsed" />
        <UButton
          v-else
          color="neutral"
          variant="ghost"
          square
          icon="i-lucide-life-buoy"
        />
      </template>
    </UDashboardSidebar>

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
