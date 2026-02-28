export interface Supporter {
  id: string
  name: string
  role: string
  roleLabel: string
  avatar: string
  color: string
  isPatient: boolean
  isDefault: boolean
}

export interface NudgeSignal {
  id: string
  label: string
  emoji: string
}

export interface IncomingMessage {
  id: string
  fromId: string
  fromName: string
  type: 'text' | 'emoji' | 'voice-note' | 'photo'
  content: string
  timestamp: Date
  isRead: boolean
  isNew: boolean
}

export interface CommunityPulse {
  label: string
  count: number
  icon: string
}

export interface WeeklyWin {
  label: string
  value: string
  icon: string
}

const NUDGE_SIGNALS: NudgeSignal[] = [
  { id: 'smile', label: "I'm having a tough day, send me something to smile about.", emoji: '💙' },
  { id: 'walk', label: 'I want to go for a walk but need a push. Motivate me!', emoji: '🚶' },
  { id: 'here', label: 'Just want you to know I\'m here.', emoji: '🤝' }
]

const RESPONSE_POOL: Record<string, Array<{ type: IncomingMessage['type']; content: string }>> = {
  mom: [
    { type: 'text', content: 'I\'m so proud of you, sweetheart. You\'re stronger than you think. ❤️' },
    { type: 'emoji', content: '🫂❤️☀️' },
    { type: 'photo', content: '[Photo] Made your favorite cookies today 🍪' },
    { type: 'text', content: 'I\'m always here for you. One step at a time, my love.' },
    { type: 'voice-note', content: '[Voice note - 0:08] I love you so much, keep going!' },
  ],
  alex: [
    { type: 'text', content: 'Yo! Let\'s do this! 🏃 I\'ll pick you up in 10?' },
    { type: 'emoji', content: '💪😎🔥' },
    { type: 'text', content: 'Dude you got this. Remember when we survived that exam? This is nothing!' },
    { type: 'photo', content: '[Photo] Look at this hilarious meme I found 😂' },
    { type: 'voice-note', content: '[Voice note - 0:15] Hey buddy, just thinking about you, let\'s hang soon!' },
  ],
  therapist: [
    { type: 'text', content: 'Thank you for reaching out. That takes courage. Let\'s talk about this in our next session.' },
    { type: 'text', content: 'Remember your coping strategies. You have more tools than you think.' },
    { type: 'text', content: 'I see your progress. You\'re doing meaningful work on yourself.' },
    { type: 'emoji', content: '🌟👏' },
  ],
  jamie: [
    { type: 'text', content: 'I totally understand. Today was hard for me too. We\'re in this together.' },
    { type: 'emoji', content: '🤝💛' },
    { type: 'text', content: 'I did my first walk today because you inspired me! Thank you.' },
    { type: 'text', content: 'Some days are just survival days. And that\'s okay.' },
    { type: 'voice-note', content: '[Voice note - 0:12] Hey, I\'m right there with you. We\'ve got this.' },
  ],
  default: [
    { type: 'text', content: 'Thinking of you! You\'re not alone in this. 💛' },
    { type: 'emoji', content: '💛🌈' },
    { type: 'text', content: 'Thank you for reaching out. That means a lot.' },
  ]
}

const COMMUNITY_STATS: CommunityPulse[] = [
  { label: 'people went for a walk today', count: 3, icon: 'i-lucide-footprints' },
  { label: 'people wrote a gratitude note', count: 5, icon: 'i-lucide-pen-line' },
  { label: 'people completed a mastery task', count: 8, icon: 'i-lucide-trophy' },
  { label: 'people sent a nudge to their circle', count: 12, icon: 'i-lucide-send' }
]

const WEEKLY_WINS: WeeklyWin[] = [
  { label: 'Mastery activities completed', value: '4', icon: 'i-lucide-trophy' },
  { label: 'Activities logged this week', value: '6', icon: 'i-lucide-clipboard-check' },
  { label: 'Day activity streak', value: '3', icon: 'i-lucide-flame' },
  { label: 'Highest pleasure score', value: 'Swimming (9/10)', icon: 'i-lucide-star' }
]

function createInitialSupporters(): Supporter[] {
  return [
    { id: 'mom', name: 'Mom', role: 'family', roleLabel: 'Mother', avatar: 'i-lucide-heart', color: 'rose', isPatient: false, isDefault: true },
    { id: 'alex', name: 'Alex', role: 'friend', roleLabel: 'Best Friend', avatar: 'i-lucide-user', color: 'blue', isPatient: false, isDefault: true },
    { id: 'therapist', name: 'Dr. Sarah', role: 'therapist', roleLabel: 'Therapist', avatar: 'i-lucide-stethoscope', color: 'violet', isPatient: false, isDefault: true },
    { id: 'jamie', name: 'Jamie', role: 'patient', roleLabel: 'Fellow Patient', avatar: 'i-lucide-users', color: 'amber', isPatient: true, isDefault: true }
  ]
}

function createInitialMessages(): IncomingMessage[] {
  const now = new Date()
  return [
    { id: 'msg-1', fromId: 'mom', fromName: 'Mom', type: 'text', content: "I'm so proud of you for getting out today!", timestamp: new Date(now.getTime() - 2 * 3600000), isRead: false, isNew: false },
    { id: 'msg-2', fromId: 'alex', fromName: 'Alex', type: 'emoji', content: '💪🌟', timestamp: new Date(now.getTime() - 4 * 3600000), isRead: false, isNew: false },
    { id: 'msg-3', fromId: 'therapist', fromName: 'Dr. Sarah', type: 'text', content: "Remember: you've already survived 100% of your bad days.", timestamp: new Date(now.getTime() - 6 * 3600000), isRead: true, isNew: false },
    { id: 'msg-4', fromId: 'jamie', fromName: 'Jamie', type: 'text', content: 'I did my first walk today because of you!', timestamp: new Date(now.getTime() - 8 * 3600000), isRead: true, isNew: false },
    { id: 'msg-5', fromId: 'mom', fromName: 'Mom', type: 'voice-note', content: "[Voice note - 0:12] You're doing amazing, keep going!", timestamp: new Date(now.getTime() - 24 * 3600000), isRead: true, isNew: false },
    { id: 'msg-6', fromId: 'alex', fromName: 'Alex', type: 'photo', content: '[Photo] Sunrise from our hike this morning 🌅', timestamp: new Date(now.getTime() - 26 * 3600000), isRead: true, isNew: false },
    { id: 'msg-7', fromId: 'therapist', fromName: 'Dr. Sarah', type: 'text', content: 'Thinking of you today ❤️', timestamp: new Date(now.getTime() - 48 * 3600000), isRead: true, isNew: false },
    { id: 'msg-8', fromId: 'jamie', fromName: 'Jamie', type: 'emoji', content: '🫂☀️', timestamp: new Date(now.getTime() - 50 * 3600000), isRead: true, isNew: false }
  ]
}

const supporters = ref<Supporter[]>(createInitialSupporters())
const incomingMessages = ref<IncomingMessage[]>(createInitialMessages())
const sentNudges = ref<Map<string, string>>(new Map())
let msgCounter = 100
let supporterCounter = 10

export function useSocial() {
  const nudgeSignals = computed(() => NUDGE_SIGNALS)
  const communityPulse = computed(() => COMMUNITY_STATS)
  const weeklyWins = computed(() => WEEKLY_WINS)

  const unreadCount = computed(() => {
    return incomingMessages.value.filter(m => !m.isRead).length
  })

  function getSupporterColor(supporterId: string): string {
    const s = supporters.value.find(sp => sp.id === supporterId)
    return s?.color ?? 'zinc'
  }

  function sendNudge(supporterId: string, signalId: string): void {
    sentNudges.value.set(supporterId, signalId)

    const supporter = supporters.value.find(s => s.id === supporterId)
    if (!supporter) return

    const delay = 3000 + Math.random() * 2000

    setTimeout(() => {
      const pool = RESPONSE_POOL[supporterId] ?? RESPONSE_POOL.default
      const response = pool[Math.floor(Math.random() * pool.length)]

      msgCounter++
      incomingMessages.value.unshift({
        id: `msg-${msgCounter}`,
        fromId: supporterId,
        fromName: supporter.name,
        type: response.type,
        content: response.content,
        timestamp: new Date(),
        isRead: false,
        isNew: true
      })

      sentNudges.value.delete(supporterId)
    }, delay)
  }

  function isNudgePending(supporterId: string): boolean {
    return sentNudges.value.has(supporterId)
  }

  function addSupporter(name: string, role: string): void {
    supporterCounter++
    const roleConfig: Record<string, { roleLabel: string; avatar: string; color: string; isPatient: boolean }> = {
      family: { roleLabel: 'Family', avatar: 'i-lucide-heart', color: 'rose', isPatient: false },
      friend: { roleLabel: 'Friend', avatar: 'i-lucide-user', color: 'blue', isPatient: false },
      patient: { roleLabel: 'Fellow Patient', avatar: 'i-lucide-users', color: 'amber', isPatient: true },
      other: { roleLabel: 'Supporter', avatar: 'i-lucide-hand-helping', color: 'teal', isPatient: false }
    }

    const config = roleConfig[role] ?? roleConfig.other

    supporters.value.push({
      id: `custom-${supporterCounter}`,
      name,
      role,
      roleLabel: config.roleLabel,
      avatar: config.avatar,
      color: config.color,
      isPatient: config.isPatient,
      isDefault: false
    })
  }

  function removeSupporter(id: string): void {
    const supporter = supporters.value.find(s => s.id === id)
    if (supporter && !supporter.isDefault) {
      supporters.value = supporters.value.filter(s => s.id !== id)
    }
  }

  function markAsRead(messageId: string): void {
    const msg = incomingMessages.value.find(m => m.id === messageId)
    if (msg) {
      msg.isRead = true
      msg.isNew = false
    }
  }

  function shareWeeklyWin(supporterIds: string[]): void {
    supporterIds.forEach((sId, i) => {
      const supporter = supporters.value.find(s => s.id === sId)
      if (!supporter) return

      const delay = 4000 + i * 1500 + Math.random() * 2000

      setTimeout(() => {
        const responses = [
          { type: 'text' as const, content: `Wow, amazing progress! So proud of you! 🎉` },
          { type: 'emoji' as const, content: '🎉👏🌟' },
          { type: 'text' as const, content: `This is incredible! Keep it up! 💪` },
          { type: 'text' as const, content: `You should be so proud of yourself! ❤️` },
        ]
        const response = responses[Math.floor(Math.random() * responses.length)]

        msgCounter++
        incomingMessages.value.unshift({
          id: `msg-${msgCounter}`,
          fromId: sId,
          fromName: supporter.name,
          type: response.type,
          content: response.content,
          timestamp: new Date(),
          isRead: false,
          isNew: true
        })
      }, delay)
    })
  }

  function getRelativeTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - new Date(date).getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays}d ago`
  }

  return {
    supporters,
    incomingMessages,
    nudgeSignals,
    communityPulse,
    weeklyWins,
    unreadCount,
    sendNudge,
    isNudgePending,
    addSupporter,
    removeSupporter,
    markAsRead,
    shareWeeklyWin,
    getSupporterColor,
    getRelativeTime
  }
}
