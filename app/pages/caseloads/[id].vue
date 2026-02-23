<script setup lang="ts">
import type { ClientProfile } from '~/types'

const route = useRoute()

const patientId = computed<string>(() => route.params.id as string)
const fallbackProfile: ClientProfile = {
  id: patientId.value,
  name: 'Unknown client',
  phone: '',
  address: '',
  status: 'in treatment',
  questionnaires: []
}

const { data: profileResponse } = await useFetch(`/api/client/${patientId.value}`, {
  default: () => fallbackProfile
})

const profile = computed<ClientProfile>(() => {
  return (profileResponse.value as ClientProfile | null) ?? fallbackProfile
})

const questionnaireRows = computed(() => {
  return profile.value.questionnaires.map(item => ({
    name: item.name,
    completed: item.completedAt,
    score: item.score,
    norm: item.norm
  }))
})

const tabs = [
  { label: 'Treatment', value: 'treatment' },
  { label: 'Tasks', value: 'tasks' },
  { label: 'Clinical Notes', value: 'clinical-notes' }
]

const activeTab = ref<'treatment' | 'tasks' | 'clinical-notes'>('treatment')

useHead({
  title: computed(() => `Caseloads · ${patientId.value}`)
})

const timelineSteps = [
  { label: 'Pre-screening', done: true },
  { label: 'Intake', done: true },
  { label: 'Diagnosis', done: false },
  { label: 'Treatment Plan', done: false },
  { label: 'Evaluation', done: false },
  { label: 'Closure', done: false }
]

const taskColumns = [
  {
    status: 'Completed',
    tone: 'success',
    items: ['Define treatment focus', 'Behavioral Activation Basics', 'Cognitive reframing exercise']
  },
  {
    status: 'In progress',
    tone: 'info',
    items: ['Behavioral Activation Basics', 'Weekly symptom check']
  },
  {
    status: 'To do',
    tone: 'neutral',
    items: ['Behavioral Activation Basics', 'Sleep hygiene workbook']
  }
] as const
</script>

<template>
  <UDashboardPanel id="caseload-detail">
    <template #header>
      <UDashboardNavbar :title="`Caseloads · ${patientId}`">
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
      <div class="mt-4 grid gap-4 xl:grid-cols-[1fr,320px]">
        <div>
          <UCard :ui="{ body: 'p-4' }">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <UAvatar src="https://i.pravatar.cc/120?img=48" alt="Lisa Jansen" size="xl" />
                <div>
                  <p class="text-xl font-semibold text-highlighted">
                    Lisa Jansen
                  </p>
                  <div class="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                    <TherapistStatusPill label="In treatment" tone="success" />
                    <span>{{ patientId }}</span>
                    <span>·</span>
                    <span>{{ profile.phone }}</span>
                    <span>·</span>
                    <span>{{ profile.address }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2">
                <UButton
                  color="primary"
                  label="Book a session"
                  icon="i-lucide-calendar-plus"
                  class="rounded-full"
                />
                <UButton
                  color="neutral"
                  variant="outline"
                  square
                  icon="i-lucide-message-circle"
                />
              </div>
            </div>
          </UCard>

          <UCard class="mt-4" :ui="{ body: 'p-0' }">
            <div class="border-b border-default px-4">
              <UTabs
                v-model="activeTab"
                :items="tabs"
                :content="false"
                variant="link"
                class="py-2"
              />
            </div>

            <div v-if="activeTab === 'treatment'" class="p-4 space-y-4">
              <UCard variant="soft" :ui="{ body: 'p-4' }">
                <div class="grid grid-cols-2 gap-2 md:grid-cols-6">
                  <div v-for="step in timelineSteps" :key="step.label" class="text-center">
                    <div
                      class="mx-auto mb-2 flex size-7 items-center justify-center rounded-full border border-default"
                      :class="step.done ? 'border-success bg-success text-white' : 'bg-default'"
                    >
                      <UIcon :name="step.done ? 'i-lucide-check' : 'i-lucide-circle'" class="size-4" />
                    </div>
                    <p class="text-xs text-muted">
                      {{ step.label }}
                    </p>
                  </div>
                </div>
              </UCard>

              <div class="grid gap-4 lg:grid-cols-2">
                <TherapistSectionCard title="Progress overview">
                  <div class="space-y-2 px-5 py-4 text-sm">
                    <p class="flex justify-between">
                      <span class="text-muted">iCBT module completion</span>
                      <span class="font-medium">5 / 8</span>
                    </p>
                    <p class="flex justify-between">
                      <span class="text-muted">Homework adherence</span>
                      <span class="font-medium">Moderate</span>
                    </p>
                    <p class="flex justify-between">
                      <span class="text-muted">ROM trend</span>
                      <span class="font-medium">Stable with slight improvements</span>
                    </p>
                    <p class="flex justify-between">
                      <span class="text-muted">Client engagement level</span>
                      <span class="font-medium">High</span>
                    </p>
                  </div>
                </TherapistSectionCard>

                <TherapistSectionCard title="Current treatment focus">
                  <div class="space-y-2 px-5 py-4 text-sm">
                    <p class="text-muted">
                      Primary goal
                    </p>
                    <p class="font-medium text-highlighted">
                      Support the client in managing symptoms of anxiety and improving daily coping skills.
                    </p>
                    <p class="text-muted mt-3">
                      Secondary goals
                    </p>
                    <ol class="list-decimal space-y-1 ps-5 text-highlighted">
                      <li>Strengthen emotional regulation</li>
                      <li>Improve cognitive restructuring skills</li>
                      <li>Support adherence to KBT modules</li>
                    </ol>
                  </div>
                </TherapistSectionCard>
              </div>

              <div class="grid gap-4 lg:grid-cols-2">
                <UCard>
                  <template #header>
                    <div class="flex items-center justify-between">
                      <p class="font-semibold">
                        Total score
                      </p>
                      <USelect :items="[{ label: 'SQ48', value: 'sq48' }]" value="sq48" class="w-24" />
                    </div>
                  </template>
                  <div class="h-36 rounded-lg border border-dashed border-default bg-elevated/30" />
                </UCard>
                <UCard>
                  <template #header>
                    <div class="flex items-center justify-between">
                      <p class="font-semibold">
                        Total score
                      </p>
                      <USelect :items="[{ label: 'MHC-SF', value: 'mhcsf' }]" value="mhcsf" class="w-24" />
                    </div>
                  </template>
                  <div class="h-36 rounded-lg border border-dashed border-default bg-elevated/30" />
                </UCard>
              </div>
            </div>

            <div v-else-if="activeTab === 'tasks'" class="p-4">
              <div class="mb-4 flex justify-end">
                <UButton color="neutral" variant="outline" icon="i-lucide-plus">
                  Create new task
                </UButton>
              </div>
              <div class="grid gap-4 lg:grid-cols-3">
                <UCard
                  v-for="column in taskColumns"
                  :key="column.status"
                  variant="soft"
                  :ui="{ body: 'p-3' }"
                >
                  <div class="mb-3">
                    <TherapistStatusPill :label="column.status" :tone="column.tone" />
                  </div>
                  <div class="space-y-3">
                    <UCard
                      v-for="item in column.items"
                      :key="item"
                      :ui="{ body: 'p-3' }"
                    >
                      <p class="font-medium text-highlighted">
                        {{ item }}
                      </p>
                      <p class="mt-2 text-xs text-muted">
                        Attachments · 3
                      </p>
                      <p class="text-xs text-muted">
                        Due date · 24 November
                      </p>
                    </UCard>
                  </div>
                </UCard>
              </div>
            </div>

            <div v-else class="p-4">
              <div class="grid gap-4">
                <UCard :ui="{ body: 'p-0' }">
                  <div class="border-b border-default px-4 py-3">
                    <UTabs
                      :items="[{ label: 'Active 2', value: 'active' }, { label: 'Completed 2', value: 'completed' }, { label: 'All 4', value: 'all' }]"
                      value="completed"
                      :content="false"
                    />
                  </div>
                  <div class="flex items-center justify-between gap-2 px-4 py-3">
                    <UInput icon="i-lucide-search" placeholder="Search" class="w-72" />
                    <UButton color="neutral" variant="ghost" icon="i-lucide-list-filter">
                      Filter
                    </UButton>
                  </div>
                  <UTable
                    :data="questionnaireRows"
                    :columns="[
                      { accessorKey: 'name', header: 'Self-report questionnaire' },
                      { accessorKey: 'completed', header: 'Completed' },
                      { accessorKey: 'score', header: 'Score' },
                      { accessorKey: 'norm', header: 'Compared to norm population' }
                    ]"
                  />
                </UCard>
              </div>
            </div>
          </UCard>
        </div>

        <UCard class="h-fit" :ui="{ body: 'p-0' }">
          <div class="flex items-center justify-between border-b border-default px-4 py-3">
            <div class="flex items-center gap-2">
              <UBadge color="neutral" variant="soft" label="ED" />
              <p class="font-semibold text-highlighted">
                Lisa Jansen
              </p>
            </div>
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-lucide-search"
              square
            />
          </div>
          <div class="space-y-3 p-4">
            <p class="text-center text-xs text-muted">
              November 12, 2025
            </p>
            <div class="rounded-xl bg-primary px-4 py-3 text-sm text-primary-foreground ml-auto max-w-[85%]">
              Hi Lisa, just checking in.
            </div>
            <div class="rounded-xl bg-elevated px-4 py-3 text-sm text-highlighted max-w-[85%]">
              Hi! I'm here.
            </div>
            <div class="rounded-xl bg-primary px-4 py-3 text-sm text-primary-foreground ml-auto max-w-[85%]">
              Nothing alarming, but I'd like to talk this through in our next session.
            </div>
            <div class="rounded-xl bg-elevated px-4 py-3 text-sm text-highlighted max-w-[85%]">
              Thanks for letting me know. I've had a tougher week than usual.
            </div>
            <p class="text-center text-xs text-muted">
              Today
            </p>
          </div>
          <div class="border-t border-default p-3">
            <UInput placeholder="Hi Lisa, what is your question?">
              <template #leading>
                <UIcon name="i-lucide-paperclip" class="text-muted" />
              </template>
            </UInput>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
