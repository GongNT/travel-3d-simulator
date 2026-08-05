// Curated demo dataset: a handful of named spots in Nice, France.
// Each spot has structured attributes (for the scoring engine) and a small
// set of authored reviews (for the LLM ambiance-extraction layer that drives
// the procedural 3D scene). This is a fixed demo dataset, not a live API.

export const SPOTS = [
  {
    id: 'promenade-des-anglais',
    name: 'Promenade des Anglais',
    category: 'relax',
    tags: ['relax', 'beach', 'scenic', 'walking'],
    costLevel: 1, // 1 (free/cheap) - 5 (expensive)
    durationHours: 2,
    tagline: 'The iconic seafront promenade along the Baie des Anges.',
    reviews: [
      "Walked the promenade at sunset and it was breathtaking - the light on the water, the palm trees, the old hotels lining the bay. Very relaxed, mostly couples and joggers.",
      "Long stretch of pebble beach with the famous blue chairs along the walkway. Not crowded in the early morning, great for a slow walk with coffee.",
      "Beautiful but touristy in peak afternoon. The Belle Epoque buildings across the road are stunning, especially the Negresco hotel with its pink dome.",
      "Free to walk, no entry cost. Rollerbladers and cyclists share the path so watch your footing, otherwise very peaceful and open.",
    ],
  },
  {
    id: 'vieux-nice',
    name: 'Vieux Nice (Old Town)',
    category: 'culture',
    tags: ['culture', 'food', 'crowded', 'historic'],
    costLevel: 2,
    durationHours: 3,
    tagline: 'A maze of narrow pastel-colored streets, markets, and cafes.',
    reviews: [
      "Got pleasantly lost in the tiny alleys - tall ochre and terracotta buildings, laundry lines overhead, tiny family-run bistros everywhere.",
      "Loud and lively, especially around lunchtime. Smell of fresh socca (chickpea pancake) and lemon everywhere. Definitely crowded on weekends.",
      "The narrow cobblestone streets open up suddenly into small sunlit squares with fountains and outdoor seating. Felt very authentic, not overly polished.",
      "Cheap eats if you know where to look - small stalls selling pissaladiere and fresh pasta. Great atmosphere in the evening with string lights strung between buildings.",
    ],
  },
  {
    id: 'castle-hill',
    name: 'Castle Hill (Colline du Chateau)',
    category: 'adventure',
    tags: ['adventure', 'scenic', 'hike', 'viewpoint'],
    costLevel: 1,
    durationHours: 2,
    tagline: 'A hilltop park with ruins, a waterfall, and panoramic views.',
    reviews: [
      "Steep walk up through pine trees and old stone ruins, but the view over the whole bay at the top is unbeatable, especially for sunrise.",
      "There's a small waterfall near the top and a lot of shaded, quiet paths - felt like a proper little forest hike above the city.",
      "Free entry, though you can also take a lift up for a small fee if you don't want to climb. Some uneven stone steps, wear real shoes.",
      "Fewer crowds than the promenade below. Good spot for a picnic overlooking the red rooftops of the old town and the harbor.",
    ],
  },
  {
    id: 'cours-saleya-market',
    name: 'Cours Saleya Market',
    category: 'food',
    tags: ['food', 'culture', 'crowded', 'market'],
    costLevel: 2,
    durationHours: 1,
    tagline: 'A bustling open-air flower and food market in the old town.',
    reviews: [
      "Rows of flower stalls, olives, spices, and local cheese - very colorful and photogenic, but tight and crowded by mid-morning.",
      "Great for sampling local specialties like tapenade and candied fruit straight from the stall. Loud haggling and lots of energy.",
      "Turns into an antiques market on Mondays instead of flowers - worth checking which day you visit. Cafes ring the square for people-watching.",
      "Not cheap if you sit down to eat at the surrounding restaurants, but the market stalls themselves are affordable and fun to browse.",
    ],
  },
  {
    id: 'port-de-nice',
    name: 'Port de Nice (Port Lympia)',
    category: 'relax',
    tags: ['relax', 'scenic', 'quiet', 'harbor'],
    costLevel: 1,
    durationHours: 1,
    tagline: 'A quiet pastel-colored harbor with yachts and fishing boats.',
    reviews: [
      "Much quieter than the main promenade - pastel yellow and orange buildings wrap around a calm harbor full of sailboats.",
      "Nice place for an early evening walk, fewer tourists, good spot to watch the boats come in without the crowds of the old town.",
      "Small local restaurants around the harbor edge, more relaxed pace, felt like where locals actually go rather than tourists.",
      "Not much 'to do' exactly, but very calm and photogenic - good place to decompress after the busy market or old town streets.",
    ],
  },
]
