import type { CaseloadRow } from '~/types'

const caseloads: CaseloadRow[] = [
  {
    id: 'LJ-5829',
    name: 'Lisa Jansen',
    phone: '+31 6 3819 4055',
    role: 'lead',
    diagnosis: 'PTSD short-term',
    treatmentPhase: 'triage',
    clinicianAvatars: [{ src: 'https://i.pravatar.cc/80?img=11', alt: 'A' }, { src: 'https://i.pravatar.cc/80?img=12', alt: 'B' }]
  },
  {
    id: 'MM-9472',
    name: 'Markus Meer',
    phone: '+31 6 2483 5672',
    role: 'primary',
    diagnosis: 'Anxiety disorder',
    treatmentPhase: 'intake',
    clinicianAvatars: [{ src: 'https://i.pravatar.cc/80?img=10', alt: 'A' }, { src: 'https://i.pravatar.cc/80?img=32', alt: 'B' }]
  },
  {
    id: 'ET-4759',
    name: 'Emma Thompson',
    phone: '+31 6 2483 5672',
    role: 'involved',
    diagnosis: 'Burnout recovery',
    treatmentPhase: 'in treatment',
    clinicianAvatars: [{ src: 'https://i.pravatar.cc/80?img=31', alt: 'A' }, { src: 'https://i.pravatar.cc/80?img=33', alt: 'B' }, { src: 'https://i.pravatar.cc/80?img=34', alt: 'C' }]
  }
]

export default eventHandler(() => caseloads)
