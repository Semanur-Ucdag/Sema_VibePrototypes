<script setup lang="ts">
const { getWeeklyStats, currentStreak } = useActivities()

const stats = computed(() => getWeeklyStats())

const maxLogs = computed(() => {
  return Math.max(...stats.value.map(s => s.logs), 1)
})

function barHeight(value: number, max: number): number {
  if (max === 0) return 0
  return (value / max) * 100
}

function scoreBarHeight(score: number): number {
  return (score / 10) * 100
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
    <div class="flex items-center justify-between mb-5">
      <h3 class="text-sm font-semibold text-zinc-700 flex items-center gap-2">
        <UIcon name="i-lucide-calendar-days" class="text-zinc-400" />
        Weekly Timeline
      </h3>
      <div v-if="currentStreak > 0" class="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 rounded-lg border border-amber-200">
        <UIcon name="i-lucide-flame" class="text-sm text-amber-500" />
        <span class="text-xs font-semibold text-amber-600">{{ currentStreak }}-day streak</span>
      </div>
    </div>

    <div class="flex items-end gap-2 justify-between" style="height: 160px;">
      <div
        v-for="day in stats"
        :key="day.dayLabel"
        class="flex-1 flex flex-col items-center gap-1"
      >
        <!-- Bars container -->
        <div class="flex items-end gap-0.5 w-full justify-center" style="height: 120px;">
          <!-- Pleasure bar -->
          <div
            class="w-3 rounded-t-sm transition-all duration-500 ease-out"
            :style="{
              height: `${scoreBarHeight(day.avgPleasure)}%`,
              backgroundColor: day.avgPleasure > 0 ? '#10b981' : '#e4e4e7',
              minHeight: day.avgPleasure > 0 ? '4px' : '2px'
            }"
            :title="`Pleasure: ${day.avgPleasure}`"
          />
          <!-- Mastery bar -->
          <div
            class="w-3 rounded-t-sm transition-all duration-500 ease-out"
            :style="{
              height: `${scoreBarHeight(day.avgMastery)}%`,
              backgroundColor: day.avgMastery > 0 ? '#3b82f6' : '#e4e4e7',
              minHeight: day.avgMastery > 0 ? '4px' : '2px'
            }"
            :title="`Mastery: ${day.avgMastery}`"
          />
        </div>

        <!-- Log count -->
        <span
          class="text-[10px] font-medium"
          :class="day.logs > 0 ? 'text-zinc-500' : 'text-zinc-300'"
        >
          {{ day.logs > 0 ? `${day.logs}` : '—' }}
        </span>

        <!-- Day label -->
        <span
          class="text-xs font-medium px-1.5 py-0.5 rounded"
          :class="day.isToday
            ? 'bg-zinc-800 text-white'
            : 'text-zinc-400'"
        >
          {{ day.dayLabel }}
        </span>
      </div>
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-zinc-100">
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-sm bg-emerald-500" />
        <span class="text-[10px] text-zinc-400">Avg Pleasure</span>
      </div>
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-sm bg-blue-500" />
        <span class="text-[10px] text-zinc-400">Avg Mastery</span>
      </div>
    </div>
  </div>
</template>
