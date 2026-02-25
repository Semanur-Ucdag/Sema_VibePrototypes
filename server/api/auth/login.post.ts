import { z } from 'zod'
import { createError, readBody } from 'h3'
import { createSession, verifyCredentials } from '~~/server/utils/auth'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsedBody = loginSchema.safeParse(body)

  if (!parsedBody.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: parsedBody.error.flatten()
    })
  }

  const user = verifyCredentials(parsedBody.data.email, parsedBody.data.password)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid email or password'
    })
  }

  createSession(event, user.id)

  return {
    data: { user }
  }
})
