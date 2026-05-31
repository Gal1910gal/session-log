export interface SessionEntry {
  id: string
  createdAt: string

  // Section 1 — פרטים כלליים
  date: string
  subjectName: string
  birthDate: string
  fullName: string
  mainQuestion: string
  duration: string
  gender: 'female' | 'male'
  sessionType: 'first' | 'followup' | 'remote'
  domain: string[]
  domainOther: string

  // Section 2 — לפני המפגש
  priorKnowledge: string[]
  priorKnowledgeDetail: string
  realQuestion: string[]
  realQuestionOther: string
  realQuestionFormulation: string

  // Section 3 — שלב האבחון
  pattern1Behavioral: string
  pattern1Indicates: string[]
  pattern1OtherText: string
  pattern2Gap: string[]
  pattern2OtherText: string
  pattern2Formulation: string
  pattern3Timing: string[]
  pattern3OtherText: string
  pattern3Practical: string

  // Section 4 — שכבות נוספות
  nameAdded: string[]
  nameAddedDetail: string
  timingAdded: string[]
  timingAddedOther: string
  timingSentence: string

  // Section 5 — בזמן המפגש
  clientReaction: string[]
  clientReactionOther: string
  feltAccurate: string
  didntConnect: string
  hitSentences: [string, string, string]
  repeatingTopics: string[]
  repeatingTopicsOther: string

  // Section 6 — אחרי המפגש
  whatWasAccurate: string
  whatWasInaccurate: string
  interpretedTooFast: string
  numbersVsStory: string
  clientMainInsight: string[]
  clientMainInsightOther: string
  clientMainInsightDetail: string

  // Section 7 — דירוג איכות
  rating14: number  // התאמה כללית
  rating15: number  // דפוס 1
  rating16: number  // דפוס 2
  rating17: number  // דפוס 3
  rating18: number  // תזמון
  rating19: number  // ערך מעשי

  // Section 8 — סוגי התאמה
  matchDirect: boolean
  matchEmotional: boolean
  matchBehavioral: boolean
  matchPractical: boolean
  matchRetroactive: boolean
  matchPartial: boolean
  matchNone: boolean

  // Section 9 — שאלת הזהב
  goldenConclusion: string
}

export type SessionDraft = Partial<SessionEntry>

export const STORAGE_KEY = 'session-log-entries'

export function loadSessions(): SessionEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') } catch { return [] }
}
export function saveSession(s: SessionEntry) {
  const all = loadSessions().filter(x => x.id !== s.id)
  all.unshift(s)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}
export function deleteSession(id: string) {
  const all = loadSessions().filter(x => x.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
}
export function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}
