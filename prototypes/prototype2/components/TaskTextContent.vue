<script setup lang="ts">
interface Props {
  textContent: string
  taskId?: string
}

const props = withDefaults(defineProps<Props>(), {
  taskId: ''
})

const { themeConfig } = useEnergyState()

const paragraphs = computed(() => {
  return props.textContent.split('\n').filter(line => line.trim() !== '')
})

function getLineType(line: string): 'h2' | 'h3' | 'h4' | 'bullet' | 'bold-paragraph' | 'paragraph' {
  if (line.startsWith('#### ')) return 'h4'
  if (line.startsWith('### ')) return 'h3'
  if (line.startsWith('## ')) return 'h2'
  if (line.startsWith('- ')) return 'bullet'
  if (line.startsWith('**') && line.endsWith('**')) return 'bold-paragraph'
  return 'paragraph'
}

function stripMarkdown(line: string): string {
  return line
    .replace(/^#{1,4}\s/, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^- /, '')
}
</script>

<template>
  <div class="prose-container space-y-3">
    <template v-for="(line, idx) in paragraphs" :key="idx">
      <h2
        v-if="getLineType(line) === 'h2'"
        class="text-xl font-bold" :class="themeConfig.text"
      >
        {{ stripMarkdown(line) }}
      </h2>
      <h3
        v-else-if="getLineType(line) === 'h3'"
        class="text-lg font-semibold" :class="themeConfig.text"
      >
        {{ stripMarkdown(line) }}
      </h3>
      <h4
        v-else-if="getLineType(line) === 'h4'"
        class="text-base font-semibold" :class="themeConfig.text"
      >
        {{ stripMarkdown(line) }}
      </h4>
      <div
        v-else-if="getLineType(line) === 'bullet'"
        class="flex items-start gap-2 pl-2 text-sm leading-relaxed"
        :class="themeConfig.subtext"
      >
        <span class="mt-1.5 size-1.5 shrink-0 rounded-full" :class="themeConfig.accentBg" />
        <span>{{ stripMarkdown(line) }}</span>
      </div>
      <p
        v-else-if="getLineType(line) === 'bold-paragraph'"
        class="font-semibold" :class="themeConfig.text"
      >
        {{ stripMarkdown(line) }}
      </p>
      <p
        v-else
        class="text-sm leading-relaxed" :class="themeConfig.subtext"
      >
        {{ stripMarkdown(line) }}
      </p>
    </template>
  </div>
</template>
