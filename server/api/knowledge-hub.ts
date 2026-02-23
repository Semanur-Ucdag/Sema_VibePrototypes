import type { KnowledgeArticle, KnowledgeCategory } from '~/types'

const categories: KnowledgeCategory[] = [
  { id: 'tools', title: 'Tools & Forms', icon: 'i-lucide-clipboard-check' },
  { id: 'guidelines', title: 'Guidelines & Protocols', icon: 'i-lucide-book-marked' },
  { id: 'literature', title: 'Literature & Media', icon: 'i-lucide-graduation-cap' },
  { id: 'ops', title: 'Operations & Support', icon: 'i-lucide-building-2' },
  { id: 'crisis', title: 'Crisis & Safety', icon: 'i-lucide-shield-alert' }
]

const recentlyViewed: KnowledgeArticle[] = [
  { id: 1, title: 'Exposure worksheet template', excerpt: 'Editable worksheet for graded exposure planning.', updatedAt: 'Jan 26, 2026', category: 'tools' },
  { id: 2, title: 'CBT protocol update 2025', excerpt: 'Latest quality adjustments to CBT protocol steps.', updatedAt: 'Jan 26, 2026', category: 'guidelines' },
  { id: 3, title: 'Crisis de-escalation quick guide', excerpt: 'Checklist for urgent intervention and safety protocol.', updatedAt: 'Jan 26, 2026', category: 'crisis' }
]

const references = [
  'VA/DoD Clinical Practice Guideline for the Management of Posttraumatic Stress Disorder and Acute Stress Disorder, 2023',
  'Netherlands Institute for Mental Health (Trimbos) — PTSD Treatment Protocols, v2.4 (2024)',
  'European Society for Traumatic Stress Studies (ESTSS) — Clinical Guidelines Summary, 2023'
]

export default eventHandler(() => ({
  categories,
  recentlyViewed,
  references,
  suggestedTags: ['CBT Protocol', 'EMDR', 'PTSD', 'CAT', 'Quality Standards', 'Interpersonal Therapy']
}))
