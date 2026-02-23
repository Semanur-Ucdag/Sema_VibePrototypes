const days = [
  { key: 'mon', label: '11 Mon' },
  { key: 'tue', label: '12 Tue' },
  { key: 'wed', label: '13 Wed' },
  { key: 'thu', label: '14 Thu' },
  { key: 'fri', label: '15 Fri' },
  { key: 'sat', label: '16 Sat' },
  { key: 'sun', label: '17 Sun' }
]

const events = [
  { id: 1, day: 'mon', start: '9:00', end: '10:00', title: 'Markus Meer', subtitle: '', tone: 'green' },
  { id: 2, day: 'tue', start: '9:00', end: '9:45', title: 'Preparation', subtitle: 'Lisa Jansen', tone: 'green' },
  { id: 3, day: 'wed', start: '9:00', end: '9:30', title: 'Henry Ashford', subtitle: '', tone: 'green' },
  { id: 4, day: 'thu', start: '8:00', end: '9:00', title: 'Leo Martin', subtitle: '', tone: 'green' },
  { id: 5, day: 'fri', start: '9:00', end: '9:45', title: 'Internal meeting', subtitle: '', tone: 'blue' }
]

export default eventHandler(() => ({
  days,
  events
}))
