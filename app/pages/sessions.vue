<script setup lang="ts">
useHead({ title: 'Sessions' })
const { avatarUrl, email } = useCurrentUser()

const clientChatAvatarSrc = computed<string>(() => {
  if (avatarUrl.value) {
    return avatarUrl.value
  }

  if (email.value) {
    return `https://i.pravatar.cc/120?u=${encodeURIComponent(email.value)}`
  }

  return 'https://i.pravatar.cc/120?img=28'
})

interface SessionRecord {
  id: string
  title: string
  therapistName: string
  date: string
  duration: string
  aiSummary: string
  aiTranscript: Array<{
    speaker: 'therapist' | 'patient'
    text: string
  }>
}

const sessions = ref<SessionRecord[]>([
  {
    id: 'sess-1042',
    title: 'Session 12 · Coping with uncertainty',
    therapistName: 'Dr. Sophie van den Berg',
    date: '2026-02-20',
    duration: '48 min',
    aiSummary: 'You and your therapist reviewed anxiety spikes around work transitions. You practiced reframing catastrophic thoughts into realistic alternatives and agreed on a daily breathing routine plus a short evening reflection prompt.',
    aiTranscript: [
      { speaker: 'therapist', text: 'Last time you mentioned your mornings feel heavy. What changed this week?' },
      { speaker: 'patient', text: 'I noticed I start spiraling before I even leave bed.' },
      { speaker: 'therapist', text: 'Let us test that thought. What evidence supports it, and what evidence challenges it?' },
      { speaker: 'patient', text: 'I can see I still complete my tasks. It just feels harder than before.' },
      { speaker: 'therapist', text: 'Great observation. We can frame this as discomfort, not danger.' }
    ]
  },
  {
    id: 'sess-1031',
    title: 'Session 11 · Sleep and routine reset',
    therapistName: 'Dr. Sophie van den Berg',
    date: '2026-02-13',
    duration: '51 min',
    aiSummary: 'This session focused on sleep consistency and reducing late-night rumination. You agreed on a wind-down plan: no screens 45 minutes before bed, a body-scan audio exercise, and keeping a small list of unresolved thoughts for the next day.',
    aiTranscript: [
      { speaker: 'therapist', text: 'When do the racing thoughts usually begin?' },
      { speaker: 'patient', text: 'Mostly after 10 PM, when the house is quiet.' },
      { speaker: 'therapist', text: 'Let us externalize them. Write them down and postpone solving until tomorrow.' },
      { speaker: 'patient', text: 'That sounds manageable. I think I can follow that.' },
      { speaker: 'therapist', text: 'Good. We are aiming for consistency over perfection.' }
    ]
  }
])
</script>

<template>
  <UDashboardPanel id="sessions">
    <template #header>
      <UDashboardNavbar title="Sessions">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <div class="flex items-center gap-2">
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
      <div class="space-y-4">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 class="text-2xl font-semibold text-highlighted">
              Session Library
            </h1>
            <p class="mt-1 text-sm text-muted">
              Rewatch previous sessions and review AI summaries and transcripts.
            </p>
          </div>
        </div>

        <UCard
          v-for="session in sessions"
          :key="session.id"
          :ui="{ body: 'p-5 sm:p-6' }"
        >
          <div>
            <div class="flex items-start justify-between gap-3">
              <h2 class="text-lg font-semibold text-highlighted">
                {{ session.title }}
              </h2>
              <UBadge color="primary" variant="soft">
                Recorded
              </UBadge>
            </div>
            <p class="mt-1 text-sm text-muted">
              {{ session.therapistName }} · {{ session.date }} · {{ session.duration }}
            </p>
            <p class="mt-2 text-sm leading-6 text-toned">
              {{ session.aiSummary }}
            </p>
          </div>

          <div class="mt-4 grid gap-4 lg:grid-cols-[1.5fr,1fr] items-stretch">
            <div class="w-full rounded-lg border border-default bg-elevated/40 p-4">
              <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-muted">
                Session replay
              </p>
              <div class="relative w-full rounded-md border border-dashed border-default bg-default/40 p-4">
                <div class="aspect-video w-full overflow-hidden rounded-md border border-default/70 bg-elevated/70">
                  <img
                    src="/images/meeting-1.png"
                    alt="Therapist session recording still"
                    class="h-full w-full object-cover"
                  >
                </div>

                <div class="absolute bottom-4 right-4 h-24 w-40 overflow-hidden rounded-md border border-default bg-elevated shadow-sm">
                  <img
                    src="/images/meeting-2.png"
                    alt="Client session recording inset still"
                    class="h-full w-full object-cover"
                  >
                </div>
              </div>
            </div>

            <div class="rounded-lg border border-default p-4 h-full">
              <div class="h-full flex flex-col gap-2">
                <p class="text-xs font-semibold uppercase tracking-wide text-muted">
                  AI transcript
                </p>
                <UChatMessages
                  :messages="session.aiTranscript.map((line, index) => ({
                    id: `${session.id}-${index}`,
                    role: line.speaker === 'patient' ? 'user' : 'assistant',
                    parts: [{ type: 'text', text: line.text }]
                  }))"
                  status="ready"
                  :should-scroll-to-bottom="false"
                  :user="{
                    avatar: { src: clientChatAvatarSrc, alt: 'Client' },
                    side: 'right',
                    variant: 'soft'
                  }"
                  :assistant="{
                    avatar: { icon: 'i-lucide-stethoscope' },
                    side: 'left',
                    variant: 'naked'
                  }"
                  class="min-h-0 flex-1 overflow-y-auto pr-1"
                />
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
