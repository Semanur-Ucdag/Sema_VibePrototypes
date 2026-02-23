<script setup lang="ts">
import type { ChatMessage, ChatThread } from '~/types'

useHead({ title: 'Chats' })

interface ChatsData {
  threads: ChatThread[]
  messages: ChatMessage[]
}

type ChatRole = 'user' | 'assistant'
type ChatStatus = 'submitted' | 'streaming' | 'ready' | 'error'

interface UIMessagePart {
  type: 'text'
  text: string
}

interface UIMessage {
  id: string
  role: ChatRole
  parts: UIMessagePart[]
  createdAt: string
}

const { data } = await useFetch<ChatsData>('/api/chats', {
  default: () => ({
    threads: [],
    messages: []
  })
})

const selectedThreadId = ref<number>(1)
const selectedThread = computed<ChatThread | undefined>(() => data.value.threads.find(thread => thread.id === selectedThreadId.value))
const messages = computed<ChatMessage[]>(() => data.value.messages.filter(message => message.threadId === selectedThreadId.value))
const prompt = ref<string>('')
const status = ref<ChatStatus>('ready')
const therapistAvatarSrc = 'https://i.pravatar.cc/120?img=28'
const patientAvatarSrc = 'https://randomuser.me/api/portraits/women/44.jpg'

const chatMessages = computed<UIMessage[]>(() => messages.value.map(message => ({
  id: `${message.threadId}-${message.id}`,
  role: message.sender === 'therapist' ? 'user' : 'assistant',
  parts: [{ type: 'text', text: message.text }],
  createdAt: message.createdAt
})))

function onSubmit(event: Event): void {
  event.preventDefault()

  const text = prompt.value.trim()
  if (!text) {
    return
  }

  status.value = 'submitted'

  const nextId = data.value.messages.length ? Math.max(...data.value.messages.map(message => message.id)) + 1 : 1
  const now = new Date()
  const createdAt = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  data.value.messages.push({
    id: nextId,
    threadId: selectedThreadId.value,
    sender: 'therapist',
    text,
    createdAt
  })

  const thread = data.value.threads.find(item => item.id === selectedThreadId.value)
  if (thread) {
    thread.preview = text
    thread.updatedAt = createdAt
  }

  prompt.value = ''
  status.value = 'ready'
}
</script>

<template>
  <UDashboardPanel
    id="chats"
    class="relative min-h-0"
    :ui="{ body: 'p-0 sm:p-0 overscroll-none' }"
  >
    <template #header>
      <UDashboardNavbar title="Chats">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="grid h-full min-h-0 gap-4 p-4 lg:grid-cols-[320px,1fr]">
        <UCard :ui="{ body: 'p-3 h-full' }">
          <UInput icon="i-lucide-search" placeholder="Search by name" />
          <UTabs
            :items="[{ label: 'Active', value: 'active' }, { label: 'Archived', value: 'archived' }]"
            value="active"
            :content="false"
            class="mt-3"
          />
          <div class="mt-3 space-y-1">
            <button
              v-for="thread in data.threads"
              :key="thread.id"
              type="button"
              class="w-full rounded-lg px-3 py-2 text-left transition"
              :class="selectedThreadId === thread.id ? 'bg-elevated' : 'hover:bg-elevated/50'"
              @click="selectedThreadId = thread.id"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0">
                  <p class="text-sm font-semibold text-highlighted">
                    {{ thread.patientName }}
                  </p>
                  <p class="truncate text-xs text-muted">
                    {{ thread.preview }}
                  </p>
                </div>
                <p class="text-xs text-muted">
                  {{ thread.updatedAt }}
                </p>
              </div>
            </button>
          </div>
        </UCard>

        <UCard class="min-h-0" :ui="{ body: 'p-0 h-full flex flex-col min-h-0' }">
          <div class="border-b border-default px-5 py-4">
            <p class="text-lg font-semibold text-highlighted">
              {{ selectedThread?.patientName }}
            </p>
          </div>
          <div class="flex-1 min-h-0 px-5 py-4">
            <UChatMessages
              class="pb-4 sm:pb-6"
              :messages="chatMessages"
              :status="status"
              should-auto-scroll
              :spacing-offset="128"
              :user="{ avatar: { src: therapistAvatarSrc, alt: 'Therapist' }, side: 'right', variant: 'soft' }"
              :assistant="{ avatar: { src: patientAvatarSrc, alt: selectedThread?.patientName ?? 'Patient' }, side: 'left', variant: 'naked' }"
            >
              <template #content="{ message }">
                <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
                  <p v-if="part.type === 'text'" class="whitespace-pre-wrap">
                    {{ part.text }}
                  </p>
                </template>
                <p class="mt-1 text-[11px] text-muted">
                  {{ message.createdAt }}
                </p>
              </template>
            </UChatMessages>
          </div>
          <div class="sticky bottom-0 z-10 bg-default/95 p-3 backdrop-blur">
            <UChatPrompt
              v-model="prompt"
              placeholder="Type a message..."
              :disabled="!selectedThread"
              variant="subtle"
              :ui="{ base: 'px-1.5' }"
              @submit="onSubmit"
            >
              <template #footer>
                <div />
                <UChatPromptSubmit
                  :status="status"
                  color="neutral"
                  size="sm"
                />
              </template>
            </UChatPrompt>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
