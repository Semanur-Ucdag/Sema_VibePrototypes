<script setup lang="ts">
interface Props {
  open: boolean
}

defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const { addSupporter } = useSocial()

const name = ref('')
const role = ref('friend')

const roleOptions = [
  { value: 'family', label: 'Family Member' },
  { value: 'friend', label: 'Friend' },
  { value: 'patient', label: 'Fellow Patient' },
  { value: 'other', label: 'Other Supporter' }
]

function handleAdd(): void {
  if (!name.value.trim()) return
  addSupporter(name.value.trim(), role.value)
  name.value = ''
  role.value = 'friend'
  emit('close')
}

function handleOverlayClick(e: MouseEvent): void {
  if ((e.target as HTMLElement).dataset.overlay) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        data-overlay="true"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click="handleOverlayClick"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" data-overlay="true" />

        <div class="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div class="flex items-center justify-between px-6 pt-5 pb-3 border-b border-zinc-100">
            <h3 class="font-semibold text-zinc-800 flex items-center gap-2">
              <UIcon name="i-lucide-user-plus" class="text-indigo-500" />
              Add to Circle
            </h3>
            <button
              class="w-8 h-8 rounded-lg hover:bg-zinc-100 flex items-center justify-center transition-colors"
              @click="emit('close')"
            >
              <UIcon name="i-lucide-x" class="text-lg text-zinc-400" />
            </button>
          </div>

          <div class="px-6 py-5 space-y-5">
            <div>
              <label class="text-sm font-medium text-zinc-600 mb-1.5 block">Name</label>
              <input
                v-model="name"
                type="text"
                placeholder="Enter their name"
                class="w-full px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
              />
            </div>

            <div>
              <label class="text-sm font-medium text-zinc-600 mb-1.5 block">Role</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="opt in roleOptions"
                  :key="opt.value"
                  class="px-3 py-2 rounded-xl border text-xs font-medium transition-all"
                  :class="role === opt.value
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                    : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300'"
                  @click="role = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 px-6 pb-5 pt-2 border-t border-zinc-100">
            <button
              class="px-4 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors"
              @click="emit('close')"
            >
              Cancel
            </button>
            <button
              class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
              :disabled="!name.trim()"
              @click="handleAdd"
            >
              <UIcon name="i-lucide-plus" class="text-base" />
              Add to Circle
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-leave-active { transition: all 0.2s ease-out; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
