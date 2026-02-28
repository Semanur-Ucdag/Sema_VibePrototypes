<script setup lang="ts">
import type { Thought } from '~/composables/useThoughtDeck'

interface Props {
  vaultCards: Thought[]
}

defineProps<Props>()

const { pinThought, pinnedThought } = useThoughtDeck()

const justPinned = ref(false)

function handlePin(thought: Thought): void {
  pinThought(thought)
  justPinned.value = true
  setTimeout(() => {
    justPinned.value = false
  }, 2000)
}
</script>

<template>
  <div class="mt-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
    <div class="flex items-center gap-2 mb-4">
      <UIcon name="i-lucide-sparkles" class="text-xl text-emerald-600" />
      <h3 class="text-lg font-semibold text-emerald-800">
        The Reflection Moment
      </h3>
    </div>

    <p class="text-sm text-emerald-700 mb-5">
      These are your truths to hold onto today. Would you like to pin one to remember?
    </p>

    <div class="space-y-3">
      <div
        v-for="card in vaultCards"
        :key="card.id"
        class="flex items-center gap-3 p-4 bg-white rounded-xl border transition-all duration-300"
        :class="pinnedThought?.id === card.id
          ? 'border-emerald-400 shadow-md shadow-emerald-100'
          : 'border-zinc-200 hover:border-emerald-300'"
      >
        <UIcon
          :name="pinnedThought?.id === card.id ? 'i-lucide-pin' : 'i-lucide-gem'"
          class="text-lg shrink-0"
          :class="pinnedThought?.id === card.id ? 'text-emerald-600' : 'text-emerald-400'"
        />

        <p class="flex-1 text-sm text-zinc-700 italic">
          "{{ card.text }}"
        </p>

        <button
          v-if="pinnedThought?.id !== card.id"
          class="shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors active:scale-95"
          @click="handlePin(card)"
        >
          Pin
        </button>

        <span
          v-else
          class="shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500 text-white flex items-center gap-1"
        >
          <UIcon name="i-lucide-check" class="text-sm" />
          Pinned!
        </span>
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-if="vaultCards.length === 0"
      class="text-center py-6"
    >
      <UIcon name="i-lucide-inbox" class="text-3xl text-emerald-300 mb-2" />
      <p class="text-sm text-emerald-400">
        No balanced truths were collected this session.
      </p>
    </div>
  </div>
</template>
