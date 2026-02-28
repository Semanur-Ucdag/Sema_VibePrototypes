<script setup lang="ts">
definePageMeta({ layout: false })

const { isComplete, reset, totalCards } = useThoughtDeck()

type Screen = 'intro' | 'deck' | 'summary'

const currentScreen = ref<Screen>('intro')
const transitioning = ref(false)

function startSession(): void {
  reset()
  transitionTo('deck')
}

function transitionTo(screen: Screen): void {
  transitioning.value = true
  setTimeout(() => {
    currentScreen.value = screen
    transitioning.value = false
  }, 400)
}

watch(isComplete, (complete) => {
  if (complete) {
    setTimeout(() => {
      transitionTo('summary')
    }, 800)
  }
})
</script>

<template>
  <ProtoShell title="The Thought Sorter" :prototype-number="3">
    <div class="min-h-screen bg-gradient-to-br from-slate-50 via-zinc-50 to-stone-100 relative overflow-hidden">
      <!-- Decorative background elements -->
      <div class="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div class="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-emerald-100/30 blur-3xl" />
        <div class="absolute top-1/3 -right-32 w-80 h-80 rounded-full bg-rose-100/20 blur-3xl" />
        <div class="absolute -bottom-20 left-1/4 w-64 h-64 rounded-full bg-violet-100/20 blur-3xl" />
      </div>

      <ProtoHeader
        title="The Thought Sorter"
        description="Separate distorted thoughts from balanced truths"
        :prototype-number="3"
      />

      <div
        class="relative z-10 transition-all duration-500 ease-in-out"
        :class="transitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'"
      >
        <!-- Intro Screen -->
        <div v-if="currentScreen === 'intro'" class="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div class="max-w-lg text-center">
            <!-- Animated icon -->
            <div class="relative inline-flex items-center justify-center mb-8">
              <div class="absolute inset-0 w-24 h-24 rounded-full bg-zinc-200/50 animate-ping-slow" />
              <div class="relative w-24 h-24 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 border border-zinc-300/50 shadow-lg flex items-center justify-center">
                <UIcon name="i-lucide-brain" class="text-5xl text-zinc-500" />
              </div>
            </div>

            <h1 class="text-4xl font-bold text-zinc-800 mb-3 tracking-tight">
              The Thought Sorter
            </h1>

            <p class="text-lg text-zinc-500 mb-10 leading-relaxed max-w-md mx-auto">
              You'll see {{ totalCards }} thoughts. Decide if each one is a
              <span class="text-rose-500 font-medium">cognitive distortion</span> or a
              <span class="text-emerald-500 font-medium">balanced truth</span>.
            </p>

            <!-- Instructions -->
            <div class="grid grid-cols-2 gap-4 mb-10 max-w-md mx-auto">
              <div class="p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-rose-200/60 shadow-sm text-center hover:shadow-md transition-shadow">
                <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-rose-100 flex items-center justify-center">
                  <UIcon name="i-lucide-x" class="text-2xl text-rose-500" />
                </div>
                <p class="text-sm font-semibold text-rose-700 mb-1">Swipe Left</p>
                <p class="text-xs text-rose-400 leading-relaxed">Discard distorted thoughts</p>
              </div>

              <div class="p-5 bg-white/70 backdrop-blur-sm rounded-2xl border border-emerald-200/60 shadow-sm text-center hover:shadow-md transition-shadow">
                <div class="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <UIcon name="i-lucide-heart" class="text-2xl text-emerald-500" />
                </div>
                <p class="text-sm font-semibold text-emerald-700 mb-1">Swipe Right</p>
                <p class="text-xs text-emerald-400 leading-relaxed">Keep balanced truths</p>
              </div>
            </div>

            <UButton
              size="xl"
              icon="i-lucide-play"
              class="px-10 shadow-lg"
              @click="startSession"
            >
              Begin Session
            </UButton>

            <p class="mt-4 text-xs text-zinc-400">
              Takes about 2 minutes
            </p>
          </div>
        </div>

        <!-- Swipe Deck -->
        <SwipeDeck v-if="currentScreen === 'deck'" />

        <!-- Session Summary -->
        <SessionSummary v-if="currentScreen === 'summary'" />
      </div>
    </div>
  </ProtoShell>
</template>

<style>
@keyframes ping-slow {
  0% { transform: scale(1); opacity: 0.3; }
  75%, 100% { transform: scale(1.4); opacity: 0; }
}

.animate-ping-slow {
  animation: ping-slow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
