// Fixed vocabulary of reusable stylized 3D props. The ambiance-extraction LLM
// call is constrained to pick from this list (rather than inventing arbitrary
// geometry or coordinates), and SceneGenerator procedurally places instances.

export const PROP_TYPES = [
  'palmTree',
  'pineTree',
  'beachChair',
  'stoneBuilding',
  'facadeBuilding',
  'marketStall',
  'flowerStall',
  'lantern',
  'bench',
  'fountain',
  'castleRuinWall',
  'sailboat',
  'cafeTable',
  'archway',
  'stripedAwning',
  'bellTower',
  'stringLights',
]

export const GROUND_TYPES = ['sand', 'cobblestone', 'grass', 'stonePlaza', 'harborDeck']

export const SKY_MOODS = ['sunnyBlue', 'goldenHour', 'overcast', 'twilight']

export const LAYOUTS = ['scatter', 'linedPath', 'radialCluster', 'perimeter', 'narrowAlley']

export const DENSITIES = ['sparse', 'moderate', 'dense']
