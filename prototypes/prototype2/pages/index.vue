<script setup lang="ts">
definePageMeta({ layout: false })
</script>

<template>
  <ProtoShell title="Therapist Dashboard" :prototype-number="2">
    <ProtoHeader
      title="Therapist Dashboard"
      description="Prototype exploring enhanced therapist dashboard views."
      :prototype-number="2"
    />

    <div class="p-8">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            Welcome to Prototype 2
          </h2>
        </template>
        <p class="text-gray-600">
          This prototype focuses on therapist-facing dashboard improvements and workflow enhancements.
        </p>
      </UCard>
    </div>
  </ProtoShell>
</template>
