# CNR - Craft N Roam

Final project demo: craft your trip by describing what you're interested in,
get a transparent, ranked plan across a handful of real spots in Nice, France
from a deterministic scoring engine you can fine-tune live, then roam the top
spot as a stylized, procedurally generated 3D scene built from that spot's
visitor reviews.

This is **not** a photorealistic reconstruction of the real location - turning
review text into an accurate 3D replica of a physical place isn't something
current tools can do. Instead, an LLM reads the curated reviews for a spot and
extracts structured "ambiance" attributes (ground type, sky mood, color
palette, and a handful of props from a fixed catalog), and a deterministic
layout algorithm places those props into a walkable Three.js scene.

## How it works

1. **Destination**: locked to Nice, France for this demo (`DestinationStep`) -
   more destinations are a roadmap item, not built yet.
2. **Interests -> weights**: `src/lib/preferences.js` sends your free-text
   description to an LLM and gets back structured weights (budget, time,
   category preferences). This step costs simulated tokens (see below).
3. **Scoring engine**: `src/lib/scoring.js` is a deterministic weighted
   multi-criteria scorer - no LLM involved - that ranks the curated spots in
   `src/data/spots.js` against your weights and explains the ranking.
4. **Live plan editor**: `src/components/PlanEditor.jsx` exposes the same
   weights as sliders - budget, time, and category balance - and re-runs the
   deterministic scoring engine on every change, instantly and at no extra
   token cost.
5. **Travel time**: each spot in `src/data/spots.js` carries a
   `travelTimeMinutes` estimate (approximate walking time from Nice's
   central square, Place Massena), shown on every result card alongside the
   visit duration.
6. **Plan report**: the "Download plan report" button
   (`src/lib/planReport.js`) compiles the destination, your interests, the
   full ranked plan with travel time and score breakdown, and the
   explanation into a downloadable `.txt` file - built entirely from data
   already on screen, so it costs no extra tokens or LLM calls.
7. **Reviews -> ambiance**: when you choose to "walk" a spot (a separate
   token cost), `src/lib/ambiance.js` sends that spot's curated reviews to an
   LLM, which picks a ground type, sky mood, color palette, and 3-6 props
   from a fixed catalog (`src/three/propCatalog.js`) that fit the reviews.
8. **Procedural scene**: `src/three/SceneGenerator.jsx` deterministically
   places the chosen props (seeded by spot id, so it's stable across
   reloads) using one of a few layout algorithms (scatter / lined path /
   radial cluster / perimeter), built from stylized low-poly components in
   `src/three/Props.jsx`.
9. **Walk**: `src/three/WalkController.jsx` gives first-person WASD movement
   with mouse-look (click the scene to lock the pointer, Esc to release).

## Simulated token economy (presentation only - no real payment)

CNR's pitched business model is token-based: $0.80 -> 100 tokens, $4.00 -> 600
tokens, a plan search costs 69 tokens, and a one-time 89-token payment unlocks
3D walking for every spot for the rest of the session (not per spot). Sharing
3 photos + a review for a spot refunds 30 tokens, and can be repeated per
spot. **None of this moves real money** - `src/lib/tokens.js` holds the
constants, and the
whole balance lives in local React state (`App.jsx`) purely to make the demo
feel like the real product. The "buy tokens" panel just adds to that local
balance; the photo-reward button does the same without any actual photo
upload (that flow is a roadmap item, see below).

## Setup

```bash
npm install
cp .env.example .env
# edit .env and set VITE_OPENAI_API_KEY=sk-...
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

The model used for both LLM calls is set in [`src/lib/openai.js`](src/lib/openai.js):

```js
export const MODEL = 'gpt-5.6-luna'
```

**Note:** `VITE_OPENAI_API_KEY` is never committed - `.env` is gitignored.

## Known limitations

- Demo dataset is a fixed, hand-authored set of 5 spots in Nice with curated
  review text - no live review API is used, and the destination is locked to
  Nice, France.
- The 3D scenes are stylized/low-poly and driven by a fixed prop catalog, not
  a reconstruction of the actual physical location.
- Pointer Lock (mouse-look) requires a real click from the user in a
  supported browser; some automated/embedded browser contexts restrict the
  Pointer Lock API.
- The token economy is entirely simulated client-side state - no real
  payment processing, accounts, or persistence exist in this demo.

## Roadmap (not built - see report for detail)

- Real payment processing and persistent accounts for the token economy.
- Full photo-upload flow: travelers submit their own reference photos, a
  vision-capable model uses them to generate richer, more accurate ambiance
  than review text alone, and the 30-token-per-spot reward becomes real.
- Hotel/flight booking and other token-gated add-on services.
- Expansion beyond the single Nice, France demo dataset.
