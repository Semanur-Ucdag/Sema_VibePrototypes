<script setup lang="ts">
const { weeklyWins, supporters, shareWeeklyWin } = useSocial()

const showSharePanel = ref(false)
const selectedSupporters = ref<Set<string>>(new Set())
const shared = ref(false)
const shareAnimation = ref(false)

function toggleSupporter(id: string): void {
  if (selectedSupporters.value.has(id)) {
    selectedSupporters.value.delete(id)
  } else {
    selectedSupporters.value.add(id)
  }
}

function handleShare(): void {
  if (selectedSupporters.value.size === 0) return

  shareWeeklyWin(Array.from(selectedSupporters.value))
  shareAnimation.value = true
  shared.value = true

  setTimeout(() => {
    shareAnimation.value = false
    shared.value = false
    showSharePanel.value = false
    selectedSupporters.value.clear()
  }, 3000)
}

function openSharePanel(): void {
  showSharePanel.value = true
  shared.value = false
  selectedSupporters.value.clear()
}

const COLOR_MAP: Record<string, string> = {
  rose: 'bg-rose-100 text-rose-500 border-rose-200',
  blue: 'bg-blue-100 text-blue-500 border-blue-200',
  violet: 'bg-violet-100 text-violet-500 border-violet-200',
  amber: 'bg-amber-100 text-amber-500 border-amber-200',
  teal: 'bg-teal-100 text-teal-500 border-teal-200'
}

function getColorClass(color: string): string {
  return COLOR_MAP[color] ?? 'bg-zinc-100 text-zinc-500 border-zinc-200'
}
</script>

<template>
  <div class="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/50 p-5 shadow-sm relative overflow-hidden">
    <!-- Sparkle animation on share -->
    <div v-if="shareAnimation" class="absolute inset-0 pointer-events-none z-10">
      <div v-for="i in 8" :key="i" class="absolute animate-sparkle" :style="{
        left: `${10 + Math.random() * 80}%`,
        top: `${10 + Math.random() * 80}%`,
        animationDelay: `${i * 0.1}s`
      }">
        <UIcon name="i-lucide-sparkles" class="text-amber-400 text-lg" />
      </div>
    </div>

    <div class="flex items-center gap-2 mb-4">
      <UIcon name="i-lucide-award" class="text-xl text-amber-600" />
      <h3 class="text-sm font-semibold text-amber-800">Weekly Wins</h3>
    </div>

    <!-- Win items -->
    <div class="space-y-2.5 mb-5">
      <div
        v-for="win in weeklyWins"
        :key="win.label"
        class="flex items-center gap-3 p-2.5 bg-white/70 backdrop-blur-sm rounded-xl"
      >
        <div class="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
          <UIcon :name="win.icon" class="text-base text-amber-600" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs text-zinc-500">{{ win.label }}</p>
          <p class="text-sm font-bold text-zinc-800">{{ win.value }}</p>
        </div>
      </div>
    </div>

    <!-- Share panel -->
    <Transition name="slide">
      <div v-if="showSharePanel && !shared" class="mb-4 p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-amber-200/50">
        <p class="text-xs font-medium text-zinc-600 mb-2.5">Share with:</p>
        <div class="flex flex-wrap gap-2 mb-3">
          <button
            v-for="s in supporters"
            :key="s.id"
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all active:scale-95"
            :class="selectedSupporters.has(s.id)
              ? getColorClass(s.color)
              : 'bg-white border-zinc-200 text-zinc-500'"
            @click="toggleSupporter(s.id)"
          >
            <UIcon v-if="selectedSupporters.has(s.id)" name="i-lucide-check" class="text-xs" />
            {{ s.name }}
          </button>
        </div>
        <button
          class="w-full py-2 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
          :disabled="selectedSupporters.size === 0"
          @click="handleShare"
        >
          <UIcon name="i-lucide-send" class="text-sm" />
          Share with {{ selectedSupporters.size }} {{ selectedSupporters.size === 1 ? 'person' : 'people' }}
        </button>
      </div>
    </Transition>

    <!-- Shared confirmation -->
    <div v-if="shared" class="mb-4 p-4 bg-emerald-50 rounded-xl text-center border border-emerald-200">
      <UIcon name="i-lucide-check-circle" class="text-2xl text-emerald-500 mb-1" />
      <p class="text-sm font-semibold text-emerald-700">Shared!</p>
      <p class="text-[10px] text-emerald-500">Responses coming soon...</p>
    </div>

    <!-- Pulse Out button -->
    <button
      v-if="!showSharePanel && !shared"
      class="w-full py-2.5 text-sm font-semibold text-amber-700 bg-white/70 hover:bg-white border border-amber-300 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm"
      @click="openSharePanel"
    >
      <UIcon name="i-lucide-share-2" class="text-base" />
      Pulse Out to Circle
    </button>
  </div>
</template>

<style scoped>
@keyframes sparkle {
  0% { opacity: 0; transform: scale(0) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(180deg); }
  100% { opacity: 0; transform: scale(0) rotate(360deg); }
}
.animate-sparkle { animation: sparkle 0.8s ease-out forwards; }

.slide-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.slide-leave-active { transition: all 0.2s ease-out; }
.slide-enter-from { opacity: 0; transform: translateY(-10px); max-height: 0; }
.slide-leave-to { opacity: 0; max-height: 0; }
</style>
