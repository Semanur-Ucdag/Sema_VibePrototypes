<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { TableColumn } from '@nuxt/ui'
import type { CaseloadRow } from '~/types'

useHead({ title: 'Caseloads' })
const { data: rows } = await useFetch<CaseloadRow[]>('/api/caseloads', {
  default: () => []
})

const UBadge = resolveComponent('UBadge')
const UButton = resolveComponent('UButton')

const roleColor: Record<CaseloadRow['role'], 'warning' | 'success' | 'neutral'> = {
  lead: 'warning',
  primary: 'success',
  involved: 'neutral'
}

const statusColor: Record<CaseloadRow['treatmentPhase'], 'neutral' | 'warning' | 'success'> = {
  'triage': 'neutral',
  'intake': 'warning',
  'in treatment': 'success',
  'completed': 'neutral'
}

const columns: TableColumn<CaseloadRow>[] = [
  {
    accessorKey: 'name',
    header: 'Client name',
    cell: ({ row }) => h(UButton, {
      color: 'neutral',
      variant: 'ghost',
      to: `/caseloads/${row.original.id}`
    }, () => row.original.name)
  },
  { accessorKey: 'id', header: 'Client ID' },
  { accessorKey: 'phone', header: 'Phone number' },
  {
    accessorKey: 'role',
    header: 'Your role',
    cell: ({ row }) => h(UBadge, {
      variant: 'soft',
      color: roleColor[row.original.role],
      class: 'capitalize'
    }, () => row.original.role)
  },
  {
    accessorKey: 'clinicianAvatars',
    header: 'Involved clinicians',
    cell: ({ row }) => h('div', { class: 'w-[100px]' }, [
      h(resolveComponent('TherapistPatientAvatarStack'), {
        avatars: row.original.clinicianAvatars,
        max: 3
      })
    ])
  },
  { accessorKey: 'diagnosis', header: 'Diagnosis' },
  {
    accessorKey: 'treatmentPhase',
    header: 'Treatment phase',
    cell: ({ row }) => h(UBadge, {
      variant: 'soft',
      color: statusColor[row.original.treatmentPhase],
      class: 'capitalize'
    }, () => row.original.treatmentPhase)
  }
]
</script>

<template>
  <UDashboardPanel id="caseloads">
    <template #header>
      <UDashboardNavbar title="Caseloads">
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
      <div>
        <h1 class="text-2xl font-semibold text-highlighted">
          Caseloads (17)
        </h1>
        <p class="mt-1 text-sm text-muted">
          Manage your clients treatment.
        </p>
      </div>

      <div class="mt-4 flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <UInput icon="i-lucide-search" placeholder="Search" class="w-72" />
          <UButton color="neutral" variant="ghost" icon="i-lucide-list-filter">
            Filter
          </UButton>
        </div>
        <UButton color="neutral" variant="ghost" icon="i-lucide-bell-ring">
          Alerts & Tasks
        </UButton>
      </div>

      <UTable
        class="mt-4"
        :data="rows"
        :columns="columns"
        :ui="{
          base: 'table-fixed border-separate border-spacing-0',
          thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
          tbody: '[&>tr]:last:[&>td]:border-b-0',
          th: 'py-3 border-y border-default first:border-l first:rounded-l-lg last:border-r last:rounded-r-lg',
          td: 'border-b border-default py-3'
        }"
      />
      <p class="mt-2 text-xs text-muted">
        17 caseloads
      </p>
    </template>
  </UDashboardPanel>
</template>
