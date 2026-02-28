<script setup lang="ts">
definePageMeta({ layout: false })

const showAddModal = ref(false)
</script>

<template>
  <ProtoShell title="The Social Bridge" :prototype-number="5">
    <div class="min-h-screen bg-gradient-to-br from-indigo-50/50 via-slate-50 to-zinc-100 relative">
      <!-- Decorative bg -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-indigo-100/30 blur-3xl" />
        <div class="absolute top-1/2 -right-24 w-72 h-72 rounded-full bg-amber-100/20 blur-3xl" />
        <div class="absolute -bottom-20 left-1/3 w-64 h-64 rounded-full bg-violet-100/15 blur-3xl" />
      </div>

      <ProtoHeader
        title="The Social Bridge"
        description="Stay connected with those who care"
        :prototype-number="5"
      />

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        <!-- Section 1: Support Circle -->
        <section>
          <div class="flex items-center gap-2 mb-4">
            <h2 class="text-lg font-bold text-zinc-800">Your Support Circle</h2>
            <UBadge color="indigo" variant="subtle" size="xs">Connected</UBadge>
          </div>
          <SupportCircle @open-add-modal="showAddModal = true" />
        </section>

        <!-- Section 2: Feed + Side panel -->
        <section>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left: Gratitude Feed -->
            <div class="lg:col-span-2">
              <div class="flex items-center gap-2 mb-4">
                <h2 class="text-lg font-bold text-zinc-800">Messages</h2>
                <UBadge color="amber" variant="subtle" size="xs">Feed</UBadge>
              </div>
              <GratitudeFeed />
            </div>

            <!-- Right: Community Pulse + Weekly Win -->
            <div class="space-y-6">
              <CommunityPulse />
              <WeeklyWinCard />
            </div>
          </div>
        </section>
      </div>

      <!-- Add Supporter Modal -->
      <AddSupporterModal :open="showAddModal" @close="showAddModal = false" />
    </div>
  </ProtoShell>
</template>
