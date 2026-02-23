import type { TaskItem } from '~/types'

const folders = [
  { label: 'Inbox', count: 4 },
  { label: 'Today', count: 5 },
  { label: 'Upcoming', count: 14 },
  { label: 'Done', count: 0 }
]

const boards = ['Personal tasks', 'Team Woerden', 'Team Rotterdam']

const tasks: TaskItem[] = [
  { id: 1, title: 'Review treatment plan', description: 'Hi Bob, I set up Wendy\'s treatment plan. Can you quickly review it?', status: 'to do', priority: 'high', assignee: 'Wendy Verstappen' },
  { id: 2, title: 'Discuss ROM questionnaire', description: 'Can we discuss outcomes in our next check-in?', status: 'to do', priority: 'medium', assignee: 'Moor van Dijk', dueDate: '23 Dec' },
  { id: 3, title: 'Update session goals', description: 'Please align goals with the latest intake notes.', status: 'to do', priority: 'medium', assignee: 'Kevin Mol' },
  { id: 4, title: 'Reschedule appointment', description: 'Can we move the Monday slot to Tuesday?', status: 'to do', priority: 'low', assignee: 'Kevin Mol' }
]

export default eventHandler(() => ({
  folders,
  boards,
  tasks
}))
