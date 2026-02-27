<script setup lang="ts">
definePageMeta({ layout: false })

const { isEnergySelected, themeConfig } = useEnergyState()
</script>

<template>
  <div
    class="min-h-screen transition-colors duration-500"
    :class="isEnergySelected ? themeConfig.bg : 'bg-gray-50'"
  >
    <!-- Header -->
    <header
      v-if="isEnergySelected"
      class="border-b border-gray-200/60 px-6 py-3 backdrop-blur-sm transition-colors duration-500"
      :class="themeConfig.cardBg"
    >
      <div class="mx-auto flex max-w-3xl items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-layout-dashboard" class="size-5" :class="themeConfig.accent" />
          <span class="text-sm font-semibold" :class="themeConfig.text">Task Board</span>
          <UBadge color="primary" variant="subtle" size="xs">
            Prototype 2
          </UBadge>
        </div>
        <div class="flex items-center gap-1.5">
          <UIcon :name="themeConfig.icon" class="size-4" :class="themeConfig.accent" />
          <span class="text-xs font-medium" :class="themeConfig.subtext">
            {{ themeConfig.label }}
          </span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <Transition name="fade" mode="out-in">
      <EnergySelector
        v-if="!isEnergySelected"
        key="selector"
        @selected="() => {}"
      />
      <TaskBoard
        v-else
        key="board"
      />
    </Transition>

    <!-- Slideover for Task Detail -->
    <TaskDetail />

    <!-- Feedback Modal -->
    <TaskFeedback />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
