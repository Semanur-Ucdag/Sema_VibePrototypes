<script setup lang="ts">
import type { InsightMetric } from '~/types'

useHead({ title: 'Insights' })

const { data: metrics } = await useFetch<InsightMetric[]>('/api/insights', {
  default: () => []
})
</script>

<template>
  <UDashboardPanel id="insights">
    <template #header>
      <UDashboardNavbar title="Insights">
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
          Insights
        </h1>
        <p class="mt-1 text-sm text-muted">
          Overview of your clinical practice metrics
        </p>
      </div>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <USelect
            :items="[{ label: 'Last week', value: 'week' }, { label: 'Last month', value: 'month' }]"
            value="week"
            class="w-32"
          />
          <div class="flex items-center gap-2 text-sm text-muted">
            <span>Show Team Insights</span>
            <USwitch />
          </div>
        </div>
        <UButton color="neutral" variant="outline" icon="i-lucide-settings-2">
          Customize
        </UButton>
      </div>

      <div class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <InsightsMetricGaugeCard
          v-for="metric in metrics"
          :key="metric.title + metric.value"
          v-bind="metric"
        />
      </div>
    </template>
  </UDashboardPanel>
</template>
