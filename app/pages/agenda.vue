<script setup lang="ts">
useHead({ title: 'Agenda' })

interface EventCard {
  id: number
  day: string
  start: string
  end: string
  title: string
  subtitle?: string
  tone: 'green' | 'blue' | 'orange'
}

interface AgendaData {
  days: { key: string, label: string }[]
  events: EventCard[]
}

const { data } = await useFetch<AgendaData>('/api/agenda', {
  default: () => ({
    days: [],
    events: []
  })
})

function toneClass(tone: EventCard['tone']): string {
  if (tone === 'green') {
    return 'border-emerald-300 bg-emerald-50 dark:bg-emerald-500/10'
  }

  if (tone === 'orange') {
    return 'border-orange-300 bg-orange-50 dark:bg-orange-500/10'
  }

  return 'border-blue-300 bg-blue-50 dark:bg-blue-500/10'
}
</script>

<template>
  <UDashboardPanel id="agenda">
    <template #header>
      <UDashboardNavbar title="Agenda">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <div class="flex items-center gap-2">
            <UButton
              color="primary"
              variant="soft"
              icon="i-lucide-calendar-check-2"
              label="Next session · Today at 9:00"
              class="rounded-full"
            />
            <UButton
              color="neutral"
              variant="ghost"
              square
              icon="i-lucide-copy"
            />
            <UButton
              color="neutral"
              variant="ghost"
              square
              icon="i-lucide-bell"
            />
            <UButton
              color="neutral"
              variant="ghost"
              square
              icon="i-lucide-circle-help"
            />
            <UColorModeButton />
            <UserMenu icon-only />
          </div>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <UCard class="mt-4" :ui="{ body: 'p-0' }">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-default px-4 py-3">
          <div class="flex flex-wrap items-center gap-2">
            <UButton color="neutral" variant="soft" label="Today" />
            <UButton color="neutral" variant="ghost" icon="i-lucide-chevron-left" />
            <UButton color="neutral" variant="ghost" icon="i-lucide-chevron-right" />
            <UBadge color="neutral" variant="soft" label="Week 3" />
            <USelect
              :items="[{ label: 'Events', value: 'events' }, { label: 'Sessions', value: 'sessions' }]"
              value="events"
              class="w-28"
            />
            <USelect
              :items="[{ label: 'Week', value: 'week' }, { label: 'Day', value: 'day' }]"
              value="week"
              class="w-24"
            />
          </div>
          <UButton
            color="primary"
            icon="i-lucide-plus"
            label="New"
            class="rounded-full"
          />
        </div>

        <div class="grid min-w-[900px] grid-cols-[64px,repeat(7,1fr)] overflow-x-auto">
          <div class="border-r border-default p-3 text-xs text-muted">
            UTC+3
          </div>
          <div
            v-for="day in data.days"
            :key="day.key"
            class="border-r border-default p-3 text-sm font-medium text-muted last:border-r-0"
          >
            {{ day.label }}
          </div>

          <template v-for="hour in 11" :key="hour">
            <div class="border-r border-t border-default p-2 text-xs text-muted">
              {{ `${hour + 7}:00` }}
            </div>
            <div
              v-for="day in data.days"
              :key="`${hour}-${day.key}`"
              class="relative border-r border-t border-default p-1 last:border-r-0 min-h-18"
            >
              <div
                v-for="event in data.events.filter(item => item.day === day.key && Number.parseInt(item.start, 10) === hour + 7)"
                :key="event.id"
                class="rounded-md border-l-2 p-2 text-xs"
                :class="toneClass(event.tone)"
              >
                <p class="font-medium text-highlighted">
                  {{ event.title }}
                </p>
                <p class="text-muted">
                  {{ event.start }} - {{ event.end }}
                </p>
                <p v-if="event.subtitle" class="text-muted">
                  {{ event.subtitle }}
                </p>
              </div>
            </div>
          </template>
        </div>
      </UCard>
    </template>
  </UDashboardPanel>
</template>
