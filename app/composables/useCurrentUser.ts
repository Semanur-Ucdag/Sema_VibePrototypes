import { createSharedComposable } from '@vueuse/core'

type UserRole = 'patient' | 'therapist' | 'admin'
type AccountType = 'client' | 'therapist'

interface ProfileRow {
  id: string
  email: string
  full_name: string
  role: UserRole
  avatar_url: string | null
}

const VALID_ROLES: UserRole[] = ['patient', 'therapist', 'admin']

function parseRole(role: unknown): UserRole | null {
  if (typeof role !== 'string') {
    return null
  }

  return VALID_ROLES.includes(role as UserRole) ? role as UserRole : null
}

function mapRoleToAccountType(role: UserRole | null): AccountType | null {
  if (role === 'patient') {
    return 'client'
  }

  if (role === 'therapist' || role === 'admin') {
    return 'therapist'
  }

  return null
}

const _useCurrentUser = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()

  const profile = useState<ProfileRow | null>('current-user-profile', () => null)
  const isLoadingProfile = useState<boolean>('current-user-profile-loading', () => false)
  const profileError = useState<string | null>('current-user-profile-error', () => null)

  async function refreshProfile(): Promise<void> {
    const userId = user.value?.id

    if (!userId) {
      profile.value = null
      profileError.value = null
      return
    }

    isLoadingProfile.value = true
    profileError.value = null

    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, role, avatar_url')
      .eq('id', userId)
      .maybeSingle<ProfileRow>()

    if (error) {
      profile.value = null
      profileError.value = error.message
      isLoadingProfile.value = false
      return
    }

    profile.value = data
    isLoadingProfile.value = false
  }

  watch(
    () => user.value?.id,
    async () => {
      await refreshProfile()
    },
    { immediate: true }
  )

  const role = computed<UserRole | null>(() => {
    const profileRole = parseRole(profile.value?.role)
    if (profileRole) {
      return profileRole
    }

    const metadataRole = parseRole(user.value?.user_metadata?.role)
    if (metadataRole) {
      return metadataRole
    }

    return null
  })

  const accountType = computed<AccountType | null>(() => mapRoleToAccountType(role.value))
  const email = computed<string | null>(() => profile.value?.email ?? user.value?.email ?? null)
  const fullName = computed<string | null>(() => profile.value?.full_name ?? null)
  const avatarUrl = computed<string | null>(() => profile.value?.avatar_url ?? null)
  const isAuthenticated = computed<boolean>(() => !!user.value)
  const isTherapist = computed<boolean>(() => accountType.value === 'therapist')
  const isClient = computed<boolean>(() => accountType.value === 'client')
  const isAdmin = computed<boolean>(() => role.value === 'admin')

  return {
    user,
    profile,
    role,
    accountType,
    email,
    fullName,
    avatarUrl,
    isAuthenticated,
    isTherapist,
    isClient,
    isAdmin,
    isLoadingProfile,
    profileError,
    refreshProfile
  }
}

export const useCurrentUser = createSharedComposable(_useCurrentUser)
