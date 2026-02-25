<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent, AuthFormField } from '@nuxt/ui'

definePageMeta({
  layout: 'auth'
})

useHead({ title: 'Sign in' })

const toast = useToast()
const { refreshProfile } = useCurrentUser()

const fields: AuthFormField[] = [
  {
    name: 'email',
    type: 'email',
    label: 'Email',
    placeholder: 'Enter your email',
    required: true
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true
  }
]

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be at least 8 characters')
})

type Schema = z.output<typeof schema>

const loading = ref(false)

async function onSubmit(payload: FormSubmitEvent<Schema>) {
  loading.value = true

  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: payload.data.email,
        password: payload.data.password
      }
    })
    await refreshProfile()

    toast.add({
      title: 'Welkom terug!',
      description: 'Je bent succesvol ingelogd.',
      color: 'success'
    })

    // Navigate to dashboard after successful login
    await navigateTo('/')
  } catch (error: unknown) {
    const description = error instanceof Error
      ? error.message
      : 'Invalid credentials. Please try again.'

    toast.add({
      title: 'Sign in failed',
      description,
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <UPageCard class="w-full max-w-md">
    <UAuthForm
      :schema="schema"
      :fields="fields"
      :loading="loading"
      title="Welcome back"
      description="Enter your credentials to access your account."
      icon="i-lucide-lock"
      :submit="{ label: 'Sign in', block: true }"
      @submit="onSubmit"
    >
      <template #password-hint>
        <ULink to="#" class="text-primary font-medium text-sm" tabindex="-1">
          Forgot password?
        </ULink>
      </template>

      <template #footer>
        <span class="text-muted">Don't have an account?</span>
        <ULink to="#" class="text-primary font-medium ml-1">
          Sign up
        </ULink>
      </template>
    </UAuthForm>
  </UPageCard>
</template>
