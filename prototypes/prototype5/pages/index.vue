<script setup lang="ts">
definePageMeta({ layout: false })
</script>

<template>
  <ProtoShell title="Chat & Communication" :prototype-number="5">
    <ProtoHeader
      title="Chat & Communication"
      description="Prototype for therapist-patient communication tools."
      :prototype-number="5"
    />

    <div class="p-8">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            Welcome to Prototype 5
          </h2>
        </template>
        <p class="text-gray-600">
          This prototype explores chat interfaces and communication workflows between therapists and patients.
        </p>
      </UCard>
    </div>
  </ProtoShell>
</template>
