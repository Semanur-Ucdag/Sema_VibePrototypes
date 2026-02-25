import { createSharedComposable } from '@vueuse/core'

type UserRole = 'patient' | 'therapist' | 'admin'
type AccountType = 'client' | 'therapist'

interface AuthUser {
  id: string
  email: string
  fullName: string
  role: UserRole
  avatarUrl: string | null
  accountType: AccountType
}

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
  const user = useState<AuthUser | null>('current-auth-user', () => null)
  const hasInitialized = useState<boolean>('current-auth-initialized', () => false)

  const profile = useState<ProfileRow | null>('current-user-profile', () => null)
  const isLoadingProfile = useState<boolean>('current-user-profile-loading', () => false)
  const profileError = useState<string | null>('current-user-profile-error', () => null)

  async function refreshProfile(): Promise<void> {
    isLoadingProfile.value = true
    profileError.value = null

    try {
      const response = await $fetch<{ data: { user: AuthUser | null } }>('/api/auth/me', {
        method: 'GET'
      })
      user.value = response.data.user
      profile.value = response.data.user
        ? {
            id: response.data.user.id,
            email: response.data.user.email,
            full_name: response.data.user.fullName,
            role: response.data.user.role,
            avatar_url: response.data.user.avatarUrl
          }
        : null
      hasInitialized.value = true
    } catch (error: unknown) {
      user.value = null
      profile.value = null
      profileError.value = error instanceof Error ? error.message : 'Failed to fetch user profile'
      hasInitialized.value = true
    } finally {
      isLoadingProfile.value = false
    }
  }

  if (!hasInitialized.value) {
    void refreshProfile()
  }

  const role = computed<UserRole | null>(() => {
    const profileRole = parseRole(profile.value?.role)
    if (profileRole) {
      return profileRole
    }

    const userRole = parseRole(user.value?.role)
    if (userRole) {
      return userRole
    }

    return null
  })

  const accountType = computed<AccountType | null>(() => mapRoleToAccountType(role.value))
  const email = computed<string | null>(() => profile.value?.email ?? user.value?.email ?? null)
  const fullName = computed<string | null>(() => profile.value?.full_name ?? user.value?.fullName ?? null)
  const avatarUrl = computed<string | null>(() => profile.value?.avatar_url ?? user.value?.avatarUrl ?? null)
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
