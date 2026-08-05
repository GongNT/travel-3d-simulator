import { chatJSON } from './openai'

const SYSTEM_PROMPT = `You convert a traveler's free-text description of what they want into structured \
preference weights for a trip-planning scoring engine. Always respond with a single JSON object, \
no markdown, matching exactly this shape:

{
  "budgetLevel": <integer 1-5, 1 = very cheap only, 5 = money no object>,
  "timeBudgetHours": <integer, total hours they have available>,
  "categoryWeights": {
    "relax": <0-1>,
    "adventure": <0-1>,
    "culture": <0-1>,
    "food": <0-1>
  },
  "summary": "<one sentence reflecting back what you understood>"
}

If the traveler doesn't mention something, make a reasonable default (budgetLevel: 3, timeBudgetHours: 6, \
weights: 0.5 each) rather than leaving fields out.`

export async function parsePreferences(freeText) {
  const result = await chatJSON([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: freeText },
  ])

  return {
    budgetLevel: clamp(Number(result.budgetLevel) || 3, 1, 5),
    timeBudgetHours: Math.max(1, Number(result.timeBudgetHours) || 6),
    categoryWeights: {
      relax: clamp01(result.categoryWeights?.relax),
      adventure: clamp01(result.categoryWeights?.adventure),
      culture: clamp01(result.categoryWeights?.culture),
      food: clamp01(result.categoryWeights?.food),
    },
    summary: result.summary || '',
  }
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

function clamp01(n) {
  const v = Number(n)
  if (Number.isNaN(v)) return 0.5
  return clamp(v, 0, 1)
}
