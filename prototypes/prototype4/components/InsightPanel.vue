<script setup lang="ts">
const {
  totalLogs,
  uniqueActivitiesLogged,
  averagePleasure,
  averageMastery,
  sweetSpotActivities,
  currentStreak,
  mostEnjoyable,
  biggestAchievement
} = useActivities()
</script>

<template>
  <div class="space-y-4">
    <!-- Summary stats -->
    <div class="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
      <h3 class="text-sm font-semibold text-zinc-700 flex items-center gap-2 mb-4">
        <UIcon name="i-lucide-bar-chart-3" class="text-zinc-400" />
        Your Insights
      </h3>

      <div class="grid grid-cols-2 gap-3">
        <div class="bg-zinc-50 rounded-xl p-3 text-center">
          <p class="text-2xl font-bold text-zinc-800">{{ totalLogs }}</p>
          <p class="text-[10px] text-zinc-400 mt-0.5">Activities Logged</p>
        </div>
        <div class="bg-zinc-50 rounded-xl p-3 text-center">
          <p class="text-2xl font-bold text-zinc-800">{{ uniqueActivitiesLogged }}</p>
          <p class="text-[10px] text-zinc-400 mt-0.5">Unique Activities</p>
        </div>
        <div class="bg-emerald-50 rounded-xl p-3 text-center">
          <p class="text-2xl font-bold text-emerald-600">{{ averagePleasure }}</p>
          <p class="text-[10px] text-emerald-500 mt-0.5">Avg Pleasure</p>
        </div>
        <div class="bg-blue-50 rounded-xl p-3 text-center">
          <p class="text-2xl font-bold text-blue-600">{{ averageMastery }}</p>
          <p class="text-[10px] text-blue-500 mt-0.5">Avg Mastery</p>
        </div>
      </div>
    </div>

    <!-- Top activities -->
    <div class="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
      <h3 class="text-sm font-semibold text-zinc-700 mb-3">Highlights</h3>

      <div class="space-y-3">
        <div v-if="mostEnjoyable" class="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
          <div class="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center">
            <UIcon :name="mostEnjoyable.icon || 'i-lucide-heart'" class="text-lg text-emerald-500" />
          </div>
          <div>
            <p class="text-xs text-emerald-600 font-medium">Most Enjoyable</p>
            <p class="text-sm font-semibold text-zinc-700">{{ mostEnjoyable.name }} <span class="text-emerald-500 font-normal">({{ mostEnjoyable.score }})</span></p>
          </div>
        </div>

        <div v-if="biggestAchievement" class="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
          <div class="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
            <UIcon :name="biggestAchievement.icon || 'i-lucide-trophy'" class="text-lg text-blue-500" />
          </div>
          <div>
            <p class="text-xs text-blue-600 font-medium">Biggest Achievement</p>
            <p class="text-sm font-semibold text-zinc-700">{{ biggestAchievement.name }} <span class="text-blue-500 font-normal">({{ biggestAchievement.score }})</span></p>
          </div>
        </div>
      </div>
    </div>

    <!-- Sweet Spot -->
    <div class="bg-gradient-to-br from-amber-50 to-emerald-50 rounded-2xl border border-amber-200/60 p-5 shadow-sm">
      <h3 class="text-sm font-semibold text-amber-700 flex items-center gap-2 mb-3">
        <span class="text-base">✨</span>
        Sweet Spot Activities
      </h3>

      <div v-if="sweetSpotActivities.length > 0" class="space-y-2">
        <div
          v-for="act in sweetSpotActivities"
          :key="act.id"
          class="flex items-center justify-between p-2.5 bg-white/70 backdrop-blur-sm rounded-lg"
        >
          <span class="text-sm font-medium text-zinc-700">{{ act.name }}</span>
          <div class="flex items-center gap-2 text-[10px]">
            <span class="text-emerald-500">P:{{ act.avgPleasure }}</span>
            <span class="text-blue-500">M:{{ act.avgMastery }}</span>
          </div>
        </div>
      </div>
      <p v-else class="text-xs text-amber-500 italic">
        Log activities with both Pleasure and Mastery ≥ 7 to discover your sweet spot.
      </p>
    </div>

    <!-- Motivational message -->
    <div class="bg-zinc-800 rounded-2xl p-5 text-center">
      <UIcon name="i-lucide-sparkles" class="text-2xl text-amber-400 mb-2" />
      <p class="text-sm text-zinc-300 leading-relaxed italic">
        "Your evidence shows that action leads to mood change."
      </p>
      <p v-if="currentStreak > 1" class="text-xs text-amber-400 mt-2 font-medium">
        You've been active for {{ currentStreak }} days straight!
      </p>
    </div>
  </div>
</template>
