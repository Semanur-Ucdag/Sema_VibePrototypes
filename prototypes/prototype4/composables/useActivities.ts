import activitiesData from '~/data/activities.json'

export interface Activity {
  id: string
  name: string
  category: string
  icon: string
}

export interface ActivityLog {
  id: string
  activityId: string
  activityName: string
  category: string
  pleasureScore: number
  masteryScore: number
  timestamp: Date
}

export interface DayStat {
  date: Date
  dayLabel: string
  logs: number
  avgPleasure: number
  avgMastery: number
  isToday: boolean
}

const activities = activitiesData as Activity[]

function generateMockData(): ActivityLog[] {
  const logs: ActivityLog[] = []
  const now = new Date()

  const mockEntries: Array<{ dayOffset: number; actId: string; p: number; m: number }> = [
    { dayOffset: 0, actId: 'walking', p: 7, m: 5 },
    { dayOffset: 0, actId: 'journaling', p: 5, m: 8 },
    { dayOffset: 0, actId: 'cooking', p: 8, m: 7 },
    { dayOffset: 1, actId: 'reading', p: 8, m: 4 },
    { dayOffset: 1, actId: 'cleaning', p: 3, m: 9 },
    { dayOffset: 1, actId: 'calling-friend', p: 9, m: 6 },
    { dayOffset: 2, actId: 'swimming', p: 9, m: 8 },
    { dayOffset: 2, actId: 'meditation', p: 7, m: 7 },
    { dayOffset: 3, actId: 'walking', p: 6, m: 4 },
    { dayOffset: 3, actId: 'drawing', p: 7, m: 6 },
    { dayOffset: 3, actId: 'helping-others', p: 8, m: 9 },
    { dayOffset: 4, actId: 'stretching', p: 5, m: 6 },
    { dayOffset: 4, actId: 'gardening', p: 8, m: 7 },
    { dayOffset: 5, actId: 'dancing', p: 9, m: 5 },
    { dayOffset: 5, actId: 'meeting-someone', p: 7, m: 4 },
    { dayOffset: 5, actId: 'organizing', p: 4, m: 8 },
    { dayOffset: 6, actId: 'reading', p: 7, m: 3 },
    { dayOffset: 6, actId: 'cooking', p: 6, m: 6 },
  ]

  mockEntries.forEach((entry, i) => {
    const act = activities.find(a => a.id === entry.actId)
    if (!act) return
    const date = new Date(now)
    date.setDate(date.getDate() - entry.dayOffset)
    date.setHours(9 + i % 12, (i * 17) % 60, 0, 0)

    logs.push({
      id: `mock-${i}`,
      activityId: act.id,
      activityName: act.name,
      category: act.category,
      pleasureScore: entry.p,
      masteryScore: entry.m,
      timestamp: date
    })
  })

  return logs
}

const activityLogs = ref<ActivityLog[]>(generateMockData())
let idCounter = 100

const CATEGORY_COLORS: Record<string, string> = {
  Physical: '#3b82f6',
  Creative: '#a855f7',
  Social: '#f59e0b',
  'Self-Care': '#14b8a6'
}

export function useActivities() {
  const allActivities = computed(() => activities)

  const categories = computed(() => {
    const cats = [...new Set(activities.map(a => a.category))]
    return cats
  })

  const totalLogs = computed(() => activityLogs.value.length)

  const uniqueActivitiesLogged = computed(() => {
    return new Set(activityLogs.value.map(l => l.activityId)).size
  })

  const averagePleasure = computed(() => {
    if (activityLogs.value.length === 0) return 0
    const sum = activityLogs.value.reduce((s, l) => s + l.pleasureScore, 0)
    return Math.round((sum / activityLogs.value.length) * 10) / 10
  })

  const averageMastery = computed(() => {
    if (activityLogs.value.length === 0) return 0
    const sum = activityLogs.value.reduce((s, l) => s + l.masteryScore, 0)
    return Math.round((sum / activityLogs.value.length) * 10) / 10
  })

  const sweetSpotActivities = computed(() => {
    const avgMap = new Map<string, { pSum: number; mSum: number; count: number; name: string }>()
    activityLogs.value.forEach(l => {
      const existing = avgMap.get(l.activityId)
      if (existing) {
        existing.pSum += l.pleasureScore
        existing.mSum += l.masteryScore
        existing.count++
      } else {
        avgMap.set(l.activityId, { pSum: l.pleasureScore, mSum: l.masteryScore, count: 1, name: l.activityName })
      }
    })
    const result: Array<{ id: string; name: string; avgPleasure: number; avgMastery: number }> = []
    avgMap.forEach((val, key) => {
      const avgP = val.pSum / val.count
      const avgM = val.mSum / val.count
      if (avgP >= 7 && avgM >= 7) {
        result.push({ id: key, name: val.name, avgPleasure: Math.round(avgP * 10) / 10, avgMastery: Math.round(avgM * 10) / 10 })
      }
    })
    return result
  })

  function getLogsForActivity(activityId: string): ActivityLog[] {
    return activityLogs.value.filter(l => l.activityId === activityId)
  }

  function getAverageScores(activityId: string): { pleasure: number; mastery: number; count: number } {
    const logs = getLogsForActivity(activityId)
    if (logs.length === 0) return { pleasure: 0, mastery: 0, count: 0 }
    const pAvg = logs.reduce((s, l) => s + l.pleasureScore, 0) / logs.length
    const mAvg = logs.reduce((s, l) => s + l.masteryScore, 0) / logs.length
    return {
      pleasure: Math.round(pAvg * 10) / 10,
      mastery: Math.round(mAvg * 10) / 10,
      count: logs.length
    }
  }

  interface HeatmapDot {
    activityId: string
    activityName: string
    category: string
    avgPleasure: number
    avgMastery: number
    count: number
    color: string
    lastLogged: Date
  }

  const heatmapDots = computed<HeatmapDot[]>(() => {
    const map = new Map<string, { pSum: number; mSum: number; count: number; name: string; category: string; last: Date }>()
    activityLogs.value.forEach(l => {
      const existing = map.get(l.activityId)
      if (existing) {
        existing.pSum += l.pleasureScore
        existing.mSum += l.masteryScore
        existing.count++
        if (l.timestamp > existing.last) existing.last = l.timestamp
      } else {
        map.set(l.activityId, {
          pSum: l.pleasureScore, mSum: l.masteryScore, count: 1,
          name: l.activityName, category: l.category, last: l.timestamp
        })
      }
    })
    const dots: HeatmapDot[] = []
    map.forEach((val, key) => {
      dots.push({
        activityId: key,
        activityName: val.name,
        category: val.category,
        avgPleasure: Math.round((val.pSum / val.count) * 10) / 10,
        avgMastery: Math.round((val.mSum / val.count) * 10) / 10,
        count: val.count,
        color: CATEGORY_COLORS[val.category] ?? '#71717a',
        lastLogged: val.last
      })
    })
    return dots
  })

  function getWeeklyStats(): DayStat[] {
    const now = new Date()
    const stats: DayStat[] = []
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)

      const dayLogs = activityLogs.value.filter(l => {
        const t = new Date(l.timestamp)
        return t >= date && t < nextDay
      })

      stats.push({
        date,
        dayLabel: dayNames[date.getDay()],
        logs: dayLogs.length,
        avgPleasure: dayLogs.length > 0
          ? Math.round((dayLogs.reduce((s, l) => s + l.pleasureScore, 0) / dayLogs.length) * 10) / 10
          : 0,
        avgMastery: dayLogs.length > 0
          ? Math.round((dayLogs.reduce((s, l) => s + l.masteryScore, 0) / dayLogs.length) * 10) / 10
          : 0,
        isToday: i === 0
      })
    }
    return stats
  }

  const currentStreak = computed(() => {
    const now = new Date()
    let streak = 0
    for (let i = 0; i < 30; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)

      const hasLog = activityLogs.value.some(l => {
        const t = new Date(l.timestamp)
        return t >= date && t < nextDay
      })
      if (hasLog) streak++
      else break
    }
    return streak
  })

  const mostEnjoyable = computed(() => {
    const avgMap = new Map<string, { pSum: number; count: number; name: string; icon: string }>()
    activityLogs.value.forEach(l => {
      const act = activities.find(a => a.id === l.activityId)
      const existing = avgMap.get(l.activityId)
      if (existing) {
        existing.pSum += l.pleasureScore
        existing.count++
      } else {
        avgMap.set(l.activityId, { pSum: l.pleasureScore, count: 1, name: l.activityName, icon: act?.icon ?? '' })
      }
    })
    let best: { name: string; score: number; icon: string } | null = null
    avgMap.forEach(val => {
      const avg = val.pSum / val.count
      if (!best || avg > best.score) {
        best = { name: val.name, score: Math.round(avg * 10) / 10, icon: val.icon }
      }
    })
    return best
  })

  const biggestAchievement = computed(() => {
    const avgMap = new Map<string, { mSum: number; count: number; name: string; icon: string }>()
    activityLogs.value.forEach(l => {
      const act = activities.find(a => a.id === l.activityId)
      const existing = avgMap.get(l.activityId)
      if (existing) {
        existing.mSum += l.masteryScore
        existing.count++
      } else {
        avgMap.set(l.activityId, { mSum: l.masteryScore, count: 1, name: l.activityName, icon: act?.icon ?? '' })
      }
    })
    let best: { name: string; score: number; icon: string } | null = null
    avgMap.forEach(val => {
      const avg = val.mSum / val.count
      if (!best || avg > best.score) {
        best = { name: val.name, score: Math.round(avg * 10) / 10, icon: val.icon }
      }
    })
    return best
  })

  function generateFeedback(activityId: string, pleasure: number, mastery: number): string {
    const prevLogs = activityLogs.value.filter(l => l.activityId === activityId)
    const isFirstTime = prevLogs.length === 0

    if (isFirstTime) return 'New discovery added to your map!'

    if (pleasure >= 7 && mastery >= 7) return 'Sweet spot! This activity truly fuels you.'

    const prevAvgPleasure = prevLogs.reduce((s, l) => s + l.pleasureScore, 0) / prevLogs.length
    const act = activities.find(a => a.id === activityId)
    if (pleasure > prevAvgPleasure + 1 && act) {
      return `Your enjoyment of ${act.name} is growing!`
    }

    if (pleasure >= 7) return 'You found real enjoyment in this!'
    if (mastery >= 7) return 'Great sense of accomplishment!'
    if (pleasure < 4 && mastery < 4) return 'Every step counts. Just showing up is progress.'

    return 'Evidence logged! You are rediscovering what fuels you.'
  }

  function logActivity(activityId: string, pleasureScore: number, masteryScore: number): string {
    const act = activities.find(a => a.id === activityId)
    if (!act) return ''

    const feedback = generateFeedback(activityId, pleasureScore, masteryScore)

    idCounter++
    activityLogs.value.push({
      id: `log-${idCounter}`,
      activityId: act.id,
      activityName: act.name,
      category: act.category,
      pleasureScore,
      masteryScore,
      timestamp: new Date()
    })

    return feedback
  }

  function getCategoryColor(category: string): string {
    return CATEGORY_COLORS[category] ?? '#71717a'
  }

  return {
    allActivities,
    categories,
    activityLogs,
    totalLogs,
    uniqueActivitiesLogged,
    averagePleasure,
    averageMastery,
    sweetSpotActivities,
    heatmapDots,
    currentStreak,
    mostEnjoyable,
    biggestAchievement,
    getLogsForActivity,
    getAverageScores,
    getWeeklyStats,
    logActivity,
    getCategoryColor
  }
}
