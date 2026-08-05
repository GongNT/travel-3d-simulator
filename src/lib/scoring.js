// Deterministic weighted multi-criteria scoring engine.
// Takes traveler preferences (structured weights + constraints) and ranks
// candidate spots. This is the "analytics" core of the project - no LLM call
// happens here, so results are reproducible and explainable.

const CATEGORIES = ['relax', 'adventure', 'culture', 'food']

/**
 * @param {object} prefs
 * @param {number} prefs.budgetLevel 1-5, traveler's max acceptable cost level
 * @param {number} prefs.timeBudgetHours total hours available
 * @param {Record<string, number>} prefs.categoryWeights e.g. { relax: 0.8, adventure: 0.2, culture: 0.5, food: 0.3 }, each 0-1
 * @param {import('../data/spots').SPOTS} spots
 */
export function scoreSpots(prefs, spots) {
  const { budgetLevel, timeBudgetHours, categoryWeights } = prefs

  const scored = spots.map((spot) => {
    const categoryScore = categoryWeights[spot.category] ?? 0

    // Cost fit: full score if within budget, linearly penalized per level over
    const costOverage = Math.max(0, spot.costLevel - budgetLevel)
    const costScore = Math.max(0, 1 - costOverage * 0.35)

    // Time fit: full score if it fits remaining time, penalized if it doesn't
    const timeScore = spot.durationHours <= timeBudgetHours ? 1 : Math.max(
      0,
      1 - (spot.durationHours - timeBudgetHours) * 0.3
    )

    // Tag overlap bonus: small nudge for spots matching multiple weighted categories via tags
    const tagBonus = spot.tags.reduce((sum, tag) => {
      return sum + (categoryWeights[tag] ?? 0) * 0.15
    }, 0) / spot.tags.length

    const breakdown = {
      categoryScore: round(categoryScore),
      costScore: round(costScore),
      timeScore: round(timeScore),
      tagBonus: round(tagBonus),
    }

    // Weighted combination - weights sum to 1.0 across the three main factors,
    // tagBonus is a small additive nudge on top.
    const total = round(
      categoryScore * 0.5 + costScore * 0.25 + timeScore * 0.25 + tagBonus
    )

    return { spot, score: total, breakdown }
  })

  return scored.sort((a, b) => b.score - a.score)
}

export function explainRanking(scoredList) {
  const [top, ...rest] = scoredList
  if (!top) return ''
  const runnerUp = rest[0]
  const lines = [
    `${top.spot.name} scored highest (${top.score.toFixed(2)}) - ` +
      `strong match on preferences (${top.breakdown.categoryScore.toFixed(2)}), ` +
      `cost fit (${top.breakdown.costScore.toFixed(2)}), and time fit (${top.breakdown.timeScore.toFixed(2)}).`,
  ]
  if (runnerUp) {
    lines.push(
      `${runnerUp.spot.name} was runner-up (${runnerUp.score.toFixed(2)}) but ` +
        (runnerUp.breakdown.categoryScore < top.breakdown.categoryScore
          ? 'matched your stated preferences less closely.'
          : runnerUp.breakdown.costScore < top.breakdown.costScore
            ? 'scored lower on cost fit.'
            : 'scored lower on time fit.')
    )
  }
  return lines.join(' ')
}

function round(n) {
  return Math.round(n * 1000) / 1000
}

export { CATEGORIES }
