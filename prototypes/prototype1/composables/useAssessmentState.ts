import qidsSrData from '../../shared/data/qids-sr.json'
import sq48Data from '../../shared/data/sq-48.json'

export type ScaleId = 'qids-sr' | 'sq-48'

export interface AssessmentResult {
  scaleId: ScaleId
  answers: Record<number, number>
  totalScore: number
  domainScores: Record<string, number>
  severity?: string
}

const selectedScale = ref<ScaleId | null>(null)
const answers = reactive<Record<number, number>>({})
const currentQuestionIndex = ref(0)
const isAssessmentComplete = ref(false)
const skipWorkStudy = ref(false)

export function useAssessmentState() {
  const scaleData = computed(() => {
    if (selectedScale.value === 'qids-sr') return qidsSrData
    if (selectedScale.value === 'sq-48') return sq48Data
    return null
  })

  const activeQuestions = computed(() => {
    if (!scaleData.value) return []
    const questions = scaleData.value.questions as Array<{
      id: number
      skippable?: boolean
      [key: string]: unknown
    }>
    if (selectedScale.value === 'sq-48' && skipWorkStudy.value) {
      return questions.filter(q => !q.skippable)
    }
    return questions
  })

  const totalQuestions = computed(() => activeQuestions.value.length)

  const progress = computed(() => {
    if (totalQuestions.value === 0) return 0
    return Math.round((currentQuestionIndex.value / totalQuestions.value) * 100)
  })

  const currentQuestion = computed(() => {
    return activeQuestions.value[currentQuestionIndex.value] ?? null
  })

  function calculateQidsScore(): AssessmentResult {
    const domains: Record<string, number> = {}
    for (const domain of qidsSrData.scoring.domains) {
      if (domain.rule === 'highest') {
        domains[domain.name] = Math.max(...domain.items.map(id => answers[id] ?? 0))
      } else {
        domains[domain.name] = answers[domain.items[0]] ?? 0
      }
    }

    const totalScore = Object.values(domains).reduce((sum, v) => sum + v, 0)
    const severity = qidsSrData.scoring.severity.find(
      s => totalScore >= s.min && totalScore <= s.max
    )?.label ?? 'Unknown'

    return {
      scaleId: 'qids-sr',
      answers: { ...answers },
      totalScore,
      domainScores: domains,
      severity
    }
  }

  function calculateSq48Score(): AssessmentResult {
    const reverseItems = new Set(sq48Data.scoring.reverseItems)
    const maxItem = sq48Data.scoring.maxItemScore
    const subscales = sq48Data.scoring.subscales as Array<{
      name: string
      code: string
      items: number[]
      excludeFromTotal?: boolean
    }>

    const domains: Record<string, number> = {}
    let totalScore = 0

    for (const sub of subscales) {
      let subScore = 0
      for (const itemId of sub.items) {
        let val = answers[itemId] ?? 0
        if (reverseItems.has(itemId)) {
          val = maxItem - val
        }
        subScore += val
      }
      domains[sub.code] = subScore
      if (!sub.excludeFromTotal) {
        totalScore += subScore
      }
    }

    return {
      scaleId: 'sq-48',
      answers: { ...answers },
      totalScore,
      domainScores: domains
    }
  }

  function getResult(): AssessmentResult | null {
    if (selectedScale.value === 'qids-sr') return calculateQidsScore()
    if (selectedScale.value === 'sq-48') return calculateSq48Score()
    return null
  }

  function reset(): void {
    selectedScale.value = null
    Object.keys(answers).forEach(k => delete answers[Number(k)])
    currentQuestionIndex.value = 0
    isAssessmentComplete.value = false
    skipWorkStudy.value = false
  }

  return {
    selectedScale,
    answers,
    currentQuestionIndex,
    isAssessmentComplete,
    skipWorkStudy,
    scaleData,
    activeQuestions,
    totalQuestions,
    progress,
    currentQuestion,
    getResult,
    reset
  }
}
