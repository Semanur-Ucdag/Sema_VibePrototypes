<script setup lang="ts">
definePageMeta({ layout: false })
</script>

<template>
  <ProtoShell title="Knowledge Hub" :prototype-number="6">
    <ProtoHeader
      title="Knowledge Hub"
      description="Prototype for the mental health knowledge base and resources."
      :prototype-number="6"
    />

    <div class="p-8">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            Welcome to Prototype 6
          </h2>
        </template>
        <p class="text-gray-600">
          This prototype focuses on the knowledge hub, resource library, and educational content for mental health.
        </p>
      </UCard>
    </div>
  </ProtoShell>
</template>
