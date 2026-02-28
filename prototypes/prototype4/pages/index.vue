<script setup lang="ts">
import type { Activity } from '~/composables/useActivities'

definePageMeta({ layout: false })

const { allActivities } = useActivities()

const selectedActivity = ref<Activity | null>(null)
const showRating = ref(false)
const lastFeedback = ref('')
const showToast = ref(false)

function handleSelectActivity(activityId: string): void {
  const act = allActivities.value.find(a => a.id === activityId)
  if (!act) return
  selectedActivity.value = act
  showRating.value = true
}

function handleLogged(feedback: string): void {
  lastFeedback.value = feedback
  showRating.value = false
  selectedActivity.value = null

  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

function handleCloseRating(): void {
  showRating.value = false
  selectedActivity.value = null
}
</script>

<template>
  <ProtoShell title="The Mood-Activity Map" :prototype-number="4">
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-50 to-stone-100 relative">
      <!-- Decorative bg -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-100/20 blur-3xl" />
        <div class="absolute bottom-0 -left-24 w-72 h-72 rounded-full bg-blue-100/20 blur-3xl" />
      </div>

      <ProtoHeader
        title="The Mood-Activity Map"
        description="Track how activities affect your mood"
        :prototype-number="4"
      />

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        <!-- Section 1: Activity Selector -->
        <section>
          <div class="flex items-center gap-2 mb-4">
            <h2 class="text-lg font-bold text-zinc-800">Log an Activity</h2>
            <UBadge color="emerald" variant="subtle" size="xs">Step 1</UBadge>
          </div>
          <ActivitySelector @select="handleSelectActivity" />
        </section>

        <!-- Section 2: Heatmap + Insights -->
        <section>
          <div class="flex items-center gap-2 mb-4">
            <h2 class="text-lg font-bold text-zinc-800">Your Map</h2>
            <UBadge color="blue" variant="subtle" size="xs">Insights</UBadge>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div class="lg:col-span-2">
              <ActivityHeatmap />
            </div>
            <div>
              <InsightPanel />
            </div>
          </div>
        </section>

        <!-- Section 3: Weekly Timeline -->
        <section>
          <div class="flex items-center gap-2 mb-4">
            <h2 class="text-lg font-bold text-zinc-800">This Week</h2>
            <UBadge color="amber" variant="subtle" size="xs">Timeline</UBadge>
          </div>
          <WeeklyTimeline />
        </section>
      </div>

      <!-- Rating Modal -->
      <RatingModal
        :activity="selectedActivity"
        :open="showRating"
        @close="handleCloseRating"
        @logged="handleLogged"
      />

      <!-- Toast notification -->
      <Transition name="toast">
        <div
          v-if="showToast"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-zinc-800 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-sm"
        >
          <UIcon name="i-lucide-check-circle" class="text-xl text-emerald-400 shrink-0" />
          <p class="text-sm">{{ lastFeedback }}</p>
        </div>
      </Transition>
    </div>
  </ProtoShell>
</template>

<style>
.toast-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.3s ease-out;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(20px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
</style>
