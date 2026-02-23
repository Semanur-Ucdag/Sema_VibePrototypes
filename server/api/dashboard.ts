import type { Appointment, PatientAlert, TaskItem } from '~/types'

const appointments: Appointment[] = [
  { id: 1, patientId: 'LJ-5829', patientName: 'Lisa Jansen', start: '09:15', end: '09:45', status: 'scheduled', kind: 'session', note: 'Session call' },
  { id: 2, patientId: 'TEAM-001', patientName: 'Internal meeting', start: '10:00', end: '10:30', status: 'scheduled', kind: 'internal', note: 'Team meeting' },
  { id: 3, patientId: 'OR-9043', patientName: 'Olivia Rossi', start: '11:15', end: '11:45', status: 'scheduled', kind: 'session', note: 'Session call' }
]

const alerts: PatientAlert[] = [
  { id: 1, patientId: 'LJ-5829', patientName: 'Lisa Jansen', title: 'High score on SQ48 questionnaire', message: 'Review risk and adjust treatment plan.', createdAt: '20 min ago', severity: 'error' },
  { id: 2, patientId: 'LJ-5829', patientName: 'Lisa Jansen', title: 'Low treatment adherence', message: 'Client has not completed assigned modules.', createdAt: '20 min ago', severity: 'error' },
  { id: 3, patientId: 'LJ-5829', patientName: 'Lisa Jansen', title: 'Hasn\'t logged in for 2 weeks', message: 'Follow up to identify blockers.', createdAt: '20 min ago', severity: 'warning' }
]

const tasks: TaskItem[] = [
  { id: 1, title: 'Review patient chart', description: 'Review latest progress and notes.', status: 'in progress', priority: 'high', assignee: 'Lisa Jansen', patientId: 'LJ-5829' },
  { id: 2, title: 'Follow up on lab results', description: 'Confirm results in next call.', status: 'in progress', priority: 'medium', assignee: 'Emma Thompson', patientId: 'ET-4759' },
  { id: 3, title: 'Update medication list', description: 'Align records with treatment plan.', status: 'in progress', priority: 'medium', assignee: 'Markus Meer', patientId: 'MM-9472' }
]

export default eventHandler(() => ({
  appointments,
  alerts,
  tasks
}))
