<script setup lang="ts">
import { usePointerSwipe } from '@vueuse/core'

const { currentCard, currentIndex, totalCards, swipeLeft, swipeRight } = useThoughtDeck()
const { playWhoosh, playChime } = useSwipeSounds()

const cardRef = ref<HTMLElement | null>(null)
const offsetX = ref(0)
const isDragging = ref(false)
const isAnimatingOut = ref(false)
const exitDirection = ref<'left' | 'right' | null>(null)
const cardEntering = ref(false)

const swipeThreshold = 100

const displayIndex = computed(() => Math.min(currentIndex.value + 1, totalCards.value))

const bgTint = computed(() => {
  if (offsetX.value < -60) {
    const intensity = Math.min((Math.abs(offsetX.value) - 60) / 100, 0.15)
    return `rgba(244, 63, 94, ${intensity})`
  }
  if (offsetX.value > 60) {
    const intensity = Math.min((offsetX.value - 60) / 100, 0.15)
    return `rgba(16, 185, 129, ${intensity})`
  }
  return 'transparent'
})

const exitStyle = computed(() => {
  if (!isAnimatingOut.value || !exitDirection.value) return {}

  if (exitDirection.value === 'left') {
    return {
      transform: 'translateX(-160%) rotate(-25deg) scale(0.4)',
      opacity: '0',
      transition: 'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
  return {
    transform: 'translateX(160%) rotate(20deg) scale(0.3)',
    opacity: '0',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  }
})

const { distanceX } = usePointerSwipe(cardRef, {
  threshold: 10,
  onSwipe() {
    if (isAnimatingOut.value) return
    isDragging.value = true
    offsetX.value = -distanceX.value
  },
  onSwipeEnd() {
    if (isAnimatingOut.value) return
    isDragging.value = false

    if (offsetX.value < -swipeThreshold) {
      triggerSwipe('left')
    } else if (offsetX.value > swipeThreshold) {
      triggerSwipe('right')
    } else {
      offsetX.value = 0
    }
  }
})

function triggerSwipe(direction: 'left' | 'right'): void {
  isAnimatingOut.value = true
  exitDirection.value = direction

  if (direction === 'left') {
    playWhoosh()
  } else {
    playChime()
  }

  setTimeout(() => {
    if (direction === 'left') {
      swipeLeft()
    } else {
      swipeRight()
    }
    offsetX.value = 0
    isAnimatingOut.value = false
    exitDirection.value = null

    cardEntering.value = true
    setTimeout(() => {
      cardEntering.value = false
    }, 350)
  }, 450)
}

function handleButtonSwipe(direction: 'left' | 'right'): void {
  if (isAnimatingOut.value || !currentCard.value) return
  offsetX.value = direction === 'left' ? -(swipeThreshold + 60) : swipeThreshold + 60
  nextTick(() => {
    triggerSwipe(direction)
  })
}

const vaultCount = computed(() => {
  const { vaultCards } = useThoughtDeck()
  return vaultCards.value.length
})

const binCount = computed(() => {
  const { binCards } = useThoughtDeck()
  return binCards.value.length
})

const progressDots = computed(() => {
  const dots = []
  const { swipedCards } = useThoughtDeck()
  for (let i = 0; i < totalCards.value; i++) {
    if (i < swipedCards.value.length) {
      dots.push(swipedCards.value[i].direction === 'right' ? 'vault' : 'bin')
    } else if (i === currentIndex.value) {
      dots.push('current')
    } else {
      dots.push('pending')
    }
  }
  return dots
})
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-[85vh] relative px-4 transition-colors duration-300"
    :style="{ backgroundColor: bgTint }"
  >
    <!-- Progress area -->
    <div class="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
      <span class="text-sm font-semibold text-zinc-500">
        {{ displayIndex }} of {{ totalCards }}
      </span>
      <!-- Dot progress -->
      <div class="flex items-center gap-1.5">
        <div
          v-for="(dot, i) in progressDots"
          :key="i"
          class="rounded-full transition-all duration-300"
          :class="{
            'w-2.5 h-2.5 bg-emerald-400': dot === 'vault',
            'w-2.5 h-2.5 bg-rose-400': dot === 'bin',
            'w-3.5 h-3.5 bg-zinc-800 ring-2 ring-zinc-300': dot === 'current',
            'w-2 h-2 bg-zinc-200': dot === 'pending'
          }"
        />
      </div>
    </div>

    <!-- Bin counter (left) -->
    <div class="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 opacity-60">
      <div class="w-10 h-10 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center">
        <UIcon name="i-lucide-trash-2" class="text-lg text-rose-400" />
      </div>
      <span v-if="binCount > 0" class="text-xs font-bold text-rose-500">{{ binCount }}</span>
    </div>

    <!-- Card stack area -->
    <div class="relative w-full max-w-md" style="height: 520px;">
      <!-- Background stack cards (visual depth) -->
      <div
        v-if="currentIndex < totalCards - 1 && !isAnimatingOut"
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          class="w-[calc(100%-3rem)] mx-auto rounded-3xl border border-zinc-200/50 bg-zinc-100/60 shadow-sm"
          style="min-height: 410px; transform: translateY(12px) scale(0.95);"
        />
      </div>
      <div
        v-if="currentIndex < totalCards - 2 && !isAnimatingOut"
        class="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div
          class="w-[calc(100%-4.5rem)] mx-auto rounded-3xl border border-zinc-200/30 bg-zinc-100/30"
          style="min-height: 400px; transform: translateY(22px) scale(0.9);"
        />
      </div>

      <!-- Active card -->
      <div
        ref="cardRef"
        class="relative w-full h-full cursor-grab active:cursor-grabbing touch-none"
        :style="isAnimatingOut ? exitStyle : {}"
        :class="{ 'card-enter-animation': cardEntering }"
      >
        <ThoughtCard
          v-if="currentCard"
          :thought="currentCard"
          :offset-x="isAnimatingOut ? 0 : offsetX"
          :is-dragging="isDragging"
        />
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex items-center gap-6 mt-4">
      <button
        class="group flex flex-col items-center gap-1.5"
        :disabled="isAnimatingOut || !currentCard"
        @click="handleButtonSwipe('left')"
      >
        <div class="flex items-center justify-center w-16 h-16 rounded-full border-2 border-rose-300 bg-white hover:bg-rose-50 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-100 transition-all active:scale-90 shadow-md">
          <UIcon name="i-lucide-x" class="text-2xl text-rose-500 group-hover:scale-110 transition-transform" />
        </div>
        <span class="text-[10px] font-medium text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity">Discard</span>
      </button>

      <button
        class="group flex flex-col items-center gap-1.5"
        :disabled="isAnimatingOut || !currentCard"
        @click="handleButtonSwipe('right')"
      >
        <div class="flex items-center justify-center w-16 h-16 rounded-full border-2 border-emerald-300 bg-white hover:bg-emerald-50 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-100 transition-all active:scale-90 shadow-md">
          <UIcon name="i-lucide-heart" class="text-2xl text-emerald-500 group-hover:scale-110 transition-transform" />
        </div>
        <span class="text-[10px] font-medium text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">Keep</span>
      </button>
    </div>

    <!-- Wisdom Vault indicator (right) -->
    <div class="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
      <div
        class="relative flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 border-2 border-emerald-300 shadow-md transition-all"
        :class="{ 'animate-pulse-vault': isAnimatingOut && exitDirection === 'right' }"
      >
        <UIcon name="i-lucide-lock-keyhole" class="text-xl text-emerald-600" />
        <span
          v-if="vaultCount > 0"
          class="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
        >
          {{ vaultCount }}
        </span>
      </div>
      <span class="text-[10px] font-medium text-emerald-500 hidden sm:block">Vault</span>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse-vault {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
  50% { transform: scale(1.25); box-shadow: 0 0 0 14px rgba(16, 185, 129, 0); }
}

.animate-pulse-vault {
  animation: pulse-vault 0.6s ease-in-out;
}

@keyframes card-enter {
  0% { opacity: 0; transform: translateY(30px) scale(0.92); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}

.card-enter-animation {
  animation: card-enter 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
