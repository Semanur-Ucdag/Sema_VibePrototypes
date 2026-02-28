<script setup lang="ts">
const emit = defineEmits<{
  select: [activityId: string]
}>()

const { allActivities, categories, getLogsForActivity, getCategoryColor } = useActivities()

const categoryIcons: Record<string, string> = {
  Physical: 'i-lucide-dumbbell',
  Creative: 'i-lucide-lightbulb',
  Social: 'i-lucide-heart',
  'Self-Care': 'i-lucide-shield-check'
}

function activitiesByCategory(category: string) {
  return allActivities.value.filter(a => a.category === category)
}

function hasLogs(activityId: string): boolean {
  return getLogsForActivity(activityId).length > 0
}

function logCount(activityId: string): number {
  return getLogsForActivity(activityId).length
}
</script>

<template>
  <div class="space-y-6">
    <div v-for="cat in categories" :key="cat">
      <div class="flex items-center gap-2 mb-3">
        <div
          class="w-7 h-7 rounded-lg flex items-center justify-center"
          :style="{ backgroundColor: getCategoryColor(cat) + '20', color: getCategoryColor(cat) }"
        >
          <UIcon :name="categoryIcons[cat] ?? 'i-lucide-circle'" class="text-sm" />
        </div>
        <h3 class="text-sm font-semibold text-zinc-600">{{ cat }}</h3>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          v-for="act in activitiesByCategory(cat)"
          :key="act.id"
          class="group relative flex flex-col items-center gap-2 p-3 rounded-xl border bg-white hover:shadow-md transition-all active:scale-95"
          :class="hasLogs(act.id)
            ? 'border-zinc-300 hover:border-zinc-400'
            : 'border-zinc-200 hover:border-zinc-300'"
          @click="emit('select', act.id)"
        >
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover:scale-110 transition-transform"
            :style="{ backgroundColor: getCategoryColor(cat) + '15', color: getCategoryColor(cat) }"
          >
            <UIcon :name="act.icon" class="text-xl" />
          </div>
          <span class="text-xs font-medium text-zinc-700 text-center leading-tight">{{ act.name }}</span>

          <span
            v-if="logCount(act.id) > 0"
            class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white"
            :style="{ backgroundColor: getCategoryColor(cat) }"
          >
            {{ logCount(act.id) }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
