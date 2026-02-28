<script setup lang="ts">
const emit = defineEmits<{
  openAddModal: []
}>()

const { supporters, nudgeSignals, sendNudge, isNudgePending, removeSupporter } = useSocial()

const openPopover = ref<string | null>(null)
const justSent = ref<string | null>(null)

const COLOR_MAP: Record<string, { bg: string; border: string; text: string; ring: string }> = {
  rose: { bg: 'bg-rose-100', border: 'border-rose-200', text: 'text-rose-500', ring: 'ring-rose-300' },
  blue: { bg: 'bg-blue-100', border: 'border-blue-200', text: 'text-blue-500', ring: 'ring-blue-300' },
  violet: { bg: 'bg-violet-100', border: 'border-violet-200', text: 'text-violet-500', ring: 'ring-violet-300' },
  amber: { bg: 'bg-amber-100', border: 'border-amber-200', text: 'text-amber-500', ring: 'ring-amber-300' },
  teal: { bg: 'bg-teal-100', border: 'border-teal-200', text: 'text-teal-500', ring: 'ring-teal-300' }
}

function getColors(color: string) {
  return COLOR_MAP[color] ?? COLOR_MAP.teal
}

function handleNudge(supporterId: string, signalId: string): void {
  sendNudge(supporterId, signalId)
  openPopover.value = null
  justSent.value = supporterId
  setTimeout(() => { justSent.value = null }, 2500)
}

function togglePopover(supporterId: string): void {
  openPopover.value = openPopover.value === supporterId ? null : supporterId
}

function handleRemove(id: string): void {
  removeSupporter(id)
  openPopover.value = null
}
</script>

<template>
  <div>
    <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      <!-- Supporter cards -->
      <div
        v-for="s in supporters"
        :key="s.id"
        class="relative shrink-0 w-44"
      >
        <div
          class="relative bg-white rounded-2xl border p-4 text-center transition-all hover:shadow-md"
          :class="[
            getColors(s.color).border,
            justSent === s.id ? 'ring-2 ' + getColors(s.color).ring : '',
            isNudgePending(s.id) ? 'animate-pulse-soft' : ''
          ]"
        >
          <!-- Remove button (custom only) -->
          <button
            v-if="!s.isDefault"
            class="absolute top-2 right-2 w-5 h-5 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-colors"
            @click="handleRemove(s.id)"
          >
            <UIcon name="i-lucide-x" class="text-[10px] text-zinc-400" />
          </button>

          <!-- Avatar -->
          <div
            class="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center transition-transform"
            :class="[getColors(s.color).bg, justSent === s.id ? 'scale-110' : '']"
          >
            <UIcon :name="s.avatar" class="text-2xl" :class="getColors(s.color).text" />
          </div>

          <!-- Name -->
          <p class="text-sm font-semibold text-zinc-800 truncate">{{ s.name }}</p>
          <div class="flex items-center justify-center gap-1 mt-0.5">
            <p class="text-[10px] text-zinc-400">{{ s.roleLabel }}</p>
            <UBadge v-if="s.isPatient" color="amber" variant="subtle" size="xs" class="text-[8px]">Patient</UBadge>
          </div>

          <!-- Nudge button / Sent state -->
          <button
            v-if="!isNudgePending(s.id) && justSent !== s.id"
            class="mt-3 w-full py-1.5 text-xs font-medium rounded-lg border transition-all hover:shadow-sm active:scale-95"
            :class="[getColors(s.color).border, getColors(s.color).text, 'hover:' + getColors(s.color).bg]"
            @click="togglePopover(s.id)"
          >
            Send Nudge
          </button>

          <div
            v-else-if="isNudgePending(s.id)"
            class="mt-3 w-full py-1.5 text-xs font-medium rounded-lg bg-zinc-100 text-zinc-400 text-center"
          >
            Sending...
          </div>

          <div
            v-else
            class="mt-3 w-full py-1.5 text-xs font-semibold rounded-lg text-emerald-600 bg-emerald-50 text-center flex items-center justify-center gap-1"
          >
            <UIcon name="i-lucide-check" class="text-sm" />
            Sent!
          </div>

          <!-- Nudge popover -->
          <Transition name="pop">
            <div
              v-if="openPopover === s.id"
              class="absolute left-0 right-0 top-full mt-2 z-30 bg-white rounded-xl border border-zinc-200 shadow-xl p-2 space-y-1"
            >
              <button
                v-for="signal in nudgeSignals"
                :key="signal.id"
                class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-zinc-50 transition-colors flex items-start gap-2"
                @click="handleNudge(s.id, signal.id)"
              >
                <span class="text-base shrink-0 mt-0.5">{{ signal.emoji }}</span>
                <span class="text-xs text-zinc-600 leading-relaxed">{{ signal.label }}</span>
              </button>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Add Person card -->
      <div class="shrink-0 w-44">
        <button
          class="w-full h-full min-h-[180px] bg-white/50 rounded-2xl border-2 border-dashed border-zinc-300 hover:border-indigo-400 hover:bg-indigo-50/30 p-4 text-center transition-all flex flex-col items-center justify-center gap-2 active:scale-95"
          @click="emit('openAddModal')"
        >
          <div class="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center">
            <UIcon name="i-lucide-plus" class="text-xl text-zinc-400" />
          </div>
          <span class="text-xs font-medium text-zinc-500">Add Person</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

@keyframes pulse-soft {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.animate-pulse-soft { animation: pulse-soft 1.5s ease-in-out infinite; }

.pop-enter-active { transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-leave-active { transition: all 0.15s ease-out; }
.pop-enter-from { opacity: 0; transform: translateY(-8px) scale(0.95); }
.pop-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
