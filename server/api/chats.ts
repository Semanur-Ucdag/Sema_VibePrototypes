import type { ChatMessage, ChatThread } from '~/types'

const threads: ChatThread[] = [
  { id: 1, patientId: 'LJ-5829', patientName: 'Lisa Jansen', preview: 'Hi, just checking in...', updatedAt: '10:00', unreadCount: 0 },
  { id: 2, patientId: 'MM-9472', patientName: 'Markus Meer', preview: 'Thank you for the exercises...', updatedAt: '3h', unreadCount: 1 },
  { id: 3, patientId: 'ET-4759', patientName: 'Emma Thompson', preview: 'I just completed the questionnaire...', updatedAt: '2d', unreadCount: 0 }
]

const messages: ChatMessage[] = [
  { id: 1, threadId: 1, sender: 'therapist', text: 'Hi Lisa, just checking in.', createdAt: '10:00' },
  { id: 2, threadId: 1, sender: 'patient', text: 'Hi! I\'m here.', createdAt: '9:50' },
  { id: 3, threadId: 1, sender: 'therapist', text: 'Nothing alarming, but I\'d like to talk this through in our next session to make sure you\'re feeling supported.', createdAt: '10:15' },
  { id: 4, threadId: 1, sender: 'patient', text: 'Thanks for letting me know. I\'ve had a tougher week than usual.', createdAt: '9:59' }
]

export default eventHandler(() => ({
  threads,
  messages
}))
