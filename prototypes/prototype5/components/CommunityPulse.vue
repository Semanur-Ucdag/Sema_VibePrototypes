<script setup lang="ts">
const { communityPulse } = useSocial()

const displayCounts = ref<number[]>(communityPulse.value.map(() => 0))
const mounted = ref(false)

onMounted(() => {
  mounted.value = true
  communityPulse.value.forEach((stat, i) => {
    const duration = 1500
    const steps = 30
    const increment = stat.count / steps
    let current = 0
    const interval = setInterval(() => {
      current += increment
      if (current >= stat.count) {
        displayCounts.value[i] = stat.count
        clearInterval(interval)
      } else {
        displayCounts.value[i] = Math.floor(current)
      }
    }, duration / steps)
  })
})
</script>

<template>
  <div class="bg-gradient-to-br from-indigo-50 to-slate-50 rounded-2xl border border-indigo-200/50 p-5 shadow-sm">
    <div class="flex items-center gap-2 mb-4">
      <div class="relative">
        <div class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
          <UIcon name="i-lucide-globe" class="text-lg text-indigo-500" />
        </div>
        <div class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping-slow" />
        <div class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400" />
      </div>
      <div>
        <h3 class="text-sm font-semibold text-indigo-800">You're Not Alone</h3>
        <p class="text-[10px] text-indigo-400">Community activity today</p>
      </div>
    </div>

    <div class="space-y-3">
      <div
        v-for="(stat, i) in communityPulse"
        :key="stat.label"
        class="flex items-center gap-3 p-2.5 bg-white/60 backdrop-blur-sm rounded-xl transition-all"
        :class="mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'"
        :style="{ transitionDelay: `${i * 150}ms`, transitionDuration: '500ms' }"
      >
        <div class="w-8 h-8 rounded-lg bg-indigo-100/80 flex items-center justify-center shrink-0">
          <UIcon :name="stat.icon" class="text-base text-indigo-500" />
        </div>
        <p class="text-xs text-zinc-600 leading-relaxed">
          <span class="font-bold text-indigo-700 text-sm">{{ displayCounts[i] }}</span>
          {{ stat.label }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes ping-slow {
  0% { transform: scale(1); opacity: 0.6; }
  75%, 100% { transform: scale(2); opacity: 0; }
}
.animate-ping-slow { animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
</style>
