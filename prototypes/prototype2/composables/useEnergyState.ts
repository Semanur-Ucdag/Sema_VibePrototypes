export type EnergyLevel = 'low' | 'medium' | 'high'

export interface ThemeConfig {
  bg: string
  cardBg: string
  text: string
  subtext: string
  accent: string
  accentBg: string
  ring: string
  icon: string
  label: string
  sublabel: string
  border: string
}

const THEMES: Record<EnergyLevel, ThemeConfig> = {
  low: {
    bg: 'bg-slate-900',
    cardBg: 'bg-slate-800',
    text: 'text-gray-300',
    subtext: 'text-gray-400',
    accent: 'text-indigo-400',
    accentBg: 'bg-indigo-500',
    ring: 'ring-indigo-500',
    border: 'border-indigo-500/30',
    icon: 'i-lucide-moon',
    label: 'Low Energy',
    sublabel: "It's okay. Let's keep it gentle."
  },
  medium: {
    bg: 'bg-stone-50',
    cardBg: 'bg-white',
    text: 'text-gray-700',
    subtext: 'text-gray-500',
    accent: 'text-amber-500',
    accentBg: 'bg-amber-500',
    ring: 'ring-amber-500',
    border: 'border-amber-200',
    icon: 'i-lucide-cloud-sun',
    label: 'Medium Energy',
    sublabel: 'A balanced pace works well.'
  },
  high: {
    bg: 'bg-white',
    cardBg: 'bg-white',
    text: 'text-gray-900',
    subtext: 'text-gray-600',
    accent: 'text-teal-500',
    accentBg: 'bg-teal-500',
    ring: 'ring-teal-500',
    border: 'border-teal-200',
    icon: 'i-lucide-sun',
    label: 'High Energy',
    sublabel: "Great! Let's make the most of it."
  }
}

const DEFAULT_THEME: ThemeConfig = {
  bg: 'bg-gray-50',
  cardBg: 'bg-white',
  text: 'text-gray-900',
  subtext: 'text-gray-500',
  accent: 'text-teal-500',
  accentBg: 'bg-teal-500',
  ring: 'ring-teal-500',
  border: 'border-gray-200',
  icon: 'i-lucide-sun',
  label: '',
  sublabel: ''
}

const energyLevel = ref<EnergyLevel | null>(null)

export function useEnergyState() {
  const isEnergySelected = computed(() => energyLevel.value !== null)

  const themeConfig = computed<ThemeConfig>(() => {
    if (!energyLevel.value) return DEFAULT_THEME
    return THEMES[energyLevel.value]
  })

  function selectEnergy(level: EnergyLevel): void {
    energyLevel.value = level
  }

  function resetEnergy(): void {
    energyLevel.value = null
  }

  return {
    energyLevel,
    isEnergySelected,
    themeConfig,
    selectEnergy,
    resetEnergy
  }
}
