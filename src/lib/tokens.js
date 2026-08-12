// Simulated CNR token economy. This is presentation/demo only - no real
// payment processing happens anywhere in this module or its callers.

export const PLAN_SEARCH_COST = 69
// One-time unlock: paying WALK_3D_COST once grants 3D-walk access to every
// spot for the rest of the session, not just the spot that was clicked.
export const WALK_3D_COST = 89
export const PHOTO_REVIEW_MIN_PHOTOS = 3
export const PHOTO_REVIEW_REWARD = 30
export const STARTING_BALANCE = 300

export const TOKEN_BUNDLES = [
  { id: 'small', priceUSD: 0.8, tokens: 100 },
  { id: 'large', priceUSD: 4.0, tokens: 600 },
]
