const THERAPIST_ONLY_PREFIXES = ['/caseloads']
const CLIENT_ONLY_PREFIXES = ['/sessions']
const PUBLIC_PREFIXES = ['/auth', '/confirm']

function matchesPrefix(path: string, prefix: string): boolean {
  if (prefix === '/') {
    return path === '/'
  }

  return path.startsWith(prefix)
}

function isPublicPath(path: string): boolean {
  return PUBLIC_PREFIXES.some(prefix => path.startsWith(prefix))
}

export default defineNuxtRouteMiddleware(async (to) => {
  if (isPublicPath(to.path)) {
    return
  }

  const user = useSupabaseUser()
  if (!user.value) {
    return
  }

  const { accountType, refreshProfile } = useCurrentUser()

  if (!accountType.value) {
    await refreshProfile()
  }

  if (accountType.value === 'client') {
    const isTherapistOnlyPage = THERAPIST_ONLY_PREFIXES.some(prefix => matchesPrefix(to.path, prefix))

    if (isTherapistOnlyPage) {
      return navigateTo('/')
    }
  }

  if (accountType.value === 'therapist') {
    const isClientOnlyPage = CLIENT_ONLY_PREFIXES.some(prefix => matchesPrefix(to.path, prefix))

    if (isClientOnlyPage) {
      return navigateTo('/')
    }
  }
})
