<script setup lang="ts">
import type { TaskItem } from '~/types'

useHead({ title: 'Tasks' })

interface TasksData {
  folders: { label: string, count: number }[]
  boards: string[]
  tasks: TaskItem[]
}

const { data } = await useFetch<TasksData>('/api/tasks', {
  default: () => ({
    folders: [],
    boards: [],
    tasks: []
  })
})
</script>

<template>
  <UDashboardPanel id="tasks">
    <template #header>
      <UDashboardNavbar title="Tasks">
        <template #leading>
          <UDashboardSidebarCollapse />
        </template>
        <template #right>
          <div class="flex items-center gap-2">
            <UButton
              color="primary"
              variant="soft"
              icon="i-lucide-calendar-check-2"
              label="Next session · Today at 9:00"
              class="rounded-full"
            />
            <UButton
              color="neutral"
              variant="ghost"
              square
              icon="i-lucide-copy"
            />
            <UButton
              color="neutral"
              variant="ghost"
              square
              icon="i-lucide-bell"
            />
            <UButton
              color="neutral"
              variant="ghost"
              square
              icon="i-lucide-circle-help"
            />
            <UColorModeButton />
            <UserMenu icon-only />
          </div>
        </template>
      </UDashboardNavbar>
    </template>
    <template #body>
      <div class="mt-4 grid gap-4 lg:grid-cols-[280px,1fr]">
        <UCard :ui="{ body: 'p-4' }">
          <UButton
            icon="i-lucide-circle-plus"
            color="neutral"
            variant="ghost"
            block
            class="justify-start"
            label="Add task"
          />

          <UInput icon="i-lucide-search" class="mt-3" placeholder="Search" />

          <div class="mt-4 space-y-1">
            <UButton
              v-for="folder in data.folders"
              :key="folder.label"
              color="neutral"
              :variant="folder.label === 'Inbox' ? 'soft' : 'ghost'"
              class="justify-between"
              block
            >
              <span>{{ folder.label }}</span>
              <UBadge color="neutral" variant="soft">
                {{ folder.count }}
              </UBadge>
            </UButton>
          </div>

          <p class="mt-6 text-xs font-semibold uppercase tracking-wide text-muted">
            Task boards
          </p>
          <div class="mt-2 space-y-1">
            <UButton
              v-for="board in data.boards"
              :key="board"
              color="neutral"
              variant="ghost"
              class="justify-start"
              block
            >
              {{ board }}
            </UButton>
          </div>
        </UCard>

        <UCard :ui="{ body: 'p-0' }">
          <div class="border-b border-default px-6 py-4">
            <h2 class="text-xl font-semibold text-highlighted">
              Inbox
            </h2>
          </div>
          <ul class="divide-y divide-default">
            <li v-for="task in data.tasks" :key="task.id" class="px-6 py-4">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <p class="font-medium text-highlighted">
                    {{ task.title }}
                  </p>
                  <p class="mt-1 text-sm text-muted">
                    {{ task.description }}
                  </p>
                  <p class="mt-2 text-xs text-muted">
                    {{ task.assignee }}<span v-if="task.dueDate"> · {{ task.dueDate }}</span>
                  </p>
                </div>
                <div class="flex items-center gap-1">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-pencil"
                    square
                  />
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-square-pen"
                    square
                  />
                  <UButton
                    color="neutral"
                    variant="ghost"
                    icon="i-lucide-folder-open"
                    square
                  />
                </div>
              </div>
            </li>
          </ul>
          <div class="px-6 py-4">
            <UButton color="neutral" variant="ghost" icon="i-lucide-circle-plus">
              Add task
            </UButton>
          </div>
        </UCard>
      </div>
    </template>
  </UDashboardPanel>
</template>
