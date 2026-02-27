export type AvatarGender = 'female' | 'male'
export type VoiceTone = 'warm' | 'neutral' | 'professional'

export interface OnboardingData {
  hobbies: string[]
  customHobby: string
  relaxation: string
  phobias: string[]
  customPhobia: string
  preferredName: string
  clinicalComfort: number
}

const avatarGender = ref<AvatarGender>('female')
const voiceTone = ref<VoiceTone>('warm')

const onboardingData = reactive<OnboardingData>({
  hobbies: [],
  customHobby: '',
  relaxation: '',
  phobias: [],
  customPhobia: '',
  preferredName: '',
  clinicalComfort: 3
})

const isOnboardingComplete = ref(false)

export function useOnboardingState() {
  function reset(): void {
    avatarGender.value = 'female'
    voiceTone.value = 'warm'
    onboardingData.hobbies = []
    onboardingData.customHobby = ''
    onboardingData.relaxation = ''
    onboardingData.phobias = []
    onboardingData.customPhobia = ''
    onboardingData.preferredName = ''
    onboardingData.clinicalComfort = 3
    isOnboardingComplete.value = false
  }

  const allHobbies = computed<string[]>(() => {
    const list = [...onboardingData.hobbies]
    if (onboardingData.customHobby.trim()) {
      list.push(onboardingData.customHobby.trim())
    }
    return list
  })

  const allPhobias = computed<string[]>(() => {
    const list = [...onboardingData.phobias]
    if (onboardingData.customPhobia.trim()) {
      list.push(onboardingData.customPhobia.trim())
    }
    return list
  })

  const randomHobby = computed<string>(() => {
    const hobbies = allHobbies.value
    if (hobbies.length === 0) return 'your usual activities'
    return hobbies[Math.floor(Math.random() * hobbies.length)]
  })

  return {
    avatarGender,
    voiceTone,
    onboardingData,
    isOnboardingComplete,
    allHobbies,
    allPhobias,
    randomHobby,
    reset
  }
}
