<script setup lang="ts">
const { showFeedback, currentFeedback, dismissFeedback } = useTaskFeedback()
const { themeConfig } = useEnergyState()

const animateCheck = ref(false)

watch(showFeedback, (val) => {
  if (val) {
    animateCheck.value = false
    setTimeout(() => {
      animateCheck.value = true
    }, 100)
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="showFeedback && currentFeedback"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
        @click.self="dismissFeedback"
      >
        <div class="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
          <!-- Animated Checkmark -->
          <div class="mb-6 flex justify-center">
            <svg class="size-20" viewBox="0 0 100 100">
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="#d1fae5"
                stroke-width="6"
              />
              <circle
                cx="50" cy="50" r="45"
                fill="none"
                stroke="#10b981"
                stroke-width="6"
                stroke-linecap="round"
                :stroke-dasharray="283"
                :stroke-dashoffset="animateCheck ? 0 : 283"
                class="transition-all duration-700 ease-out"
                :style="{ transformOrigin: 'center', transform: 'rotate(-90deg)' }"
              />
              <path
                d="M30 52 L44 66 L70 38"
                fill="none"
                stroke="#10b981"
                stroke-width="5"
                stroke-linecap="round"
                stroke-linejoin="round"
                :stroke-dasharray="60"
                :stroke-dashoffset="animateCheck ? 0 : 60"
                class="transition-all duration-500 ease-out"
                :style="{ transitionDelay: '400ms' }"
              />
            </svg>
          </div>

          <h3 class="mb-2 text-center text-lg font-bold text-gray-900">
            Task Completed
          </h3>
          <p class="mb-1 text-center text-sm text-gray-400">
            {{ currentFeedback.taskTitle }}
          </p>

          <div class="my-5 rounded-xl bg-teal-50 p-4">
            <p class="text-center text-sm font-medium leading-relaxed text-teal-800">
              "{{ currentFeedback.insight }}"
            </p>
          </div>

          <UButton
            block
            variant="soft"
            color="primary"
            @click="dismissFeedback"
          >
            Continue
          </UButton>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
