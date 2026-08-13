const pptxgen = require('pptxgenjs');
const path = require('path');

const FIG = path.join(__dirname, 'figures');
const GITHUB_URL = 'https://github.com/GongNT/travel-3d-simulator';

// Palette lifted from the app's own ocean/forest/sun theme (App.css variables)
const OCEAN_DEEP = '0B4F6C';
const OCEAN = '0C8599';
const FOREST = '2D6A4F';
const FOREST_DEEP = '1B4332';
const SUN = 'F4A300';
const SUN_LIGHT = 'FFCF5C';
const CORAL = 'F2724B';
const SAND = 'FDF6E6';
const INK = '1F2D27';
const INK_SOFT = '4A5D55';
const WHITE = 'FFFFFF';

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.3 x 7.5 in

const SAFE_HEADER = 'Cambria';
const SAFE_BODY = 'Calibri';

function darkBg(slide) {
  slide.background = { color: OCEAN_DEEP };
}
function lightBg(slide) {
  slide.background = { color: WHITE };
}

function footer(slide, dark = false) {
  slide.addText(GITHUB_URL, {
    x: 0.5, y: 7.12, w: 6, h: 0.3,
    fontFace: SAFE_BODY, fontSize: 10, color: dark ? 'CFE3E8' : '8A9A93', margin: 0,
  });
}

// A small illustrated icon inside a colored circle badge - the deck's
// recurring travel motif (map pin / chat / plane / ring / star), built from
// plain shapes so it needs no external icon assets.
function iconBadge(slide, x, y, size, bg, icon) {
  slide.addShape('ellipse', { x, y, w: size, h: size, fill: { color: bg }, line: { type: 'none' } });
  const cx = x + size / 2;
  const cy = y + size / 2;
  const g = size * 0.52;

  if (icon === 'pin') {
    const headR = g * 0.3;
    slide.addShape('ellipse', {
      x: cx - headR, y: y + size * 0.22, w: headR * 2, h: headR * 2,
      fill: { color: WHITE }, line: { type: 'none' },
    });
    slide.addShape('triangle', {
      x: cx - headR * 0.8, y: cy - headR * 0.1, w: headR * 1.6, h: g * 0.5,
      fill: { color: WHITE }, line: { type: 'none' }, flipV: true,
    });
  } else if (icon === 'chat') {
    slide.addShape('roundRect', {
      x: cx - g * 0.55, y: cy - g * 0.42, w: g * 1.1, h: g * 0.72, rectRadius: 0.05,
      fill: { color: WHITE }, line: { type: 'none' },
    });
    slide.addShape('triangle', {
      x: cx - g * 0.3, y: cy + g * 0.16, w: g * 0.28, h: g * 0.26,
      fill: { color: WHITE }, line: { type: 'none' },
    });
  } else if (icon === 'ring') {
    slide.addShape('donut', {
      x: cx - g * 0.5, y: cy - g * 0.5, w: g, h: g,
      fill: { color: WHITE }, line: { type: 'none' },
    });
  } else if (icon === 'star') {
    slide.addShape('star5', {
      x: cx - g * 0.5, y: cy - g * 0.5, w: g, h: g,
      fill: { color: WHITE }, line: { type: 'none' },
    });
  } else if (icon === 'plane') {
    slide.addShape('triangle', {
      x: cx - g * 0.5, y: cy - g * 0.35, w: g, h: g * 0.7,
      fill: { color: WHITE }, line: { type: 'none' }, rotate: 90,
    });
  } else if (icon === 'doc') {
    slide.addShape('roundRect', {
      x: cx - g * 0.4, y: cy - g * 0.5, w: g * 0.8, h: g, rectRadius: 0.04,
      fill: { color: WHITE }, line: { type: 'none' },
    });
  }
}

// A tilted "photo" card with a colored border and soft shadow - the deck's
// stand-in for a polaroid/snapshot treatment on every app screenshot.
function photoCard(slide, imgPath, x, y, w, h, rotate, accent) {
  const pad = 0.14;
  slide.addShape('rect', {
    x: x - pad, y: y - pad, w: w + pad * 2, h: h + pad * 2,
    fill: { color: WHITE }, line: { color: accent, width: 1.5 },
    rotate,
    shadow: { type: 'outer', color: '1F2D27', opacity: 0.45, blur: 7, offset: 3, angle: 90 },
  });
  slide.addImage({ path: imgPath, x, y, w, h, rotate });
}

// A dashed "flight path" with waypoint pins and a small plane, arriving near
// a fixed point - the title/closing motif, echoing the travel-brochure
// dotted-route convention.
function flightPath(slide, opts = {}) {
  const { x1 = 0.9, y1 = 6.55, x2 = 4.6, y2 = 6.05, color = SUN_LIGHT, planeRotate = 305 } = opts;
  slide.addShape('line', {
    x: x1, y: y2, w: x2 - x1, h: y1 - y2,
    line: { color, width: 2, dashType: 'dash' },
    flipV: true,
  });
  ;[[x1, y1], [(x1 + x2) / 2, (y1 + y2) / 2]].forEach(([px, py]) => {
    slide.addShape('ellipse', { x: px - 0.05, y: py - 0.05, w: 0.1, h: 0.1, fill: { color }, line: { type: 'none' } });
  });
  slide.addShape('triangle', {
    x: x2 - 0.13, y: y2 - 0.13, w: 0.26, h: 0.26,
    fill: { color }, line: { type: 'none' }, rotate: planeRotate,
  });
}

// ---------- 1. Title ----------
{
  const slide = pres.addSlide();
  darkBg(slide);
  slide.addShape('ellipse', { x: 10.6, y: -1.3, w: 3.4, h: 3.4, fill: { color: SUN, transparency: 15 }, line: { type: 'none' } });
  flightPath(slide, { x1: 0.9, y1: 1.05, x2: 3.0, y2: 0.55, color: SUN_LIGHT, planeRotate: 305 });
  slide.addText('CNR', {
    x: 0.9, y: 1.75, w: 10, h: 1.0, fontFace: SAFE_HEADER, fontSize: 56, bold: true, color: WHITE, margin: 0,
  });
  slide.addText('CRAFT N ROAM', {
    x: 0.9, y: 2.65, w: 10, h: 0.5, fontFace: SAFE_BODY, fontSize: 18, bold: true, color: SUN_LIGHT, charSpacing: 4, margin: 0,
  });
  slide.addText('AI Travel Decision Simulator & 3D Walk', {
    x: 0.9, y: 3.2, w: 11.2, h: 0.8, fontFace: SAFE_HEADER, fontSize: 30, bold: true, color: 'CFE3E8', margin: 0,
  });
  slide.addText('Craft a transparent plan. Roam the winner in 3D.', {
    x: 0.9, y: 4.0, w: 10.5, h: 0.6, fontFace: SAFE_BODY, fontSize: 18, italic: true, color: 'CFE3E8', margin: 0,
  });
  slide.addText('Nonthapat T.  ·  Jeeraporn Y.  ·  Chaiphan N.  ·  Jirun T.', {
    x: 0.9, y: 5.9, w: 11.5, h: 0.4, fontFace: SAFE_BODY, fontSize: 15, color: WHITE, margin: 0,
  });
  slide.addText('Generative AI  ·  Final Project Presentation', {
    x: 0.9, y: 6.25, w: 10, h: 0.4, fontFace: SAFE_BODY, fontSize: 13, color: '9FB8B0', margin: 0,
  });
  footer(slide, true);
}

// ---------- 2. The problem ----------
{
  const slide = pres.addSlide();
  darkBg(slide);
  slide.addText('The Problem', { x: 0.9, y: 0.6, w: 8, h: 0.7, fontFace: SAFE_HEADER, fontSize: 32, bold: true, color: WHITE, margin: 0 });
  slide.addText(
    'Trip planning means balancing budget, time, and taste across dozens of options — and every existing tool skips the reasoning.',
    { x: 0.9, y: 1.5, w: 11.4, h: 0.9, fontFace: SAFE_BODY, fontSize: 17, color: 'CFE3E8', margin: 0 },
  );

  const cards = [
    { t: 'Listing sites', d: 'Google Maps, TripAdvisor, Yelp show everything and decide nothing.', icon: 'pin' },
    { t: 'AI chatbots', d: 'One suggestion, no visible tradeoffs — a black box.', icon: 'chat' },
    { t: 'Either way', d: 'No way to get a real feel for a place before you commit.', icon: 'ring' },
  ];
  cards.forEach((c, i) => {
    const x = 0.9 + i * 3.95;
    slide.addShape('roundRect', { x, y: 3.0, w: 3.65, h: 2.9, rectRadius: 0.12, fill: { color: OCEAN, transparency: 70 }, line: { type: 'none' } });
    iconBadge(slide, x + 0.3, y_top(3.0), 0.55, SUN, c.icon);
    slide.addText(c.t, { x: x + 1.05, y: 3.18, w: 2.3, h: 0.55, fontFace: SAFE_HEADER, fontSize: 17, bold: true, color: SUN_LIGHT, margin: 0, valign: 'middle' });
    slide.addText(c.d, { x: x + 0.3, y: 3.85, w: 3.05, h: 1.9, fontFace: SAFE_BODY, fontSize: 14, color: WHITE, margin: 0 });
  });
  footer(slide, true);
}
function y_top(y) { return y + 0.22 }

// ---------- 3. Our answer ----------
{
  const slide = pres.addSlide();
  lightBg(slide);
  slide.addText('Craft, Then Roam', { x: 0.9, y: 0.55, w: 11, h: 0.7, fontFace: SAFE_HEADER, fontSize: 30, bold: true, color: INK, margin: 0 });
  slide.addText('A transparent, traveler-adjustable decision engine, followed by a review-grounded 3D preview of the winner.', {
    x: 0.9, y: 1.3, w: 11.2, h: 0.5, fontFace: SAFE_BODY, fontSize: 15, italic: true, color: INK_SOFT, margin: 0,
  });

  // Lane 1 card
  slide.addShape('roundRect', { x: 0.9, y: 2.05, w: 5.55, h: 4.6, rectRadius: 0.12, fill: { color: SAND }, line: { color: OCEAN, width: 1.25 } });
  iconBadge(slide, 1.2, 2.3, 0.55, OCEAN, 'chat');
  slide.addText('1. Craft the plan', { x: 1.95, y: 2.3, w: 4.2, h: 0.55, fontFace: SAFE_HEADER, fontSize: 19, bold: true, color: OCEAN_DEEP, margin: 0, valign: 'middle' });
  const l1 = [
    'Traveler describes their trip in free text (69 tokens)',
    'LLM parses it into structured weights',
    'Deterministic engine scores & ranks 5 curated spots',
    'Sliders let travelers fine-tune live, for free',
  ];
  slide.addText(l1.map((t, i) => ({ text: t, options: { bullet: { code: '2022' }, breakLine: i < l1.length - 1, color: INK, fontSize: 14.5 } })), {
    x: 1.25, y: 3.05, w: 4.9, h: 3.4, fontFace: SAFE_BODY, paraSpaceAfter: 10, margin: 0,
  });

  // Lane 2 card
  slide.addShape('roundRect', { x: 6.85, y: 2.05, w: 5.55, h: 4.6, rectRadius: 0.12, fill: { color: SAND }, line: { color: FOREST, width: 1.25 } });
  iconBadge(slide, 7.15, 2.3, 0.55, FOREST, 'pin');
  slide.addText('2. Roam in 3D', { x: 7.9, y: 2.3, w: 4.2, h: 0.55, fontFace: SAFE_HEADER, fontSize: 19, bold: true, color: FOREST_DEEP, margin: 0, valign: 'middle' });
  const l2 = [
    'Traveler unlocks all spots in 3D once (89 tokens)',
    'LLM reads that spot\'s curated reviews',
    'Extracts ground / sky / palette / props (fixed catalog)',
    'Seeded layout builds a walkable Three.js scene',
  ];
  slide.addText(l2.map((t, i) => ({ text: t, options: { bullet: { code: '2022' }, breakLine: i < l2.length - 1, color: INK, fontSize: 14.5 } })), {
    x: 7.2, y: 3.05, w: 4.9, h: 3.4, fontFace: SAFE_BODY, paraSpaceAfter: 10, margin: 0,
  });
  footer(slide, false);
}

// ---------- 4. Demo: craft the plan ----------
{
  const slide = pres.addSlide();
  lightBg(slide);
  slide.addText('Demo — Craft a Transparent Plan', { x: 0.6, y: 0.4, w: 10, h: 0.6, fontFace: SAFE_HEADER, fontSize: 25, bold: true, color: INK, margin: 0 });
  {
    const w = 6.9, h = w * (800 / 1280);
    photoCard(slide, `${FIG}/cnr_05_editor_slide.png`, 5.75, 1.35, w, h, 1.2, OCEAN);
  }

  slide.addText('"A relaxed five-hour trip, mid-range budget, good food"', {
    x: 0.6, y: 1.3, w: 4.7, h: 0.7, fontFace: SAFE_BODY, fontSize: 13.5, italic: true, color: INK_SOFT, margin: 0,
  });
  const pts = [
    'Promenade des Anglais scores 0.93 — strong match, perfect cost & time fit',
    'Sliders adjust budget, time, and category balance',
    'Re-ranks instantly — no extra tokens, no black box',
  ];
  slide.addText(pts.map((t, i) => ({ text: t, options: { bullet: { code: '2022' }, breakLine: i < pts.length - 1, color: INK, fontSize: 14 } })), {
    x: 0.6, y: 2.1, w: 4.7, h: 2.6, fontFace: SAFE_BODY, paraSpaceAfter: 12, margin: 0,
  });
  footer(slide, false);
}

// ---------- 5. Demo: roam in 3D ----------
{
  const slide = pres.addSlide();
  darkBg(slide);
  slide.addText('Demo — Roam the Winner', { x: 0.6, y: 0.4, w: 7, h: 0.6, fontFace: SAFE_HEADER, fontSize: 26, bold: true, color: WHITE, margin: 0 });
  {
    const w = 6.6, h = w * (900 / 1280);
    photoCard(slide, `${FIG}/cnr_04_walk.png`, 6.1, 1.4, w, h, -1.4, SUN);
  }

  const pts = [
    'LLM reads Promenade des Anglais\' reviews',
    'Picks ground, sky, palette, and props from a fixed catalog',
    'A seeded algorithm places everything — same input, same scene',
    'Explorable in first person: WASD + mouse-look',
    'Share 3 photos + a review per spot, earn 30 tokens back',
  ];
  slide.addText(pts.map((t, i) => ({ text: t, options: { bullet: { code: '2022' }, breakLine: i < pts.length - 1, color: WHITE, fontSize: 14.5 } })), {
    x: 0.6, y: 1.5, w: 5, h: 4.0, fontFace: SAFE_BODY, paraSpaceAfter: 14, margin: 0,
  });
  slide.addText('Stylized, not photorealistic — by design (see limitations).', {
    x: 0.6, y: 6.1, w: 5, h: 0.7, fontFace: SAFE_BODY, fontSize: 12.5, italic: true, color: '9FB8B0', margin: 0,
  });
  footer(slide, true);
}

// ---------- 6. Architecture ----------
{
  const slide = pres.addSlide();
  lightBg(slide);
  slide.addText('How the AI Is Used', { x: 0.6, y: 0.35, w: 8, h: 0.6, fontFace: SAFE_HEADER, fontSize: 26, bold: true, color: INK, margin: 0 });
  slide.addText('Three lanes of narrow LLM steps; every decision and every agent tool call bottoms out in ordinary deterministic code.', {
    x: 0.6, y: 0.95, w: 12, h: 0.4, fontFace: SAFE_BODY, fontSize: 14, italic: true, color: INK_SOFT, margin: 0,
  });
  {
    const archW = 9.6;
    const archH = archW * (760 / 1300);
    slide.addImage({ path: `${FIG}/architecture.png`, x: (13.33 - archW) / 2, y: 1.55, w: archW, h: archH });
  }
  footer(slide, false);
}

// ---------- 6b. Demo: concierge agent ----------
{
  const slide = pres.addSlide();
  darkBg(slide);
  slide.addText('Demo — Ask the Concierge (Lane 3)', { x: 0.6, y: 0.4, w: 10, h: 0.6, fontFace: SAFE_HEADER, fontSize: 25, bold: true, color: WHITE, margin: 0 });
  slide.addText('A real tool-calling agent - four tools, each a thin wrapper around a function the app already trusted.', {
    x: 0.6, y: 0.95, w: 12, h: 0.4, fontFace: SAFE_BODY, fontSize: 13.5, italic: true, color: 'CFE3E8', margin: 0,
  });
  {
    const imgW = 7.4;
    const imgH = imgW * (270 / 912);
    photoCard(slide, `${FIG}/concierge_chat.png`, 5.0, 2.5, imgW, imgH, 0.9, SUN);
  }
  const pts = [
    'adjust_plan - "make it cheaper" re-ranks live',
    'get_spot_details - answers grounded in curated reviews',
    'unlock_and_walk - "walk me around the market" opens the 3D scene',
    'download_report - saves the plan report',
  ];
  slide.addText(pts.map((t, i) => ({ text: t, options: { bullet: { code: '2022' }, breakLine: i < pts.length - 1, color: WHITE, fontSize: 14.5 } })), {
    x: 0.6, y: 1.6, w: 3.9, h: 4.5, fontFace: SAFE_BODY, paraSpaceAfter: 16, margin: 0,
  });
  slide.addText('Capped at 4 tool-call rounds per turn - no runaway loops.', {
    x: 0.6, y: 6.3, w: 4, h: 0.6, fontFace: SAFE_BODY, fontSize: 12, italic: true, color: '9FB8B0', margin: 0,
  });
  footer(slide, true);
}

// ---------- 7. Design principle ----------
{
  const slide = pres.addSlide();
  lightBg(slide);
  slide.addText('One Design Principle', { x: 0.9, y: 0.6, w: 9, h: 0.7, fontFace: SAFE_HEADER, fontSize: 30, bold: true, color: INK, margin: 0 });
  slide.addText('Lanes 1-2: the LLM translates, it never decides. Lane 3 may act - but only through tools that wrap trusted code.', {
    x: 0.9, y: 1.35, w: 11, h: 0.6, fontFace: SAFE_BODY, fontSize: 15.5, italic: true, color: INK_SOFT, margin: 0,
  });

  slide.addShape('roundRect', { x: 0.9, y: 2.35, w: 5.55, h: 3.9, rectRadius: 0.12, fill: { color: SUN, transparency: 88 }, line: { color: SUN, width: 1.25 } });
  iconBadge(slide, 1.2, 2.6, 0.5, SUN, 'star');
  slide.addText('LLM calls', { x: 1.85, y: 2.6, w: 4, h: 0.5, fontFace: SAFE_HEADER, fontSize: 19, bold: true, color: 'B57A00', margin: 0, valign: 'middle' });
  const llmPts = ['Free text -> structured weights', 'Reviews -> structured ambiance spec', 'Fixed JSON schema, fixed enum catalogs', 'Validated & clamped before use'];
  slide.addText(llmPts.map((t, i) => ({ text: t, options: { bullet: { code: '2022' }, breakLine: i < llmPts.length - 1, color: INK, fontSize: 14.5 } })), {
    x: 1.25, y: 3.35, w: 4.9, h: 2.8, fontFace: SAFE_BODY, paraSpaceAfter: 10, margin: 0,
  });

  slide.addShape('roundRect', { x: 6.85, y: 2.35, w: 5.55, h: 3.9, rectRadius: 0.12, fill: { color: FOREST, transparency: 90 }, line: { color: FOREST, width: 1.25 } });
  iconBadge(slide, 7.15, 2.6, 0.5, FOREST, 'ring');
  slide.addText('Deterministic code', { x: 7.8, y: 2.6, w: 4.3, h: 0.5, fontFace: SAFE_HEADER, fontSize: 19, bold: true, color: FOREST_DEEP, margin: 0, valign: 'middle' });
  const detPts = ['Weighted multi-criteria scoring', 'Live plan-editor re-ranking', 'Seeded PRNG for 3D layout', 'Same inputs -> same outputs, always'];
  slide.addText(detPts.map((t, i) => ({ text: t, options: { bullet: { code: '2022' }, breakLine: i < detPts.length - 1, color: INK, fontSize: 14.5 } })), {
    x: 7.2, y: 3.35, w: 4.9, h: 2.8, fontFace: SAFE_BODY, paraSpaceAfter: 10, margin: 0,
  });
  footer(slide, false);
}

// ---------- 8. Integration issue solved ----------
{
  const slide = pres.addSlide();
  darkBg(slide);
  slide.addText('A Real Integration Bug We Hit', { x: 0.9, y: 0.7, w: 10.5, h: 0.7, fontFace: SAFE_HEADER, fontSize: 28, bold: true, color: WHITE, margin: 0 });
  slide.addText(
    'gpt-5.6-luna rejects function-tool calling combined with its default reasoning_effort on /v1/chat/completions.',
    { x: 0.9, y: 1.6, w: 11.2, h: 0.7, fontFace: SAFE_BODY, fontSize: 16, color: 'CFE3E8', margin: 0 },
  );
  slide.addShape('roundRect', { x: 0.9, y: 2.6, w: 11.2, h: 2.0, rectRadius: 0.1, fill: { color: '062B3D' }, line: { color: OCEAN, width: 1 } });
  slide.addText('invalid_request_error — param: reasoning_effort', {
    x: 1.2, y: 2.85, w: 10.6, h: 0.5, fontFace: 'Courier New', fontSize: 15, color: CORAL, margin: 0,
  });
  slide.addText('"Function tools with reasoning_effort are not supported for gpt-5.6-luna in /v1/chat/completions."', {
    x: 1.2, y: 3.35, w: 10.6, h: 1.1, fontFace: 'Courier New', fontSize: 13, color: 'CFE3E8', margin: 0,
  });
  slide.addText('Fix: request raw JSON (response_format: json_object) instead of tool-calling, and pass reasoning_effort: "none" explicitly.', {
    x: 0.9, y: 4.9, w: 11.2, h: 0.9, fontFace: SAFE_BODY, fontSize: 15, italic: true, color: SUN_LIGHT, margin: 0,
  });
  footer(slide, true);
}

// ---------- 9. Honest limitation ----------
{
  const slide = pres.addSlide();
  darkBg(slide);
  slide.addShape('ellipse', { x: -1.2, y: 4.9, w: 3.2, h: 3.2, fill: { color: CORAL, transparency: 88 }, line: { type: 'none' } });
  slide.addText('One Honest Limitation', { x: 0.9, y: 1.1, w: 10, h: 0.7, fontFace: SAFE_HEADER, fontSize: 30, bold: true, color: WHITE, margin: 0 });
  slide.addText(
    'The 3D scenes are stylized, low-poly interpretations — not photorealistic reconstructions of the real locations.',
    { x: 0.9, y: 2.1, w: 11, h: 1.0, fontFace: SAFE_BODY, fontSize: 20, color: SUN_LIGHT, margin: 0 },
  );
  slide.addText(
    'True 3D reconstruction needs dozens of calibrated, overlapping photos (photogrammetry / NeRF) — not review text or a '
    + 'handful of casual photos. We chose to be upfront about this rather than overclaim, and built a deterministic, '
    + 'review-grounded stylized scene instead. The token economy is the same story: presented in full, built as local '
    + 'state only — no real payment happens anywhere in this demo.',
    { x: 0.9, y: 3.3, w: 10.4, h: 1.6, fontFace: SAFE_BODY, fontSize: 15, color: 'CFE3E8', margin: 0 },
  );
  slide.addText(
    'Also flagged: WASD movement needs a final real-browser verification pass (automated headless testing was inconclusive due to background-tab throttling).',
    { x: 0.9, y: 5.2, w: 10.4, h: 1.0, fontFace: SAFE_BODY, fontSize: 13.5, italic: true, color: '9FB8B0', margin: 0 },
  );
  footer(slide, true);
}

// ---------- 10. Business model ----------
{
  const slide = pres.addSlide();
  lightBg(slide);
  iconBadge(slide, 0.9, 0.48, 0.5, SUN, 'star');
  slide.addText('The Business Model (Presentation Only)', { x: 1.55, y: 0.48, w: 10.5, h: 0.6, fontFace: SAFE_HEADER, fontSize: 27, bold: true, color: INK, margin: 0, valign: 'middle' });
  slide.addText('Simulated in the demo as local app state — no real payment processing exists today.', {
    x: 0.9, y: 1.15, w: 11.2, h: 0.4, fontFace: SAFE_BODY, fontSize: 14, italic: true, color: INK_SOFT, margin: 0,
  });

  const rows = [
    ['Item', 'Price'],
    ['Small token bundle', '$0.80 -> 100 tokens'],
    ['Large token bundle', '$4.00 -> 600 tokens (~17% off)'],
    ['Generate a plan (search)', '69 tokens (~$0.46-0.55)'],
    ['Unlock 3D walking (all spots)', '89 tokens (~$0.60-0.71, one-time)'],
    ['Share 3 photos + a review, per spot', '+30 tokens back'],
  ];
  slide.addTable(rows.map((r, i) => r.map((c) => ({
    text: c,
    options: {
      fontFace: SAFE_BODY, fontSize: 14, color: i === 0 ? WHITE : INK, bold: i === 0,
      fill: i === 0 ? { color: OCEAN_DEEP } : { color: i % 2 === 0 ? SAND : WHITE },
      align: 'left', valign: 'middle',
    },
  }))), {
    x: 0.9, y: 1.8, w: 7.2, colW: [4.2, 3.0], rowH: 0.55, border: { type: 'solid', color: 'E0D6BE', pt: 0.75 },
  });

  slide.addShape('roundRect', { x: 8.5, y: 1.8, w: 3.9, h: 3.3, rectRadius: 0.12, fill: { color: SUN, transparency: 88 }, line: { color: SUN, width: 1.25 } });
  slide.addText('Margin check', { x: 8.8, y: 2.0, w: 3.3, h: 0.45, fontFace: SAFE_HEADER, fontSize: 16, bold: true, color: 'B57A00', margin: 0 });
  slide.addText(
    'Actual LLM cost per search: a fraction of a cent. Priced at 69 tokens (~$0.50), '
    + 'that is roughly two orders of magnitude of margin before hosting, support, and refunds.',
    { x: 8.8, y: 2.55, w: 3.3, h: 2.4, fontFace: SAFE_BODY, fontSize: 12.5, color: INK, margin: 0 },
  );
  footer(slide, false);
}

// ---------- 11. Roadmap ----------
{
  const slide = pres.addSlide();
  darkBg(slide);
  slide.addText("What's Next", { x: 0.9, y: 0.55, w: 8, h: 0.7, fontFace: SAFE_HEADER, fontSize: 30, bold: true, color: WHITE, margin: 0 });

  slide.addShape('roundRect', { x: 0.9, y: 1.4, w: 11.2, h: 1.7, rectRadius: 0.1, fill: { color: SUN, transparency: 85 }, line: { color: SUN, width: 1.25 } });
  iconBadge(slide, 1.15, 1.6, 0.48, SUN, 'star');
  slide.addText('Headline idea: crowdsourced photos, real rewards', { x: 1.8, y: 1.6, w: 10.1, h: 0.45, fontFace: SAFE_HEADER, fontSize: 17, bold: true, color: SUN_LIGHT, margin: 0, valign: 'middle' });
  slide.addText(
    'Travelers upload up to 3 of their own photos per spot -> vision model extracts richer ambiance -> traveler earns a real 30-token reward per spot. '
    + 'Fully legitimate (user-submitted, not scraped). Needs accounts, storage, and moderation — a real backend, deliberately out of scope for now.',
    { x: 1.2, y: 2.1, w: 10.6, h: 0.95, fontFace: SAFE_BODY, fontSize: 13, color: WHITE, margin: 0 },
  );

  // Timeline of the remaining roadmap items
  const items = ['Real payments', 'Server-side API key', 'Booking add-ons', 'More destinations', 'Mobile controls', 'Usability study'];
  const tlY = 5.15;
  const tlX1 = 1.3;
  const tlX2 = 12.0;
  slide.addShape('line', { x: tlX1, y: tlY, w: tlX2 - tlX1, h: 0.001, line: { color: SUN_LIGHT, width: 2, dashType: 'dash' } });
  items.forEach((label, i) => {
    const t = i / (items.length - 1);
    const px = tlX1 + t * (tlX2 - tlX1);
    const above = i % 2 === 0;
    slide.addShape('ellipse', { x: px - 0.07, y: tlY - 0.07, w: 0.14, h: 0.14, fill: { color: SUN }, line: { color: WHITE, width: 1.25 } });
    slide.addText(label, {
      x: px - 1.05, y: above ? tlY - 0.85 : tlY + 0.22, w: 2.1, h: 0.65,
      fontFace: SAFE_BODY, fontSize: 11.5, color: 'CFE3E8', align: 'center',
      valign: above ? 'bottom' : 'top', margin: 0,
    });
  });
  slide.addText('Roadmap timeline (details in the report)', {
    x: 0.9, y: 6.55, w: 6, h: 0.4, fontFace: SAFE_BODY, fontSize: 11, italic: true, color: '9FB8B0', margin: 0,
  });
  footer(slide, true);
}

// ---------- 12. Closing ----------
{
  const slide = pres.addSlide();
  darkBg(slide);
  slide.addShape('ellipse', { x: 10.6, y: 4.6, w: 3.4, h: 3.4, fill: { color: SUN, transparency: 15 }, line: { type: 'none' } });
  flightPath(slide, { x1: 8.6, y1: 6.7, x2: 10.7, y2: 5.85, color: SUN_LIGHT, planeRotate: 305 });
  slide.addText('Thank you', { x: 0.9, y: 2.6, w: 9, h: 1.0, fontFace: SAFE_HEADER, fontSize: 44, bold: true, color: WHITE, margin: 0 });
  slide.addText('Craft a transparent plan. Roam the winner in 3D.', {
    x: 0.9, y: 3.55, w: 9.5, h: 0.6, fontFace: SAFE_BODY, fontSize: 17, italic: true, color: 'CFE3E8', margin: 0,
  });
  slide.addText(GITHUB_URL, { x: 0.9, y: 4.5, w: 8, h: 0.5, fontFace: SAFE_BODY, fontSize: 16, color: SUN_LIGHT, margin: 0 });
}

pres.writeFile({ fileName: path.join(__dirname, 'Final_Presentation.pptx') }).then(() => {
  console.log('written');
});
