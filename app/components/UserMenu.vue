<script setup lang="ts">
import type { AvatarProps, DropdownMenuItem } from '@nuxt/ui'

defineProps<{
  iconOnly?: boolean
}>()

const supabase = useSupabaseClient()
const { accountType, avatarUrl, email, fullName, isLoadingProfile } = useCurrentUser()

const displayName = computed<string>(() => fullName.value ?? email.value ?? 'User account')
const accountLabel = computed<string>(() => {
  return accountType.value === 'client' ? 'Client account' : 'Therapist account'
})
const fallbackAvatarUrl = computed<string>(() => {
  if (email.value) {
    return `https://i.pravatar.cc/120?u=${encodeURIComponent(email.value)}`
  }

  return 'https://i.pravatar.cc/120?img=28'
})
const triggerAvatar = computed<AvatarProps>(() => ({
  src: avatarUrl.value ?? fallbackAvatarUrl.value,
  alt: displayName.value
}))

async function handleSignOut(): Promise<void> {
  await supabase.auth.signOut()
  await navigateTo('/auth/sign-in')
}

const items = computed<DropdownMenuItem[][]>(() => {
  const menuItems: DropdownMenuItem[][] = []

  if (displayName.value) {
    menuItems.push([{
      label: displayName.value,
      type: 'label'
    }])
  }

  menuItems.push([{
    label: accountLabel.value,
    icon: 'i-lucide-shield-user'
  }])

  menuItems.push([{
    label: 'Sign out',
    icon: 'i-lucide-log-out',
    onSelect: handleSignOut
  }])

  return menuItems
})
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end', collisionPadding: 12 }"
    :ui="{ content: iconOnly ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <div
      class="inline-flex cursor-pointer items-center gap-2 rounded-md p-1 data-[state=open]:bg-elevated"
      role="button"
      tabindex="0"
    >
      <UAvatar
        v-bind="triggerAvatar"
        size="sm"
      />
      <template v-if="!iconOnly">
        <span class="truncate text-sm text-highlighted">{{ displayName }}</span>
        <UIcon name="i-lucide-chevrons-up-down" class="text-dimmed" />
      </template>
      <UIcon v-if="isLoadingProfile" name="i-lucide-loader-circle" class="animate-spin text-dimmed" />
    </div>
  </UDropdownMenu>
</template>
