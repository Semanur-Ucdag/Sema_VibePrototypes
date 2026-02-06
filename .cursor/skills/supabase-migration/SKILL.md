---
name: supabase-migration
description: Create Supabase database migrations with proper timestamps, table structure, and RLS policies. Use when creating new tables, altering schemas, or adding database constraints.
---

# Supabase Migration

## Step 1: Generate Timestamp

Run this command to get the migration timestamp:

```powershell
Get-Date -Format "yyyyMMddHHmmss"
```

## Step 2: Create Migration File

Create file at: `supabase/migrations/{timestamp}_{description}.sql`

Use snake_case for description (e.g., `create_appointments_table`, `add_status_to_patients`)

## Step 3: Write Migration

Use this template:

```sql
-- {description}

create table {table_name} (
  id uuid primary key default gen_random_uuid(),
  -- columns here
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Enable RLS
alter table {table_name} enable row level security;

-- RLS Policies
create policy "{table_name}_select_policy"
  on {table_name}
  for select
  to authenticated
  using (true);  -- adjust condition

create policy "{table_name}_insert_policy"
  on {table_name}
  for insert
  to authenticated
  with check (true);  -- adjust condition

create policy "{table_name}_update_policy"
  on {table_name}
  for update
  to authenticated
  using (true)  -- adjust condition
  with check (true);

create policy "{table_name}_delete_policy"
  on {table_name}
  for delete
  to authenticated
  using (true);  -- adjust condition

-- Updated_at trigger
create trigger set_{table_name}_updated_at
  before update on {table_name}
  for each row
  execute function moddatetime(updated_at);
```

## SQL Standards

- Lowercase keywords: `create table`, not `CREATE TABLE`
- snake_case names: `patient_appointments`, not `patientAppointments`
- Always include: `id`, `created_at`, `updated_at`
- Foreign keys: `{referenced_table}_id` (e.g., `patient_id`)

## Common Column Types

| Type | Use For |
|------|---------|
| `uuid` | Primary keys, foreign keys |
| `text` | Strings (no length limit in Postgres) |
| `varchar(n)` | Strings with max length |
| `integer` | Whole numbers |
| `numeric(p,s)` | Money, precise decimals |
| `boolean` | True/false |
| `timestamptz` | Dates with timezone |
| `date` | Date only |
| `jsonb` | Structured JSON data |

## Checklist

- [ ] Timestamp prefix is current time (not copied from old migration)
- [ ] Table has `id`, `created_at`, `updated_at`
- [ ] RLS is enabled
- [ ] RLS policies defined for select/insert/update/delete
- [ ] Foreign keys have proper `on delete` behavior
- [ ] `updated_at` trigger is created
- [ ] No seed data in migration (put in `seed.sql`)
