<script setup lang="ts">
import type { Thought } from '~/composables/useThoughtDeck'

interface Props {
  thought: Thought
  offsetX: number
  isDragging: boolean
}

const props = withDefaults(defineProps<Props>(), {
  offsetX: 0,
  isDragging: false
})

const swipeThreshold = 100

const cardStyle = computed(() => {
  const x = props.offsetX
  const rotation = (x / 18)
  const maxRotation = 15
  const clampedRotation = Math.max(-maxRotation, Math.min(maxRotation, rotation))

  return {
    transform: `translateX(${x}px) rotate(${clampedRotation}deg)`,
    transition: props.isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
})

const swipeProgress = computed(() => {
  return Math.min(Math.abs(props.offsetX) / swipeThreshold, 1)
})

const leftIndicatorOpacity = computed(() => {
  if (props.offsetX >= 0) return 0
  return swipeProgress.value
})

const rightIndicatorOpacity = computed(() => {
  if (props.offsetX <= 0) return 0
  return swipeProgress.value
})

const showLeftStamp = computed(() => props.offsetX < -(swipeThreshold * 0.6))
const showRightStamp = computed(() => props.offsetX > (swipeThreshold * 0.6))

const cardBorderClass = computed(() => {
  if (props.offsetX < -60) return 'border-rose-400 shadow-rose-200/50'
  if (props.offsetX > 60) return 'border-emerald-400 shadow-emerald-200/50'
  return 'border-zinc-200/80'
})

const cardBgGradient = computed(() => {
  if (props.offsetX < -60) return 'from-rose-50/80 to-white'
  if (props.offsetX > 60) return 'from-emerald-50/80 to-white'
  return 'from-white to-zinc-50/50'
})
</script>

<template>
  <div
    class="absolute inset-0 flex items-center justify-center select-none"
    :style="cardStyle"
  >
    <div class="relative w-full max-w-md mx-4">
      <!-- Left indicator -->
      <div
        class="absolute -left-6 top-1/2 -translate-y-1/2 z-20 transition-all duration-200"
        :style="{ opacity: leftIndicatorOpacity, transform: `translateY(-50%) scale(${0.7 + leftIndicatorOpacity * 0.3})` }"
      >
        <div class="bg-rose-500 text-white rounded-full p-3.5 shadow-lg shadow-rose-300/50">
          <UIcon name="i-lucide-trash-2" class="text-2xl" />
        </div>
      </div>

      <!-- Right indicator -->
      <div
        class="absolute -right-6 top-1/2 -translate-y-1/2 z-20 transition-all duration-200"
        :style="{ opacity: rightIndicatorOpacity, transform: `translateY(-50%) scale(${0.7 + rightIndicatorOpacity * 0.3})` }"
      >
        <div class="bg-emerald-500 text-white rounded-full p-3.5 shadow-lg shadow-emerald-300/50">
          <UIcon name="i-lucide-gem" class="text-2xl" />
        </div>
      </div>

      <!-- Card -->
      <div
        class="relative overflow-hidden rounded-3xl border-2 bg-gradient-to-b shadow-2xl transition-all duration-200"
        :class="[cardBorderClass, cardBgGradient]"
        style="min-height: 420px;"
      >
        <!-- Decorative circles -->
        <div class="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-zinc-100/40 pointer-events-none" />
        <div class="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-zinc-100/30 pointer-events-none" />

        <!-- DISTORTION stamp -->
        <Transition name="stamp">
          <div
            v-if="showLeftStamp"
            class="absolute top-8 left-1/2 -translate-x-1/2 z-20 -rotate-12"
          >
            <div class="border-4 border-rose-500 rounded-lg px-5 py-2 bg-rose-500/10 backdrop-blur-sm">
              <span class="text-rose-600 font-black text-xl tracking-widest uppercase">Distortion</span>
            </div>
          </div>
        </Transition>

        <!-- BALANCED stamp -->
        <Transition name="stamp">
          <div
            v-if="showRightStamp"
            class="absolute top-8 left-1/2 -translate-x-1/2 z-20 rotate-12"
          >
            <div class="border-4 border-emerald-500 rounded-lg px-5 py-2 bg-emerald-500/10 backdrop-blur-sm">
              <span class="text-emerald-600 font-black text-xl tracking-widest uppercase">Balanced</span>
            </div>
          </div>
        </Transition>

        <!-- Content -->
        <div class="relative z-10 flex flex-col items-center justify-center px-8 py-12" style="min-height: 420px;">
          <!-- Theme icon -->
          <div class="mb-6">
            <div
              class="w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300"
              :class="offsetX < -40
                ? 'bg-rose-100 text-rose-500'
                : offsetX > 40
                  ? 'bg-emerald-100 text-emerald-500'
                  : 'bg-zinc-100 text-zinc-400'"
            >
              <UIcon :name="thought.icon" class="text-3xl" />
            </div>
          </div>

          <!-- Thought text -->
          <p class="text-2xl md:text-3xl font-semibold text-zinc-800 text-center leading-relaxed italic">
            "{{ thought.text }}"
          </p>

          <!-- Subtle divider -->
          <div class="mt-8 w-12 h-1 rounded-full bg-zinc-200" />
        </div>
      </div>

      <!-- Swipe hints -->
      <div class="flex justify-between mt-5 px-4">
        <span
          class="text-xs font-medium flex items-center gap-1.5 transition-opacity duration-200"
          :class="offsetX < -20 ? 'text-rose-500 opacity-100' : 'text-zinc-400 opacity-40'"
        >
          <UIcon name="i-lucide-arrow-left" class="text-sm" />
          Distortion
        </span>
        <span
          class="text-xs font-medium flex items-center gap-1.5 transition-opacity duration-200"
          :class="offsetX > 20 ? 'text-emerald-500 opacity-100' : 'text-zinc-400 opacity-40'"
        >
          Balanced
          <UIcon name="i-lucide-arrow-right" class="text-sm" />
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stamp-enter-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.stamp-leave-active {
  transition: all 0.15s ease-out;
}
.stamp-enter-from {
  opacity: 0;
  transform: translateX(-50%) scale(0.5);
}
.stamp-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.8);
}
</style>
