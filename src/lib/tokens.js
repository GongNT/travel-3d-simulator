// Simulated CNR token economy. This is presentation/demo only - no real
// payment processing happens anywhere in this module or its callers.

export const PLAN_SEARCH_COST = 69
export const WALK_3D_COST = 131
export const PHOTO_REVIEW_REWARD = 35
export const STARTING_BALANCE = 300

export const TOKEN_BUNDLES = [
  { id: 'small', priceUSD: 0.8, tokens: 100 },
  { id: 'large', priceUSD: 4.0, tokens: 600 },
]
