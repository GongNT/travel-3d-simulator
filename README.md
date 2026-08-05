# Nice, France - AI Travel & Walk Simulator

Final project demo: describe your trip preferences, get a ranked recommendation
across a handful of real spots in Nice, France from a deterministic scoring
engine, then walk the top spot as a stylized, procedurally generated 3D scene
built from that spot's visitor reviews.

This is **not** a photorealistic reconstruction of the real location - turning
review text into an accurate 3D replica of a physical place isn't something
current tools can do. Instead, an LLM reads the curated reviews for a spot and
extracts structured "ambiance" attributes (ground type, sky mood, color
palette, and a handful of props from a fixed catalog), and a deterministic
layout algorithm places those props into a walkable Three.js scene.

## How it works

1. **Preferences -> weights**: `src/lib/preferences.js` sends your free-text
   description to an LLM and gets back structured weights (budget, time,
   category preferences).
2. **Scoring engine**: `src/lib/scoring.js` is a deterministic weighted
   multi-criteria scorer - no LLM involved - that ranks the curated spots in
   `src/data/spots.js` against your weights and explains the ranking.
3. **Reviews -> ambiance**: when you choose to "walk" a spot,
   `src/lib/ambiance.js` sends that spot's curated reviews to an LLM, which
   picks a ground type, sky mood, color palette, and 3-6 props from a fixed
   catalog (`src/three/propCatalog.js`) that fit the reviews.
4. **Procedural scene**: `src/three/SceneGenerator.jsx` deterministically
   places the chosen props (seeded by spot id, so it's stable across
   reloads) using one of a few layout algorithms (scatter / lined path /
   radial cluster / perimeter), built from stylized low-poly components in
   `src/three/Props.jsx`.
5. **Walk**: `src/three/WalkController.jsx` gives first-person WASD movement
   with mouse-look (click the scene to lock the pointer, Esc to release).

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
  review text - no live review API is used.
- The 3D scenes are stylized/low-poly and driven by a fixed prop catalog, not
  a reconstruction of the actual physical location.
- Pointer Lock (mouse-look) requires a real click from the user in a
  supported browser; some automated/embedded browser contexts restrict the
  Pointer Lock API.
