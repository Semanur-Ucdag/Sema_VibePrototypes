<script setup lang="ts">
const { incomingMessages, markAsRead, unreadCount, getSupporterColor, getRelativeTime } = useSocial()

const visibleCount = ref(0)

onMounted(() => {
  const total = incomingMessages.value.length
  for (let i = 0; i < total; i++) {
    setTimeout(() => {
      visibleCount.value = i + 1
    }, i * 400)
  }
})

watch(() => incomingMessages.value.length, (newLen, oldLen) => {
  if (newLen > oldLen) {
    visibleCount.value = newLen
  }
})

const COLOR_MAP: Record<string, string> = {
  rose: 'shadow-rose-200/40 border-rose-100',
  blue: 'shadow-blue-200/40 border-blue-100',
  violet: 'shadow-violet-200/40 border-violet-100',
  amber: 'shadow-amber-200/40 border-amber-100',
  teal: 'shadow-teal-200/40 border-teal-100'
}

const AVATAR_BG: Record<string, string> = {
  rose: 'bg-rose-100 text-rose-500',
  blue: 'bg-blue-100 text-blue-500',
  violet: 'bg-violet-100 text-violet-500',
  amber: 'bg-amber-100 text-amber-500',
  teal: 'bg-teal-100 text-teal-500'
}

function getGlowClass(color: string): string {
  return COLOR_MAP[color] ?? 'shadow-zinc-200/40 border-zinc-100'
}

function getAvatarClass(color: string): string {
  return AVATAR_BG[color] ?? 'bg-zinc-100 text-zinc-500'
}
</script>

<template>
  <div class="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-zinc-700 flex items-center gap-2">
        <UIcon name="i-lucide-inbox" class="text-amber-500" />
        Incoming Kindness
      </h3>
      <UBadge v-if="unreadCount > 0" color="indigo" variant="subtle" size="xs">
        {{ unreadCount }} new
      </UBadge>
    </div>

    <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1">
      <TransitionGroup name="feed">
        <div
          v-for="(msg, i) in incomingMessages.slice(0, visibleCount)"
          :key="msg.id"
          class="relative p-3.5 rounded-xl border shadow-md transition-all cursor-pointer"
          :class="[
            getGlowClass(getSupporterColor(msg.fromId)),
            msg.isNew ? 'ring-2 ring-indigo-300' : '',
            !msg.isRead ? 'bg-indigo-50/30' : 'bg-white'
          ]"
          @click="markAsRead(msg.id)"
        >
          <!-- New badge -->
          <span
            v-if="msg.isNew"
            class="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 text-[8px] font-bold text-white bg-indigo-500 rounded-full"
          >
            NEW
          </span>

          <!-- Unread dot -->
          <div
            v-if="!msg.isRead && !msg.isNew"
            class="absolute top-3 right-3 w-2 h-2 rounded-full bg-indigo-500"
          />

          <!-- Header -->
          <div class="flex items-center gap-2.5 mb-2">
            <div
              class="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              :class="getAvatarClass(getSupporterColor(msg.fromId))"
            >
              <span class="text-xs font-bold">{{ msg.fromName.charAt(0) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-zinc-700 truncate">{{ msg.fromName }}</p>
              <p class="text-[10px] text-zinc-400">{{ getRelativeTime(msg.timestamp) }}</p>
            </div>
          </div>

          <!-- Content by type -->
          <div class="ml-10">
            <!-- Text -->
            <p v-if="msg.type === 'text'" class="text-sm text-zinc-600 leading-relaxed italic">
              "{{ msg.content }}"
            </p>

            <!-- Emoji -->
            <p v-else-if="msg.type === 'emoji'" class="text-3xl">
              {{ msg.content }}
            </p>

            <!-- Voice note -->
            <div v-else-if="msg.type === 'voice-note'" class="flex items-center gap-2 p-2 bg-zinc-100 rounded-lg">
              <div class="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                <UIcon name="i-lucide-play" class="text-sm text-white" />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-0.5 h-4">
                  <div v-for="j in 20" :key="j" class="w-1 rounded-full bg-indigo-300" :style="{ height: `${4 + Math.random() * 12}px` }" />
                </div>
                <p class="text-[10px] text-zinc-400 mt-0.5">{{ msg.content.match(/\[Voice note - (.*?)\]/)?.[1] ?? '0:10' }}</p>
              </div>
            </div>

            <!-- Photo -->
            <div v-else-if="msg.type === 'photo'" class="rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 p-3">
              <div class="w-full h-24 rounded-lg bg-amber-100/50 flex items-center justify-center mb-2">
                <UIcon name="i-lucide-image" class="text-3xl text-amber-300" />
              </div>
              <p class="text-xs text-zinc-500 italic">{{ msg.content.replace(/\[Photo\]\s?/, '') }}</p>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.feed-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.feed-leave-active {
  transition: all 0.3s ease-out;
}
.feed-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}
.feed-move {
  transition: transform 0.4s ease;
}
</style>
