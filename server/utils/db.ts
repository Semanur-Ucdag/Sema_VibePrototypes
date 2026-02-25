import Database from 'better-sqlite3'
import { randomBytes, randomUUID, scryptSync } from 'node:crypto'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

export type UserRole = 'patient' | 'therapist' | 'admin'

export interface AuthUserRecord {
  id: string
  email: string
  fullName: string
  role: UserRole
  avatarUrl: string | null
}

interface UserRow {
  id: string
  email: string
  password_hash: string
}

interface ProfileRow {
  user_id: string
  full_name: string
  role: UserRole
  avatar_url: string | null
}

declare global {
  var __mcgDb__: Database.Database | undefined
}

function resolveDatabasePath(): string {
  const configuredPath = process.env.LOCAL_SQLITE_PATH ?? 'data/app.db'
  return resolve(process.cwd(), configuredPath)
}

function createPasswordHash(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

function ensureDatabaseDirectory(dbPath: string): void {
  const dbDirectory = dirname(dbPath)
  if (!existsSync(dbDirectory)) {
    mkdirSync(dbDirectory, { recursive: true })
  }
}

function runSchemaSetup(db: Database.Database): void {
  db.pragma('foreign_keys = ON')
  db.pragma('journal_mode = WAL')

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS profiles (
      user_id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('patient', 'therapist', 'admin')),
      avatar_url TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
  `)
}

function seedLocalUsers(db: Database.Database): void {
  const row = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }
  if (row.count > 0) {
    return
  }

  const seedUsers: Array<{
    id: string
    email: string
    password: string
    fullName: string
    role: UserRole
    avatarUrl: string | null
  }> = [
    {
      id: randomUUID(),
      email: 'therapist@local.dev',
      password: 'Password123!',
      fullName: 'Dr. Sophie van den Berg',
      role: 'therapist',
      avatarUrl: null
    },
    {
      id: randomUUID(),
      email: 'client@local.dev',
      password: 'Password123!',
      fullName: 'Lisa Jansen',
      role: 'patient',
      avatarUrl: null
    }
  ]

  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash)
    VALUES (@id, @email, @passwordHash)
  `)
  const insertProfile = db.prepare(`
    INSERT INTO profiles (user_id, email, full_name, role, avatar_url)
    VALUES (@userId, @email, @fullName, @role, @avatarUrl)
  `)

  const insertAll = db.transaction(() => {
    for (const user of seedUsers) {
      insertUser.run({
        id: user.id,
        email: user.email,
        passwordHash: createPasswordHash(user.password)
      })
      insertProfile.run({
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatarUrl: user.avatarUrl
      })
    }
  })

  insertAll()
}

function createDatabase(): Database.Database {
  const dbPath = resolveDatabasePath()
  ensureDatabaseDirectory(dbPath)
  const db = new Database(dbPath)
  runSchemaSetup(db)
  seedLocalUsers(db)
  return db
}

export function getDb(): Database.Database {
  if (!globalThis.__mcgDb__) {
    globalThis.__mcgDb__ = createDatabase()
  }

  return globalThis.__mcgDb__
}

export function findUserByEmail(email: string): (UserRow & ProfileRow) | undefined {
  const normalizedEmail = email.trim().toLowerCase()
  const db = getDb()

  return db.prepare(`
    SELECT
      u.id,
      u.email,
      u.password_hash,
      p.user_id,
      p.full_name,
      p.role,
      p.avatar_url
    FROM users u
    INNER JOIN profiles p ON p.user_id = u.id
    WHERE u.email = ?
    LIMIT 1
  `).get(normalizedEmail) as (UserRow & ProfileRow) | undefined
}

export function findUserById(userId: string): AuthUserRecord | undefined {
  const db = getDb()
  return db.prepare(`
    SELECT
      u.id AS id,
      u.email AS email,
      p.full_name AS fullName,
      p.role AS role,
      p.avatar_url AS avatarUrl
    FROM users u
    INNER JOIN profiles p ON p.user_id = u.id
    WHERE u.id = ?
    LIMIT 1
  `).get(userId) as AuthUserRecord | undefined
}

export function getPasswordHashByUserId(userId: string): string | undefined {
  const db = getDb()
  const row = db.prepare(`
    SELECT password_hash
    FROM users
    WHERE id = ?
    LIMIT 1
  `).get(userId) as { password_hash: string } | undefined

  return row?.password_hash
}
