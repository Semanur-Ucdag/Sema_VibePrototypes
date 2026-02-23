import type { ClientProfile } from '~/types'

const profiles: ClientProfile[] = [
  {
    id: 'LJ-5829',
    name: 'Lisa Jansen',
    phone: '+31 6 4782 9163',
    address: 'Ruysdaelstraat 494L, 1017 XA, Amsterdam',
    status: 'in treatment',
    questionnaires: [
      { id: 1, name: 'MHC-SF', completedAt: '10-12-2025', score: 2.57, norm: 'High average' },
      { id: 2, name: 'SQ-48', completedAt: '10-12-2025', score: 2.57, norm: 'High average' }
    ]
  }
]

export default eventHandler((event) => {
  const id = getRouterParam(event, 'id')
  const profile = profiles.find(item => item.id === id)

  if (!profile) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Client profile not found'
    })
  }

  return profile
})
