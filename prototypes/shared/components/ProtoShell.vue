<script setup lang="ts">
interface Props {
  title: string
  prototypeNumber: number
}

const props = defineProps<Props>()

useHead({
  titleTemplate: (title) => title ? `P${props.prototypeNumber} | ${title}` : `Prototype ${props.prototypeNumber}`
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <slot />
  </div>
</template>
