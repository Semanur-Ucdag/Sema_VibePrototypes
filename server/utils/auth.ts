import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'
import { getCookie, setCookie, deleteCookie, createError } from 'h3'
import { findUserByEmail, findUserById, getDb, type AuthUserRecord } from '~~/server/utils/db'

type AccountType = 'client' | 'therapist'

export interface AuthUser {
  id: string
  email: string
  fullName: string
  role: 'patient' | 'therapist' | 'admin'
  avatarUrl: string | null
  accountType: AccountType
}

const SESSION_COOKIE_NAME = 'mcg_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function toAccountType(role: AuthUser['role']): AccountType {
  return role === 'patient' ? 'client' : 'therapist'
}

function toAuthUser(user: AuthUserRecord): AuthUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    avatarUrl: user.avatarUrl,
    accountType: toAccountType(user.role)
  }
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

function toDateAfterSeconds(seconds: number): Date {
  return new Date(Date.now() + seconds * 1000)
}

export function createPasswordHash(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPasswordHash(password: string, storedHash: string): boolean {
  const [salt, knownHash] = storedHash.split(':')
  if (!salt || !knownHash) {
    return false
  }

  const candidateHash = scryptSync(password, salt, 64).toString('hex')
  const knownHashBuffer = Buffer.from(knownHash, 'hex')
  const candidateHashBuffer = Buffer.from(candidateHash, 'hex')

  if (knownHashBuffer.length !== candidateHashBuffer.length) {
    return false
  }

  return timingSafeEqual(candidateHashBuffer, knownHashBuffer)
}

export function createSession(event: H3Event, userId: string): void {
  const token = randomBytes(32).toString('hex')
  const tokenHash = hashToken(token)
  const sessionId = randomUUID()
  const expiresAt = toDateAfterSeconds(SESSION_TTL_SECONDS).toISOString()
  const db = getDb()

  db.prepare(`
    INSERT INTO sessions (id, user_id, token_hash, expires_at, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).run(sessionId, userId, tokenHash, expiresAt)

  setCookie(event, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS
  })
}

export function clearAuthSession(event: H3Event): void {
  const token = getCookie(event, SESSION_COOKIE_NAME)
  if (token) {
    const db = getDb()
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token))
  }

  deleteCookie(event, SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })
}

export function getSessionUser(event: H3Event): AuthUser | null {
  const token = getCookie(event, SESSION_COOKIE_NAME)
  if (!token) {
    return null
  }

  const tokenHash = hashToken(token)
  const db = getDb()
  const session = db.prepare(`
    SELECT user_id, expires_at
    FROM sessions
    WHERE token_hash = ?
    LIMIT 1
  `).get(tokenHash) as { user_id: string, expires_at: string } | undefined

  if (!session) {
    return null
  }

  if (new Date(session.expires_at).getTime() <= Date.now()) {
    db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash)
    return null
  }

  const nextExpiry = toDateAfterSeconds(SESSION_TTL_SECONDS).toISOString()
  db.prepare(`
    UPDATE sessions
    SET expires_at = ?, updated_at = CURRENT_TIMESTAMP
    WHERE token_hash = ?
  `).run(nextExpiry, tokenHash)

  setCookie(event, SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL_SECONDS
  })

  const user = findUserById(session.user_id)
  return user ? toAuthUser(user) : null
}

export function requireSessionUser(event: H3Event): AuthUser {
  const user = getSessionUser(event)
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  return user
}

export function verifyCredentials(email: string, password: string): AuthUser | null {
  const user = findUserByEmail(email)
  if (!user) {
    return null
  }

  const isValid = verifyPasswordHash(password, user.password_hash)
  if (!isValid) {
    return null
  }

  return toAuthUser({
    id: user.id,
    email: user.email,
    fullName: user.full_name,
    role: user.role,
    avatarUrl: user.avatar_url
  })
}
