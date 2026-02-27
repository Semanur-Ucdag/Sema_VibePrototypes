<script setup lang="ts">
definePageMeta({ layout: false })
</script>

<template>
  <ProtoShell title="Session Management" :prototype-number="3">
    <ProtoHeader
      title="Session Management"
      description="Prototype for session scheduling and management flows."
      :prototype-number="3"
    />

    <div class="p-8">
      <UCard>
        <template #header>
          <h2 class="text-lg font-semibold">
            Welcome to Prototype 3
          </h2>
        </template>
        <p class="text-gray-600">
          This prototype explores session scheduling, management, and tracking interfaces.
        </p>
      </UCard>
    </div>
  </ProtoShell>
</template>
