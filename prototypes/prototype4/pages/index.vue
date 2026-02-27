<script setup lang="ts">
definePageMeta({ layout: false })
</script>

<template>
  <ProtoShell title="Patient Insights" :prototype-number="4">
    <ProtoHeader
      title="Patient Insights"
      description="Prototype for patient progress tracking and insights visualization."
      :prototype-number="4"
    />

    <div class="p-8">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            Welcome to Prototype 4
          </h2>
        </template>
        <p class="text-gray-600">
          This prototype focuses on visualizing patient progress, questionnaire results, and treatment insights.
        </p>
      </UCard>
    </div>
  </ProtoShell>
</template>
