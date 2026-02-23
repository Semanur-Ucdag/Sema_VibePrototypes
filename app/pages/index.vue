<script setup lang="ts">
import type { Appointment, PatientAlert, TaskItem } from '~/types'

useHead({ title: 'Dashboard' })

interface DashboardData {
  appointments: Appointment[]
  alerts: PatientAlert[]
  tasks: TaskItem[]
}

const { data } = await useFetch<DashboardData>('/api/dashboard', {
  default: () => ({
    appointments: [],
    alerts: [],
    tasks: []
  })
})

const tabs = [
  { label: 'Overdue', value: 'Overdue' },
  { label: 'Due today', value: 'Due today' },
  { label: 'Upcoming', value: 'Upcoming' }
]
const activeTab = ref<string>('Overdue')

const now = ref<Date>(new Date())
let dateTimer: ReturnType<typeof setInterval> | undefined

const greeting = computed<string>(() => {
  const currentHour = now.value.getHours()

  if (currentHour < 12) {
    return 'Good morning'
  }

  if (currentHour < 18) {
    return 'Good afternoon'
  }

  return 'Good evening'
})

const formattedCurrentDate = computed<string>(() =>
  now.value.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })
)

onMounted(() => {
  dateTimer = setInterval(() => {
    now.value = new Date()
  }, 60_000)
})

onBeforeUnmount(() => {
  if (dateTimer) {
    clearInterval(dateTimer)
  }
})
</script>

<template>
  <UDashboardPanel id="dashboard">
    <template #header>
      <UDashboardNavbar title="Dashboard">
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
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-highlighted">
            {{ greeting }}, Alice!
          </h1>
          <p class="mt-1 text-sm text-muted">
            {{ formattedCurrentDate }}
          </p>
        </div>

        <UButton
          color="neutral"
          variant="outline"
          icon="i-lucide-settings-2"
          label="Customize"
        />
      </div>

      <div class="mt-6 grid gap-4 xl:grid-cols-[2fr,1fr]">
        <TherapistSectionCard title="Today's Appointments">
          <ul class="divide-y divide-default">
            <li v-for="appointment in data.appointments" :key="appointment.id" class="grid grid-cols-[68px,1fr] gap-4 px-6 py-4">
              <div class="text-xs text-muted">
                <p>{{ appointment.start }}</p>
                <p>{{ appointment.end }}</p>
              </div>
              <div class="border-l border-default pl-3">
                <p class="font-medium text-highlighted">
                  {{ appointment.patientName }}
                </p>
                <p class="text-sm text-muted">
                  {{ appointment.note }}
                </p>
              </div>
            </li>
          </ul>
        </TherapistSectionCard>

        <TherapistSectionCard title="Patient Alerts">
          <ul class="divide-y divide-default">
            <li v-for="alert in data.alerts" :key="alert.id" class="px-5 py-4">
              <div class="flex items-start gap-2">
                <UIcon
                  :name="alert.severity === 'error' ? 'i-lucide-triangle-alert' : 'i-lucide-bell-ring'"
                  class="mt-0.5 size-4"
                  :class="alert.severity === 'error' ? 'text-error' : 'text-warning'"
                />
                <div>
                  <p class="text-sm font-medium text-highlighted">
                    {{ alert.title }}
                  </p>
                  <p class="text-xs text-muted">
                    Client {{ alert.patientName }}
                  </p>
                  <p class="mt-1 text-xs text-muted">
                    {{ alert.createdAt }}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </TherapistSectionCard>
      </div>

      <div class="mt-4">
        <TherapistSectionCard title="Tasks">
          <template #actions>
            <UButton color="neutral" variant="ghost" icon="i-lucide-ellipsis" />
          </template>

          <div class="border-b border-default px-6">
            <UTabs
              v-model="activeTab"
              :items="tabs"
              color="neutral"
              variant="link"
              :content="false"
              class="py-2"
            />
          </div>

          <ul class="divide-y divide-default">
            <li v-for="task in data.tasks" :key="task.id" class="px-6 py-4">
              <div class="flex items-center justify-between gap-3">
                <div>
                  <p class="font-medium text-highlighted">
                    {{ task.title }}
                  </p>
                  <p class="mt-1 text-xs text-muted">
                    {{ task.assignee }} · {{ task.patientId }}
                  </p>
                </div>
                <TherapistStatusPill label="in progress" tone="info" />
              </div>
            </li>
          </ul>
        </TherapistSectionCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
