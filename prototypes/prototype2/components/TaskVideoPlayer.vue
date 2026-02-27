<script setup lang="ts">
interface Props {
  videoUrl: string
}

const props = defineProps<Props>()
const { themeConfig } = useEnergyState()

const isYouTube = computed(() => props.videoUrl.includes('youtube.com/embed'))
</script>

<template>
  <div>
    <div v-if="isYouTube" class="aspect-video w-full overflow-hidden rounded-xl">
      <iframe
        :src="videoUrl"
        class="h-full w-full"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </div>

    <div
      v-else
      class="flex aspect-video w-full items-center justify-center rounded-xl border"
      :class="[themeConfig.cardBg, themeConfig.border]"
    >
      <div class="flex flex-col items-center gap-3">
        <div class="flex size-16 items-center justify-center rounded-full bg-gray-100">
          <UIcon name="i-lucide-play" class="size-8 text-gray-400" />
        </div>
        <p class="text-sm" :class="themeConfig.subtext">
          Video content placeholder
        </p>
      </div>
    </div>
  </div>
</template>
