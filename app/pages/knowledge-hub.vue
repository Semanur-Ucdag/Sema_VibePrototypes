<script setup lang="ts">
import type { KnowledgeCategory } from '~/types'

useHead({ title: 'Knowledge Hub' })

const query = ref<string>('')

interface KnowledgeHubData {
  categories: KnowledgeCategory[]
  references: string[]
  suggestedTags: string[]
}

const { data } = await useFetch<KnowledgeHubData>('/api/knowledge-hub', {
  default: () => ({
    categories: [],
    references: [],
    suggestedTags: []
  })
})

const showAnswer = computed<boolean>(() => query.value.trim().length > 0)
</script>

<template>
  <UDashboardPanel id="knowledge-hub">
    <template #header>
      <UDashboardNavbar title="Knowledge Hub">
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
          Knowledge base
        </h1>
        <p class="mt-1 text-sm text-muted">
          Your central starting point for all knowledge resources.
        </p>
      </div>

      <div class="mt-4 mx-auto w-full max-w-5xl">
        <UInput
          v-model="query"
          icon="i-lucide-search"
          placeholder="Search in the knowledge base"
          size="lg"
          :ui="{ trailing: 'pe-2' }"
        >
          <template #trailing>
            <UButton
              v-if="showAnswer"
              icon="i-lucide-x"
              color="neutral"
              variant="ghost"
              square
              @click="query = ''"
            />
          </template>
        </UInput>
      </div>

      <div v-if="!showAnswer" class="mt-6 space-y-8">
        <div class="grid gap-3 md:grid-cols-3 xl:grid-cols-5">
          <UCard
            v-for="category in data.categories"
            :key="category.title"
            variant="subtle"
            :ui="{ body: 'p-4' }"
            class="text-center"
          >
            <UIcon :name="category.icon" class="size-7 text-muted" />
            <p class="mt-3 text-sm font-medium text-highlighted">
              {{ category.title }}
            </p>
          </UCard>
        </div>

        <section>
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-highlighted">
              Recently viewed
            </h2>
            <UButton color="neutral" variant="ghost">
              View all
            </UButton>
          </div>
          <div class="grid gap-3 md:grid-cols-3">
            <UCard
              v-for="index in 3"
              :key="index"
              variant="subtle"
              :ui="{ body: 'p-4' }"
            >
              <p class="text-xs text-muted">
                Jan 26, 2026
              </p>
              <USkeleton class="mt-3 h-3.5 w-full" />
              <USkeleton class="mt-2 h-3.5 w-10/12" />
              <USkeleton class="mt-2 h-3.5 w-8/12" />
            </UCard>
          </div>
        </section>

        <section>
          <div class="mb-3 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-highlighted">
              Recently changed
            </h2>
            <UButton color="neutral" variant="ghost">
              View all
            </UButton>
          </div>
          <div class="grid gap-3 md:grid-cols-2">
            <UCard variant="subtle" :ui="{ body: 'p-4' }">
              <p class="font-medium text-highlighted">
                January 2025
              </p>
            </UCard>
            <UCard variant="subtle" :ui="{ body: 'p-4' }">
              <p class="font-medium text-highlighted">
                December 2024
              </p>
            </UCard>
          </div>
        </section>
      </div>

      <UCard v-else class="mt-6" :ui="{ body: 'p-6' }">
        <p class="text-sm text-muted">
          Popular topics:
        </p>
        <div class="mt-2 flex flex-wrap gap-2">
          <UBadge
            v-for="tag in data.suggestedTags"
            :key="tag"
            color="neutral"
            variant="soft"
          >
            {{ tag }}
          </UBadge>
        </div>

        <h2 class="mt-6 text-base font-semibold text-highlighted">
          Here's what I found based on your request...
        </h2>
        <p class="mt-3 text-sm leading-6 text-muted">
          Recent guidelines emphasize that trauma-focused psychotherapies such as Prolonged Exposure
          (PE), Cognitive Processing Therapy (CPT), and Eye Movement Desensitization and Reprocessing
          (EMDR) are first-line treatments for PTSD. Guidance from 2023 onwards, such as the VA/DoD
          Clinical Practice Guideline, recommends these therapies over medication and states there is
          no evidence to support combining focused PTSD psychotherapy with other psychotherapies for
          medication. For co-occurring substance use disorders, evidence-based treatments should be
          available, and one should not preclude treatment for PTSD.
        </p>

        <h3 class="mt-5 text-sm font-semibold text-highlighted">
          Key updates in treatment protocols:
        </h3>
        <ul class="mt-2 list-disc ps-6 text-sm text-muted space-y-1">
          <li>Trauma-focused therapies prioritized as first-line options.</li>
          <li>Limited evidence for combining psychotherapy and medication.</li>
          <li>Co-occurring SUD treatment should not delay PTSD therapy.</li>
          <li>2023 VA/DoD guideline remains a key reference.</li>
        </ul>

        <h3 class="mt-5 text-sm font-semibold text-highlighted">
          References for this response:
        </h3>
        <div class="mt-2 space-y-2">
          <p v-for="reference in data.references" :key="reference" class="text-sm underline underline-offset-2">
            {{ reference }}
          </p>
        </div>

        <UAlert
          class="mt-5"
          color="warning"
          variant="soft"
          title="Note: This summary was generated by AI and may contain inaccuracies."
          description="Please verify information using official treatment guidelines and clinical judgement."
        />
      </UCard>
    </template>
  </UDashboardPanel>
</template>
