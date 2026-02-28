import thoughtsData from '~/data/thoughts.json'

export interface Thought {
  id: string
  text: string
  type: 'distortion' | 'balanced'
  distortionType: string | null
  icon: string
}

export interface SwipedCard {
  thought: Thought
  direction: 'left' | 'right'
}

const thoughts = ref<Thought[]>([...(thoughtsData as Thought[])])
const currentIndex = ref(0)
const swipedCards = ref<SwipedCard[]>([])
const pinnedThought = ref<Thought | null>(null)

export function useThoughtDeck() {
  const currentCard = computed<Thought | null>(() => {
    return thoughts.value[currentIndex.value] ?? null
  })

  const isComplete = computed(() => {
    return currentIndex.value >= thoughts.value.length
  })

  const totalCards = computed(() => thoughts.value.length)

  const progress = computed(() => {
    if (totalCards.value === 0) return 0
    return currentIndex.value / totalCards.value
  })

  const vaultCards = computed(() => {
    return swipedCards.value
      .filter(sc => sc.direction === 'right')
      .map(sc => sc.thought)
  })

  const binCards = computed(() => {
    return swipedCards.value
      .filter(sc => sc.direction === 'left')
      .map(sc => sc.thought)
  })

  const correctDistortions = computed(() => {
    return swipedCards.value.filter(
      sc => sc.thought.type === 'distortion' && sc.direction === 'left'
    ).length
  })

  const correctBalanced = computed(() => {
    return swipedCards.value.filter(
      sc => sc.thought.type === 'balanced' && sc.direction === 'right'
    ).length
  })

  const totalDistortions = computed(() => {
    return thoughts.value.filter(t => t.type === 'distortion').length
  })

  const totalBalanced = computed(() => {
    return thoughts.value.filter(t => t.type === 'balanced').length
  })

  const accuracy = computed(() => {
    if (swipedCards.value.length === 0) return 0
    const correct = correctDistortions.value + correctBalanced.value
    return Math.round((correct / swipedCards.value.length) * 100)
  })

  function swipeLeft(): void {
    if (!currentCard.value) return
    swipedCards.value.push({ thought: currentCard.value, direction: 'left' })
    currentIndex.value++
  }

  function swipeRight(): void {
    if (!currentCard.value) return
    swipedCards.value.push({ thought: currentCard.value, direction: 'right' })
    currentIndex.value++
  }

  function pinThought(thought: Thought): void {
    pinnedThought.value = thought
  }

  function reset(): void {
    const shuffled = [...(thoughtsData as Thought[])].sort(() => Math.random() - 0.5)
    thoughts.value = shuffled
    currentIndex.value = 0
    swipedCards.value = []
    pinnedThought.value = null
  }

  return {
    currentCard,
    currentIndex,
    totalCards,
    isComplete,
    progress,
    swipedCards,
    vaultCards,
    binCards,
    correctDistortions,
    correctBalanced,
    totalDistortions,
    totalBalanced,
    accuracy,
    pinnedThought,
    swipeLeft,
    swipeRight,
    pinThought,
    reset
  }
}
