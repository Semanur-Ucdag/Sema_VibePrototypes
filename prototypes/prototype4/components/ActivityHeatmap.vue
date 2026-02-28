<script setup lang="ts">
const { heatmapDots, getCategoryColor } = useActivities()

const hoveredDot = ref<string | null>(null)
const justUpdated = ref<string | null>(null)

const padding = { top: 40, right: 30, bottom: 50, left: 55 }
const width = 500
const height = 420
const plotW = width - padding.left - padding.right
const plotH = height - padding.top - padding.bottom

function xPos(mastery: number): number {
  return padding.left + (mastery / 10) * plotW
}

function yPos(pleasure: number): number {
  return padding.top + plotH - (pleasure / 10) * plotH
}

function dotRadius(count: number): number {
  return Math.min(8 + count * 3, 22)
}

const gridLines = computed(() => {
  const lines: Array<{ x1: number; y1: number; x2: number; y2: number }> = []
  for (let i = 0; i <= 10; i++) {
    lines.push({ x1: xPos(i), y1: padding.top, x2: xPos(i), y2: padding.top + plotH })
    lines.push({ x1: padding.left, y1: yPos(i), x2: padding.left + plotW, y2: yPos(i) })
  }
  return lines
})

const sweetSpotRect = computed(() => ({
  x: xPos(7),
  y: yPos(10),
  width: xPos(10) - xPos(7),
  height: yPos(7) - yPos(10)
}))

const categoryLegend = [
  { label: 'Physical', color: '#3b82f6' },
  { label: 'Creative', color: '#a855f7' },
  { label: 'Social', color: '#f59e0b' },
  { label: 'Self-Care', color: '#14b8a6' }
]

function formatDate(d: Date): string {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function onDotEnter(id: string): void {
  hoveredDot.value = id
}

function onDotLeave(): void {
  hoveredDot.value = null
}

watch(heatmapDots, (newDots, oldDots) => {
  if (newDots.length > 0 && oldDots) {
    const newIds = new Set(newDots.map(d => d.activityId))
    const oldCounts = new Map(oldDots.map(d => [d.activityId, d.count]))
    newDots.forEach(d => {
      const oldCount = oldCounts.get(d.activityId)
      if (oldCount === undefined || d.count > oldCount) {
        justUpdated.value = d.activityId
        setTimeout(() => { justUpdated.value = null }, 1500)
      }
    })
  }
}, { deep: true })
</script>

<template>
  <div class="bg-white rounded-2xl border border-zinc-200 p-4 shadow-sm">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-semibold text-zinc-700 flex items-center gap-2">
        <UIcon name="i-lucide-scatter-chart" class="text-zinc-400" />
        Activity Heatmap
      </h3>
      <div class="flex items-center gap-3">
        <div v-for="cat in categoryLegend" :key="cat.label" class="flex items-center gap-1">
          <div class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: cat.color }" />
          <span class="text-[10px] text-zinc-400">{{ cat.label }}</span>
        </div>
      </div>
    </div>

    <svg :viewBox="`0 0 ${width} ${height}`" class="w-full" style="max-height: 420px;">
      <!-- Sweet Spot zone -->
      <rect
        :x="sweetSpotRect.x"
        :y="sweetSpotRect.y"
        :width="sweetSpotRect.width"
        :height="sweetSpotRect.height"
        rx="8"
        fill="url(#sweetSpotGradient)"
        opacity="0.4"
      />
      <defs>
        <radialGradient id="sweetSpotGradient">
          <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.3" />
          <stop offset="100%" stop-color="#10b981" stop-opacity="0.08" />
        </radialGradient>
      </defs>

      <!-- Sweet Spot label -->
      <text
        :x="sweetSpotRect.x + sweetSpotRect.width / 2"
        :y="sweetSpotRect.y + 16"
        text-anchor="middle"
        class="fill-amber-500/60 text-[10px] font-medium"
      >
        Sweet Spot ✨
      </text>

      <!-- Grid lines -->
      <line
        v-for="(line, i) in gridLines"
        :key="i"
        :x1="line.x1" :y1="line.y1"
        :x2="line.x2" :y2="line.y2"
        stroke="#e4e4e7"
        stroke-width="0.5"
        stroke-dasharray="3,3"
      />

      <!-- Axis labels - X (Mastery) -->
      <text
        v-for="i in 11"
        :key="`xl-${i}`"
        :x="xPos(i - 1)"
        :y="padding.top + plotH + 18"
        text-anchor="middle"
        class="fill-zinc-400 text-[10px]"
      >
        {{ i - 1 }}
      </text>
      <text
        :x="padding.left + plotW / 2"
        :y="height - 5"
        text-anchor="middle"
        class="fill-zinc-500 text-[11px] font-medium"
      >
        Achievement →
      </text>

      <!-- Axis labels - Y (Pleasure) -->
      <text
        v-for="i in 11"
        :key="`yl-${i}`"
        :x="padding.left - 10"
        :y="yPos(i - 1) + 4"
        text-anchor="end"
        class="fill-zinc-400 text-[10px]"
      >
        {{ i - 1 }}
      </text>
      <text
        :x="12"
        :y="padding.top + plotH / 2"
        text-anchor="middle"
        class="fill-zinc-500 text-[11px] font-medium"
        :transform="`rotate(-90, 12, ${padding.top + plotH / 2})`"
      >
        Enjoyment →
      </text>

      <!-- Activity dots -->
      <g v-for="dot in heatmapDots" :key="dot.activityId">
        <!-- Pulse ring for just-updated -->
        <circle
          v-if="justUpdated === dot.activityId"
          :cx="xPos(dot.avgMastery)"
          :cy="yPos(dot.avgPleasure)"
          :r="dotRadius(dot.count) + 8"
          :fill="dot.color"
          opacity="0.2"
          class="animate-ping-dot"
        />

        <!-- Main dot -->
        <circle
          :cx="xPos(dot.avgMastery)"
          :cy="yPos(dot.avgPleasure)"
          :r="hoveredDot === dot.activityId ? dotRadius(dot.count) + 3 : dotRadius(dot.count)"
          :fill="dot.color"
          :opacity="hoveredDot === dot.activityId ? 1 : 0.75"
          class="cursor-pointer transition-all duration-200"
          :stroke="hoveredDot === dot.activityId ? dot.color : 'white'"
          :stroke-width="hoveredDot === dot.activityId ? 3 : 2"
          @mouseenter="onDotEnter(dot.activityId)"
          @mouseleave="onDotLeave()"
        />

        <!-- Dot label (always visible for larger dots) -->
        <text
          v-if="dot.count >= 2 || hoveredDot === dot.activityId"
          :x="xPos(dot.avgMastery)"
          :y="yPos(dot.avgPleasure) - dotRadius(dot.count) - 6"
          text-anchor="middle"
          class="fill-zinc-600 text-[9px] font-medium pointer-events-none"
        >
          {{ dot.activityName }}
        </text>
      </g>

      <!-- Hover tooltip -->
      <g v-if="hoveredDot">
        <foreignObject
          v-for="dot in heatmapDots.filter(d => d.activityId === hoveredDot)"
          :key="`tip-${dot.activityId}`"
          :x="Math.min(xPos(dot.avgMastery) + dotRadius(dot.count) + 8, width - 160)"
          :y="Math.max(yPos(dot.avgPleasure) - 45, 5)"
          width="150"
          height="90"
        >
          <div class="bg-zinc-800 text-white rounded-lg px-3 py-2 text-[10px] shadow-xl">
            <p class="font-semibold text-xs mb-1">{{ dot.activityName }}</p>
            <p>Pleasure: <span class="text-emerald-300 font-medium">{{ dot.avgPleasure }}</span></p>
            <p>Mastery: <span class="text-blue-300 font-medium">{{ dot.avgMastery }}</span></p>
            <p class="text-zinc-400">Logged {{ dot.count }}x · {{ formatDate(dot.lastLogged) }}</p>
          </div>
        </foreignObject>
      </g>
    </svg>
  </div>
</template>

<style scoped>
@keyframes ping-dot {
  0% { r: inherit; opacity: 0.3; }
  100% { r: 30; opacity: 0; }
}

.animate-ping-dot {
  animation: ping-dot 1.2s ease-out infinite;
}
</style>
