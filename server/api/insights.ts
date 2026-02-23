import type { InsightMetric } from '~/types'

const metrics: InsightMetric[] = [
  { id: 'cqi', title: 'Client Satisfaction (CQI)', value: 62, delta: 1.8, completion: 80, tone: 'green' },
  { id: 'sq48', title: 'ROM outcomes SQ-48', value: 73, delta: -0.5, completion: 73, tone: 'green' },
  { id: 'mhcsf', title: 'ROM outcomes MHC-SF', value: 47, delta: 1.8, completion: 35, tone: 'orange' },
  { id: 'duration', title: 'Treatment duration', value: 36, delta: -2.8, completion: 47, tone: 'red' },
  { id: 'productivity', title: 'Productivity', value: 67, delta: 1.8, completion: 70, tone: 'green' },
  { id: 'return-to-work', title: 'Return to work', value: 30, delta: -0.5, completion: 30, tone: 'red' },
  { id: 'treatment-duration-2', title: 'Treatment duration', value: 36, delta: -2.8, completion: 47, tone: 'red' },
  { id: 'completeness', title: 'Completeness rate', value: 64, delta: 1.8, completion: 47, tone: 'green' }
]

export default eventHandler(() => metrics)
