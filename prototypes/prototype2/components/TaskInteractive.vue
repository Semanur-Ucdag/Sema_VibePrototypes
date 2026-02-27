<script setup lang="ts">
import type { TaskData } from '../composables/useTaskBoard'

interface Props {
  task: TaskData
}

const props = defineProps<Props>()

const { themeConfig, energyLevel } = useEnergyState()
const { getTaskInteractiveData, setTaskInteractiveData } = useTaskBoard()

const data = computed(() => getTaskInteractiveData(props.task.id))
const interactive = computed(() => props.task.formats.interactive as Record<string, unknown> | undefined)
const category = computed(() => props.task.category)

const moodSelected = computed({
  get: () => data.value.mood as number | undefined,
  set: (v: number | undefined) => setTaskInteractiveData(props.task.id, 'mood', v)
})

const moodFollowUp = computed({
  get: () => (data.value.moodFollowUp as string) ?? '',
  set: (v: string) => setTaskInteractiveData(props.task.id, 'moodFollowUp', v)
})

function getJournalValue(idx: number): string {
  return (data.value[`journal_${idx}`] as string) ?? ''
}

function setJournalValue(idx: number, val: string): void {
  setTaskInteractiveData(props.task.id, `journal_${idx}`, val)
}

function getGratitudeValue(idx: number): string {
  return (data.value[`gratitude_${idx}`] as string) ?? ''
}

function setGratitudeValue(idx: number, val: string): void {
  setTaskInteractiveData(props.task.id, `gratitude_${idx}`, val)
}

function isGratitudeFlipped(idx: number): boolean {
  return (getGratitudeValue(idx) ?? '').trim().length > 0 && (data.value[`gratitude_${idx}_flipped`] as boolean) === true
}

function flipGratitude(idx: number): void {
  if (getGratitudeValue(idx).trim()) {
    setTaskInteractiveData(props.task.id, `gratitude_${idx}_flipped`, true)
  }
}

function getGroundingValue(sense: string, idx: number): string {
  return (data.value[`grounding_${sense}_${idx}`] as string) ?? ''
}

function setGroundingValue(sense: string, idx: number, val: string): void {
  setTaskInteractiveData(props.task.id, `grounding_${sense}_${idx}`, val)
}

function getBehavioralValue(key: string): string {
  return (data.value[`behavioral_${key}`] as string) ?? ''
}

function setBehavioralValue(key: string, val: string): void {
  setTaskInteractiveData(props.task.id, `behavioral_${key}`, val)
}

const moodOptions = computed(() => {
  const i = interactive.value as { options?: Array<{ emoji: string; label: string; value: number }> } | undefined
  return i?.options ?? []
})

const showFollowUp = computed(() => energyLevel.value !== 'low')
</script>

<template>
  <div>
    <!-- Mood Check-in -->
    <div v-if="category === 'mood'" class="space-y-6">
      <p class="text-center text-lg font-medium" :class="themeConfig.text">
        Right now, I feel...
      </p>
      <div class="flex justify-center gap-3">
        <button
          v-for="option in moodOptions"
          :key="option.value"
          class="flex flex-col items-center gap-1 rounded-xl px-4 py-3 transition-all"
          :class="moodSelected === option.value
            ? `${themeConfig.accentBg} text-white shadow-md`
            : `border ${themeConfig.border} ${themeConfig.cardBg} hover:shadow-sm`"
          @click="moodSelected = option.value"
        >
          <span class="text-2xl">{{ option.emoji }}</span>
          <span class="text-xs font-medium">{{ option.label }}</span>
        </button>
      </div>
      <div v-if="showFollowUp && moodSelected !== undefined" class="mx-auto max-w-md">
        <label class="mb-1 block text-sm font-medium" :class="themeConfig.subtext">
          What might be contributing to this feeling?
        </label>
        <UTextarea
          :model-value="moodFollowUp"
          placeholder="No pressure — even a few words help..."
          :rows="3"
          @update:model-value="moodFollowUp = $event"
        />
      </div>
    </div>

    <!-- Journaling -->
    <div v-else-if="category === 'journaling'" class="space-y-5">
      <div
        v-for="(prompt, idx) in (interactive as { prompts?: Array<{ label: string; placeholder: string; multiline?: boolean }> })?.prompts ?? []"
        :key="idx"
      >
        <label class="mb-1.5 block text-sm font-medium" :class="themeConfig.text">
          {{ prompt.label }}
        </label>
        <UTextarea
          v-if="prompt.multiline"
          :model-value="getJournalValue(idx)"
          :placeholder="prompt.placeholder"
          :rows="4"
          @update:model-value="setJournalValue(idx, $event)"
        />
        <UInput
          v-else
          :model-value="getJournalValue(idx)"
          :placeholder="prompt.placeholder"
          @update:model-value="setJournalValue(idx, $event)"
        />
      </div>
    </div>

    <!-- Breathing -->
    <div v-else-if="category === 'breathing'">
      <TaskAudioPlayer
        :audio-content="(task.formats.audio as { description: string })?.description ?? ''"
        category="breathing"
      />
    </div>

    <!-- Behavioral Activation -->
    <div v-else-if="category === 'behavioral'" class="space-y-5">
      <div
        v-for="field in (interactive as { fields?: Array<{ key: string; label: string; placeholder: string; multiline?: boolean }> })?.fields ?? []"
        :key="field.key"
      >
        <label class="mb-1.5 block text-sm font-medium" :class="themeConfig.text">
          {{ field.label }}
        </label>
        <UTextarea
          v-if="field.multiline"
          :model-value="getBehavioralValue(field.key)"
          :placeholder="field.placeholder"
          :rows="3"
          @update:model-value="setBehavioralValue(field.key, $event)"
        />
        <UInput
          v-else
          :model-value="getBehavioralValue(field.key)"
          :placeholder="field.placeholder"
          @update:model-value="setBehavioralValue(field.key, $event)"
        />
      </div>
    </div>

    <!-- Gratitude -->
    <div v-else-if="category === 'gratitude'" class="space-y-4">
      <p class="text-center text-lg font-medium" :class="themeConfig.text">
        Three things I'm grateful for today
      </p>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div
          v-for="idx in 3"
          :key="idx"
          class="perspective-500"
        >
          <div
            class="relative h-44 transition-transform duration-500"
            :class="isGratitudeFlipped(idx - 1) ? 'rotate-y-180' : ''"
            :style="{ transformStyle: 'preserve-3d' }"
          >
            <!-- Front -->
            <div
              class="absolute inset-0 rounded-xl border p-4 backface-hidden"
              :class="[themeConfig.cardBg, themeConfig.border]"
            >
              <div class="flex h-full flex-col">
                <span class="mb-2 text-2xl">{{ ['✨', '🌟', '💛'][idx - 1] }}</span>
                <UInput
                  :model-value="getGratitudeValue(idx - 1)"
                  :placeholder="(interactive as { placeholders?: string[] })?.placeholders?.[idx - 1] ?? 'Something you appreciate...'"
                  class="mb-2"
                  @update:model-value="setGratitudeValue(idx - 1, $event)"
                />
                <UButton
                  size="xs"
                  variant="soft"
                  color="primary"
                  class="mt-auto self-end"
                  :disabled="!getGratitudeValue(idx - 1)?.trim()"
                  @click="flipGratitude(idx - 1)"
                >
                  Save
                </UButton>
              </div>
            </div>
            <!-- Back -->
            <div
              class="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 backface-hidden"
              :style="{ transform: 'rotateY(180deg)' }"
            >
              <UIcon name="i-lucide-heart" class="size-8 text-amber-500" />
              <p class="text-center text-sm font-medium text-amber-800">
                {{ getGratitudeValue(idx - 1) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grounding 5-4-3-2-1 -->
    <div v-else-if="category === 'video-lesson' && (interactive as { type?: string })?.type === 'grounding'" class="space-y-6">
      <div
        v-for="sense in (interactive as { senses?: Array<{ sense: string; icon: string; count: number; label: string }> })?.senses ?? []"
        :key="sense.sense"
      >
        <div class="mb-2 flex items-center gap-2">
          <span class="text-xl">{{ sense.icon }}</span>
          <span class="font-semibold" :class="themeConfig.text">
            {{ sense.count }} — {{ sense.label }}
          </span>
        </div>
        <div class="grid gap-2" :class="sense.count > 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'">
          <UInput
            v-for="i in sense.count"
            :key="i"
            :model-value="getGroundingValue(sense.sense, i - 1)"
            :placeholder="`${sense.label.replace('Things you can ', '').replace('Thing you can ', '')} #${i}`"
            @update:model-value="setGroundingValue(sense.sense, i - 1, $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective-500 {
  perspective: 500px;
}
.rotate-y-180 {
  transform: rotateY(180deg);
}
.backface-hidden {
  backface-visibility: hidden;
}
</style>
