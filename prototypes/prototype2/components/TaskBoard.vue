<script setup lang="ts">
const { themeConfig, resetEnergy } = useEnergyState()
const {
  filteredTasks,
  completionCount,
  totalTasks,
  isTaskCompleted,
  selectTask
} = useTaskBoard()

const activeTasks = computed(() =>
  filteredTasks.value.filter(t => !isTaskCompleted(t.id))
)

const completedTasks = computed(() =>
  filteredTasks.value.filter(t => isTaskCompleted(t.id))
)
</script>

<template>
  <div class="mx-auto max-w-3xl px-4 py-8">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold" :class="themeConfig.text">
          Your Tasks
        </h2>
        <p class="text-sm" :class="themeConfig.subtext">
          {{ themeConfig.label }} — {{ themeConfig.sublabel }}
        </p>
      </div>
      <div class="flex items-center gap-4">
        <DailyProgress
          :completed="completionCount"
          :total="totalTasks"
          :accent-color="themeConfig.accent"
        />
        <UButton
          size="xs"
          variant="ghost"
          color="neutral"
          icon="i-lucide-arrow-left"
          @click="resetEnergy"
        >
          Change
        </UButton>
      </div>
    </div>

    <!-- Active Tasks -->
    <div v-if="activeTasks.length > 0" class="mb-8">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TaskCard
          v-for="task in activeTasks"
          :key="task.id"
          :task="task"
          :is-completed="false"
          @select="selectTask(task.id)"
        />
      </div>
    </div>

    <!-- Completed Tasks -->
    <div v-if="completedTasks.length > 0">
      <h3 class="mb-3 text-sm font-medium" :class="themeConfig.subtext">
        Completed ({{ completedTasks.length }})
      </h3>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <TaskCard
          v-for="task in completedTasks"
          :key="task.id"
          :task="task"
          :is-completed="true"
          @select="selectTask(task.id)"
        />
      </div>
    </div>

    <!-- All Done -->
    <div
      v-if="activeTasks.length === 0 && completedTasks.length > 0"
      class="mt-8 text-center"
    >
      <div class="mb-3 inline-flex rounded-full bg-green-50 p-4">
        <UIcon name="i-lucide-party-popper" class="size-8 text-green-500" />
      </div>
      <h3 class="text-lg font-semibold" :class="themeConfig.text">
        All tasks completed!
      </h3>
      <p class="text-sm" :class="themeConfig.subtext">
        Well done. You showed up for yourself today.
      </p>
    </div>
  </div>
</template>
