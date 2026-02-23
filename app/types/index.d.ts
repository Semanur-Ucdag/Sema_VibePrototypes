import type { AvatarProps } from '@nuxt/ui'

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'
export type SaleStatus = 'paid' | 'failed' | 'refunded'

export interface User {
  id: number
  name: string
  email: string
  avatar?: AvatarProps
  status: UserStatus
  location: string
}

export interface Mail {
  id: number
  unread?: boolean
  from: User
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: AvatarProps
}

export interface Stat {
  title: string
  icon: string
  value: number | string
  variation: number
  formatter?: (value: number) => string
}

export interface Sale {
  id: string
  date: string
  status: SaleStatus
  email: string
  amount: number
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export interface Range {
  start: Date
  end: Date
}

export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'no-show'
export type AppointmentKind = 'session' | 'internal' | 'follow-up'

export interface Appointment {
  id: number
  patientId: string
  patientName: string
  start: string
  end: string
  status: AppointmentStatus
  kind: AppointmentKind
  note: string
}

export type TaskStatus = 'to do' | 'in progress' | 'completed'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface TaskItem {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignee: string
  patientId?: string
  dueDate?: string
}

export type AlertSeverity = 'info' | 'warning' | 'error'

export interface PatientAlert {
  id: number
  patientId: string
  patientName: string
  title: string
  message: string
  createdAt: string
  severity: AlertSeverity
}

export type CaseloadRole = 'lead' | 'primary' | 'involved'
export type TreatmentPhase = 'triage' | 'intake' | 'in treatment' | 'completed'

export interface CaseloadRow {
  id: string
  name: string
  phone: string
  role: CaseloadRole
  diagnosis: string
  treatmentPhase: TreatmentPhase
  clinicianAvatars: AvatarProps[]
}

export interface ChatThread {
  id: number
  patientId: string
  patientName: string
  preview: string
  updatedAt: string
  unreadCount: number
}

export interface ChatMessage {
  id: number
  threadId: number
  sender: 'therapist' | 'patient'
  text: string
  createdAt: string
}

export interface InsightMetric {
  id: string
  title: string
  value: number
  delta: number
  completion: number
  tone: 'green' | 'orange' | 'red'
}

export interface QuestionnaireResult {
  id: number
  name: string
  completedAt: string
  score: number
  norm: string
}

export interface ClientProfile {
  id: string
  name: string
  phone: string
  address: string
  status: 'in treatment' | 'completed'
  questionnaires: QuestionnaireResult[]
}

export interface KnowledgeCategory {
  id: string
  title: string
  icon: string
}

export interface KnowledgeArticle {
  id: number
  title: string
  excerpt: string
  updatedAt: string
  category: string
}
