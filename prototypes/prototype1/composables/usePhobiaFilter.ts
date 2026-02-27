const PHOBIA_KEYWORDS: Record<string, string[]> = {
  Heights: ['height', 'heights', 'climbing', 'flying', 'clouds', 'skydiving', 'cliff', 'tower', 'above', 'fall'],
  Crowds: ['crowd', 'crowds', 'crowded', 'packed', 'busy', 'gathering', 'masses'],
  Darkness: ['dark', 'darkness', 'night', 'shadow', 'dim', 'black'],
  Water: ['water', 'ocean', 'sea', 'swim', 'swimming', 'pool', 'lake', 'river', 'dive', 'drown'],
  Spiders: ['spider', 'spiders', 'web', 'crawl', 'insect', 'bug'],
  'Enclosed spaces': ['enclosed', 'claustrophob', 'elevator', 'small room', 'confined', 'tight space', 'tunnel'],
  'Public speaking': ['public speaking', 'speech', 'presentation', 'audience', 'stage', 'podium']
}

export function usePhobiaFilter() {
  function getBlockedKeywords(userPhobias: string[]): string[] {
    const keywords: string[] = []
    for (const phobia of userPhobias) {
      const mapped = PHOBIA_KEYWORDS[phobia]
      if (mapped) {
        keywords.push(...mapped)
      } else {
        keywords.push(phobia.toLowerCase())
      }
    }
    return keywords
  }

  function containsPhobiaTrigger(text: string, userPhobias: string[]): boolean {
    const blocked = getBlockedKeywords(userPhobias)
    const lower = text.toLowerCase()
    return blocked.some(keyword => lower.includes(keyword))
  }

  function filterIntroText(
    text: string,
    userPhobias: string[],
    fallback: string = 'Thank you for sharing. Now, thinking about the past seven days...'
  ): string {
    if (containsPhobiaTrigger(text, userPhobias)) {
      return fallback
    }
    return text
  }

  return {
    containsPhobiaTrigger,
    filterIntroText,
    getBlockedKeywords
  }
}
