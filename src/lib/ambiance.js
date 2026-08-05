import { chatJSON } from './openai'
import { PROP_TYPES, GROUND_TYPES, SKY_MOODS, LAYOUTS, DENSITIES } from '../three/propCatalog'

const SYSTEM_PROMPT = `You read a handful of visitor reviews for a real-world location and translate them into \
a structured spec for a STYLIZED, low-poly 3D scene - not a photorealistic reconstruction. You are choosing \
from a fixed catalog of building blocks, not inventing new geometry.

If you recognize the named location from your own knowledge (not just the reviews), use that knowledge to \
pick a more accurate palette and prop mix - e.g. the real Promenade des Anglais in Nice has pastel cream/pink \
building facades and a turquoise sea, not generic blue. Fall back to the reviews alone if you don't recognize \
the place.

Respond with a single JSON object, no markdown, matching exactly this shape:

{
  "groundType": one of ${JSON.stringify(GROUND_TYPES)},
  "skyMood": one of ${JSON.stringify(SKY_MOODS)},
  "layout": one of ${JSON.stringify(LAYOUTS)},
  "density": one of ${JSON.stringify(DENSITIES)},
  "palette": { "primary": "<hex color>", "secondary": "<hex color>", "accent": "<hex color>" },
  "props": [ { "type": one of ${JSON.stringify(PROP_TYPES)}, "count": <integer 1-12> }, ... pick 3-6 prop types that fit the reviews ],
  "moodSummary": "<one sentence describing the vibe you extracted from the reviews>"
}

Pick colors that genuinely match the described setting (e.g. warm ochre/terracotta for old-town streets, \
blue/sand for a beach, green/grey stone for a hilltop ruin). Only use prop types and enum values from the \
lists given - do not invent new ones.`

export async function extractAmbiance(spot) {
  const reviewsBlock = spot.reviews.map((r, i) => `${i + 1}. ${r}`).join('\n')
  const userPrompt = `Location: ${spot.name}\nCategory: ${spot.category}\n\nReviews:\n${reviewsBlock}`

  const result = await chatJSON([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: userPrompt },
  ])

  return sanitize(result)
}

function sanitize(raw) {
  const groundType = GROUND_TYPES.includes(raw.groundType) ? raw.groundType : 'stonePlaza'
  const skyMood = SKY_MOODS.includes(raw.skyMood) ? raw.skyMood : 'sunnyBlue'
  const layout = LAYOUTS.includes(raw.layout) ? raw.layout : 'scatter'
  const density = DENSITIES.includes(raw.density) ? raw.density : 'moderate'

  const props = Array.isArray(raw.props)
    ? raw.props
        .filter((p) => PROP_TYPES.includes(p.type))
        .map((p) => ({ type: p.type, count: clamp(Number(p.count) || 3, 1, 12) }))
        .slice(0, 6)
    : []

  const palette = {
    primary: isHex(raw.palette?.primary) ? raw.palette.primary : '#d9c9a3',
    secondary: isHex(raw.palette?.secondary) ? raw.palette.secondary : '#8fa9c9',
    accent: isHex(raw.palette?.accent) ? raw.palette.accent : '#e0784a',
  }

  return {
    groundType,
    skyMood,
    layout,
    density,
    palette,
    props: props.length ? props : [{ type: 'bench', count: 3 }],
    moodSummary: typeof raw.moodSummary === 'string' ? raw.moodSummary : '',
  }
}

function isHex(v) {
  return typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v)
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}
