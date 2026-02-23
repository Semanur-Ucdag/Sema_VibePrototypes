<script setup lang="ts">
import type { AvatarProps } from '@nuxt/ui'

interface Props {
  avatars: AvatarProps[]
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  max: 3
})

const visible = computed<AvatarProps[]>(() => props.avatars.slice(0, props.max))
const extraCount = computed<number>(() => Math.max(props.avatars.length - props.max, 0))
</script>

<template>
  <div class="flex items-center">
    <UAvatar
      v-for="(avatar, index) in visible"
      :key="`${avatar.alt}-${index}`"
      v-bind="avatar"
      size="xs"
      class="ring-2 ring-default -mr-2 last:mr-0"
    />
    <UBadge
      v-if="extraCount > 0"
      color="neutral"
      variant="soft"
      size="sm"
      class="ml-2"
    >
      +{{ extraCount }}
    </UBadge>
  </div>
</template>
