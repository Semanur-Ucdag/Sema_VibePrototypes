---
name: api-endpoint
description: Create Nuxt server API endpoints with Zod validation, proper error handling, and consistent response shapes. Use when creating new API routes or server endpoints.
---

# API Endpoint Creation

## Step 1: Determine Route

Place in `server/api/` following REST conventions:

| Pattern | File | Method |
|---------|------|--------|
| `GET /api/patients` | `server/api/patients.get.ts` | List all |
| `GET /api/patients/:id` | `server/api/patients/[id].get.ts` | Get one |
| `POST /api/patients` | `server/api/patients.post.ts` | Create |
| `PUT /api/patients/:id` | `server/api/patients/[id].put.ts` | Update |
| `DELETE /api/patients/:id` | `server/api/patients/[id].delete.ts` | Delete |

## Step 2: Create Endpoint

### GET (List)

```typescript
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  
  const { data, error } = await client
    .from('table_name')
    .select('*')
  
  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch records'
    })
  }
  
  return { data }
})
```

### GET (Single)

```typescript
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required'
    })
  }
  
  const client = await serverSupabaseClient(event)
  
  const { data, error } = await client
    .from('table_name')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Record not found'
    })
  }
  
  return { data }
})
```

### POST (Create with Validation)

```typescript
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  // add fields
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const result = schema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: result.error.flatten()
    })
  }
  
  const client = await serverSupabaseClient(event)
  
  const { data, error } = await client
    .from('table_name')
    .insert(result.data)
    .select()
    .single()
  
  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create record'
    })
  }
  
  return { data }
})
```

### PUT (Update with Validation)

```typescript
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  // add fields
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required'
    })
  }
  
  const body = await readBody(event)
  
  const result = schema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation failed',
      data: result.error.flatten()
    })
  }
  
  const client = await serverSupabaseClient(event)
  
  const { data, error } = await client
    .from('table_name')
    .update(result.data)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update record'
    })
  }
  
  return { data }
})
```

### DELETE

```typescript
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID is required'
    })
  }
  
  const client = await serverSupabaseClient(event)
  
  const { error } = await client
    .from('table_name')
    .delete()
    .eq('id', id)
  
  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete record'
    })
  }
  
  return { success: true }
})
```

## Error Handling

Always use `createError` with appropriate status codes:

| Code | When |
|------|------|
| 400 | Bad request, validation failed |
| 401 | Not authenticated |
| 403 | Not authorized (authenticated but no permission) |
| 404 | Resource not found |
| 500 | Server/database error |

## Checklist

- [ ] Route follows REST naming conventions
- [ ] Request body validated with Zod (POST/PUT)
- [ ] Route params validated (if using `[id]`)
- [ ] Errors use `createError` with proper status codes
- [ ] No raw error messages exposed to client
- [ ] Response shape is consistent (`{ data }` or `{ success }`)
- [ ] Using `serverSupabaseClient` for DB access
