<script setup lang="ts">
const {
  swipedCards,
  vaultCards,
  binCards,
  correctDistortions,
  correctBalanced,
  totalDistortions,
  totalBalanced,
  accuracy,
  reset
} = useThoughtDeck()

const showContent = ref(false)

onMounted(() => {
  setTimeout(() => {
    showContent.value = true
  }, 300)
})

const incorrectSwipes = computed(() => {
  return swipedCards.value.filter(sc => {
    if (sc.thought.type === 'distortion' && sc.direction === 'right') return true
    if (sc.thought.type === 'balanced' && sc.direction === 'left') return true
    return false
  })
})

const distortionTypesIdentified = computed(() => {
  const types = new Set<string>()
  swipedCards.value
    .filter(sc => sc.thought.type === 'distortion' && sc.direction === 'left' && sc.thought.distortionType)
    .forEach(sc => types.add(sc.thought.distortionType!))
  return Array.from(types)
})

const accuracyColor = computed(() => {
  if (accuracy.value >= 80) return 'text-emerald-600'
  if (accuracy.value >= 60) return 'text-amber-600'
  return 'text-rose-600'
})

const accuracyBg = computed(() => {
  if (accuracy.value >= 80) return 'bg-emerald-50 border-emerald-200'
  if (accuracy.value >= 60) return 'bg-amber-50 border-amber-200'
  return 'bg-rose-50 border-rose-200'
})
</script>

<template>
  <div
    class="max-w-lg mx-auto px-4 py-8 transition-all duration-700"
    :class="showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
  >
    <!-- Header -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 mb-4">
        <UIcon name="i-lucide-brain" class="text-3xl text-zinc-600" />
      </div>
      <h2 class="text-2xl font-bold text-zinc-800 mb-2">
        Session Complete
      </h2>
      <p class="text-sm text-zinc-500">
        You've sorted through all {{ swipedCards.length }} thoughts. Here's your analysis.
      </p>
    </div>

    <!-- Accuracy score -->
    <div
      class="rounded-2xl border p-6 mb-6 text-center transition-all"
      :class="accuracyBg"
    >
      <p class="text-sm font-medium text-zinc-500 mb-1">Overall Accuracy</p>
      <p class="text-5xl font-bold mb-2" :class="accuracyColor">
        {{ accuracy }}%
      </p>
      <p class="text-xs text-zinc-400">
        Based on {{ swipedCards.length }} sorted thoughts
      </p>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-rose-50 rounded-xl border border-rose-200 p-4 text-center">
        <div class="flex items-center justify-center gap-1 mb-2">
          <UIcon name="i-lucide-trash-2" class="text-rose-500" />
          <span class="text-xs font-medium text-rose-600">Distortion Bin</span>
        </div>
        <p class="text-2xl font-bold text-rose-700">
          {{ correctDistortions }}<span class="text-sm font-normal text-rose-400"> / {{ totalDistortions }}</span>
        </p>
        <p class="text-xs text-rose-400 mt-1">correctly identified</p>
      </div>

      <div class="bg-emerald-50 rounded-xl border border-emerald-200 p-4 text-center">
        <div class="flex items-center justify-center gap-1 mb-2">
          <UIcon name="i-lucide-gem" class="text-emerald-500" />
          <span class="text-xs font-medium text-emerald-600">Wisdom Vault</span>
        </div>
        <p class="text-2xl font-bold text-emerald-700">
          {{ correctBalanced }}<span class="text-sm font-normal text-emerald-400"> / {{ totalBalanced }}</span>
        </p>
        <p class="text-xs text-emerald-400 mt-1">correctly kept</p>
      </div>
    </div>

    <!-- Distortion types identified -->
    <div v-if="distortionTypesIdentified.length > 0" class="mb-6">
      <h3 class="text-sm font-semibold text-zinc-600 mb-3 flex items-center gap-2">
        <UIcon name="i-lucide-shield-check" class="text-zinc-400" />
        Distortion Types You Identified
      </h3>
      <div class="flex flex-wrap gap-2">
        <UBadge
          v-for="dtype in distortionTypesIdentified"
          :key="dtype"
          color="neutral"
          variant="subtle"
          size="sm"
        >
          {{ dtype }}
        </UBadge>
      </div>
    </div>

    <!-- Incorrect swipes analysis -->
    <div v-if="incorrectSwipes.length > 0" class="mb-6">
      <h3 class="text-sm font-semibold text-zinc-600 mb-3 flex items-center gap-2">
        <UIcon name="i-lucide-lightbulb" class="text-amber-400" />
        Worth Reflecting On
      </h3>
      <div class="space-y-2">
        <div
          v-for="sc in incorrectSwipes"
          :key="sc.thought.id"
          class="p-3 bg-amber-50 rounded-lg border border-amber-200"
        >
          <p class="text-sm text-zinc-700 italic mb-1">"{{ sc.thought.text }}"</p>
          <p class="text-xs text-amber-600">
            <span v-if="sc.thought.type === 'distortion'">
              This is actually a <strong>{{ sc.thought.distortionType }}</strong> distortion.
            </span>
            <span v-else>
              This is actually a <strong>balanced truth</strong> worth keeping.
            </span>
          </p>
        </div>
      </div>
    </div>

    <!-- Reflection Moment -->
    <ReflectionMoment :vault-cards="vaultCards" />

    <!-- Try Again -->
    <div class="mt-8 text-center">
      <UButton
        icon="i-lucide-rotate-ccw"
        size="lg"
        color="neutral"
        variant="outline"
        @click="reset"
      >
        Try Again
      </UButton>
    </div>
  </div>
</template>
