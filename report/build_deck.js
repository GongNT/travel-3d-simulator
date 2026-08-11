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

function sunMotif(slide, opts = {}) {
  const { x = 12.1, y = -0.9, size = 2.6, opacity = 88 } = opts;
  slide.addShape('ellipse', {
    x, y, w: size, h: size,
    fill: { color: SUN_LIGHT, transparency: 100 - opacity },
    line: { type: 'none' },
  });
}

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

// ---------- 1. Title ----------
{
  const slide = pres.addSlide();
  darkBg(slide);
  sunMotif(slide, { x: 10.6, y: -1.3, size: 3.4, opacity: 92 });
  slide.addShape('ellipse', { x: 10.6, y: -1.3, w: 3.4, h: 3.4, fill: { color: SUN, transparency: 15 }, line: { type: 'none' } });
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
  slide.addText('Nonthapat Tangjeerawong  ·  [Teammate Name]', {
    x: 0.9, y: 5.9, w: 10, h: 0.4, fontFace: SAFE_BODY, fontSize: 15, color: WHITE, margin: 0,
  });
  slide.addText('[Course Name / Number]  ·  Final Project Presentation', {
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
    { t: 'Listing sites', d: 'Google Maps, TripAdvisor, Yelp show everything and decide nothing.' },
    { t: 'AI chatbots', d: 'One suggestion, no visible tradeoffs — a black box.' },
    { t: 'Either way', d: 'No way to get a real feel for a place before you commit.' },
  ];
  cards.forEach((c, i) => {
    const x = 0.9 + i * 3.95;
    slide.addShape('roundRect', { x, y: 3.0, w: 3.65, h: 2.9, rectRadius: 0.12, fill: { color: OCEAN, transparency: 70 }, line: { type: 'none' } });
    slide.addText(c.t, { x: x + 0.3, y: 3.25, w: 3.05, h: 0.5, fontFace: SAFE_HEADER, fontSize: 18, bold: true, color: SUN_LIGHT, margin: 0 });
    slide.addText(c.d, { x: x + 0.3, y: 3.8, w: 3.05, h: 1.9, fontFace: SAFE_BODY, fontSize: 14, color: WHITE, margin: 0 });
  });
  footer(slide, true);
}

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
  slide.addText('1. Craft the plan', { x: 1.25, y: 2.35, w: 5, h: 0.5, fontFace: SAFE_HEADER, fontSize: 19, bold: true, color: OCEAN_DEEP, margin: 0 });
  const l1 = [
    'Traveler describes their trip in free text (69 tokens)',
    'LLM parses it into structured weights',
    'Deterministic engine scores & ranks 5 curated spots',
    'Sliders let travelers fine-tune live, for free',
  ];
  slide.addText(l1.map((t, i) => ({ text: t, options: { bullet: { code: '2022' }, breakLine: i < l1.length - 1, color: INK, fontSize: 14.5 } })), {
    x: 1.25, y: 3.0, w: 4.9, h: 3.4, fontFace: SAFE_BODY, paraSpaceAfter: 10, margin: 0,
  });

  // Lane 2 card
  slide.addShape('roundRect', { x: 6.85, y: 2.05, w: 5.55, h: 4.6, rectRadius: 0.12, fill: { color: SAND }, line: { color: FOREST, width: 1.25 } });
  slide.addText('2. Roam in 3D', { x: 7.2, y: 2.35, w: 5, h: 0.5, fontFace: SAFE_HEADER, fontSize: 19, bold: true, color: FOREST_DEEP, margin: 0 });
  const l2 = [
    'Traveler walks a spot in 3D (131 tokens)',
    'LLM reads that spot\'s curated reviews',
    'Extracts ground / sky / palette / props (fixed catalog)',
    'Seeded layout builds a walkable Three.js scene',
  ];
  slide.addText(l2.map((t, i) => ({ text: t, options: { bullet: { code: '2022' }, breakLine: i < l2.length - 1, color: INK, fontSize: 14.5 } })), {
    x: 7.2, y: 3.0, w: 4.9, h: 3.4, fontFace: SAFE_BODY, paraSpaceAfter: 10, margin: 0,
  });
  footer(slide, false);
}

// ---------- 4. Demo: craft the plan ----------
{
  const slide = pres.addSlide();
  lightBg(slide);
  slide.addText('Demo — Craft a Transparent Plan', { x: 0.6, y: 0.4, w: 10, h: 0.6, fontFace: SAFE_HEADER, fontSize: 25, bold: true, color: INK, margin: 0 });
  slide.addImage({ path: `${FIG}/cnr_05_editor_slide.png`, x: 5.5, y: 1.1, w: 7.4, h: 7.4 * (800 / 1280) });
  slide.addShape('roundRect', { x: 5.5, y: 1.1, w: 7.4, h: 7.4 * (800 / 1280), rectRadius: 0.04, fill: { type: 'none' }, line: { color: OCEAN, width: 1.5 } });

  slide.addText('"A relaxed five-hour trip, mid-range budget, good food"', {
    x: 0.6, y: 1.3, w: 4.7, h: 0.7, fontFace: SAFE_BODY, fontSize: 13.5, italic: true, color: INK_SOFT, margin: 0,
  });
  const pts = [
    'Cours Saleya Market scores 0.94 — strong match, perfect cost & time fit',
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
  slide.addImage({ path: `${FIG}/cnr_04_walk.png`, x: 5.85, y: 1.1, w: 7.1, h: 7.1 * (900 / 1280) });
  slide.addShape('roundRect', { x: 5.85, y: 1.1, w: 7.1, h: 7.1 * (900 / 1280), rectRadius: 0.04, fill: { type: 'none' }, line: { color: SUN, width: 1.5 } });

  const pts = [
    'LLM reads Cours Saleya Market\'s reviews',
    'Picks ground, sky, palette, and props from a fixed catalog',
    'A seeded algorithm places everything — same input, same scene',
    'Explorable in first person: WASD + mouse-look',
    'Share 5 photos + a review, earn 35 tokens back',
  ];
  slide.addText(pts.map((t, i) => ({ text: t, options: { bullet: { code: '2022' }, breakLine: i < pts.length - 1, color: WHITE, fontSize: 14.5 } })), {
    x: 0.6, y: 1.5, w: 5, h: 4.0, fontFace: SAFE_BODY, paraSpaceAfter: 14, margin: 0,
  });
  slide.addText('Stylized, not photorealistic — by design (see limitations).', {
    x: 0.6, y: 5.9, w: 5, h: 0.7, fontFace: SAFE_BODY, fontSize: 12.5, italic: true, color: '9FB8B0', margin: 0,
  });
  footer(slide, true);
}

// ---------- 6. Architecture ----------
{
  const slide = pres.addSlide();
  lightBg(slide);
  slide.addText('How the AI Is Used', { x: 0.6, y: 0.35, w: 8, h: 0.6, fontFace: SAFE_HEADER, fontSize: 26, bold: true, color: INK, margin: 0 });
  slide.addText('Two narrow LLM extraction steps; the decisions themselves — including the live editor — are ordinary deterministic code.', {
    x: 0.6, y: 0.95, w: 12, h: 0.4, fontFace: SAFE_BODY, fontSize: 14, italic: true, color: INK_SOFT, margin: 0,
  });
  slide.addImage({ path: `${FIG}/architecture.png`, x: 0.6, y: 1.5, w: 12.1, h: 5.77 * (620 / 1300) });
  footer(slide, false);
}

// ---------- 7. Design principle ----------
{
  const slide = pres.addSlide();
  lightBg(slide);
  slide.addText('One Design Principle', { x: 0.9, y: 0.6, w: 9, h: 0.7, fontFace: SAFE_HEADER, fontSize: 30, bold: true, color: INK, margin: 0 });
  slide.addText('The LLM translates. It never decides.', {
    x: 0.9, y: 1.35, w: 10.5, h: 0.6, fontFace: SAFE_BODY, fontSize: 17, italic: true, color: INK_SOFT, margin: 0,
  });

  slide.addShape('roundRect', { x: 0.9, y: 2.35, w: 5.55, h: 3.9, rectRadius: 0.12, fill: { color: SUN, transparency: 88 }, line: { color: SUN, width: 1.25 } });
  slide.addText('LLM calls', { x: 1.25, y: 2.6, w: 5, h: 0.5, fontFace: SAFE_HEADER, fontSize: 19, bold: true, color: 'B57A00', margin: 0 });
  const llmPts = ['Free text -> structured weights', 'Reviews -> structured ambiance spec', 'Fixed JSON schema, fixed enum catalogs', 'Validated & clamped before use'];
  slide.addText(llmPts.map((t, i) => ({ text: t, options: { bullet: { code: '2022' }, breakLine: i < llmPts.length - 1, color: INK, fontSize: 14.5 } })), {
    x: 1.25, y: 3.25, w: 4.9, h: 2.8, fontFace: SAFE_BODY, paraSpaceAfter: 10, margin: 0,
  });

  slide.addShape('roundRect', { x: 6.85, y: 2.35, w: 5.55, h: 3.9, rectRadius: 0.12, fill: { color: FOREST, transparency: 90 }, line: { color: FOREST, width: 1.25 } });
  slide.addText('Deterministic code', { x: 7.2, y: 2.6, w: 5, h: 0.5, fontFace: SAFE_HEADER, fontSize: 19, bold: true, color: FOREST_DEEP, margin: 0 });
  const detPts = ['Weighted multi-criteria scoring', 'Live plan-editor re-ranking', 'Seeded PRNG for 3D layout', 'Same inputs -> same outputs, always'];
  slide.addText(detPts.map((t, i) => ({ text: t, options: { bullet: { code: '2022' }, breakLine: i < detPts.length - 1, color: INK, fontSize: 14.5 } })), {
    x: 7.2, y: 3.25, w: 4.9, h: 2.8, fontFace: SAFE_BODY, paraSpaceAfter: 10, margin: 0,
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
  slide.addText('The Business Model (Presentation Only)', { x: 0.9, y: 0.5, w: 11, h: 0.6, fontFace: SAFE_HEADER, fontSize: 27, bold: true, color: INK, margin: 0 });
  slide.addText('Simulated in the demo as local app state — no real payment processing exists today.', {
    x: 0.9, y: 1.1, w: 11.2, h: 0.4, fontFace: SAFE_BODY, fontSize: 14, italic: true, color: INK_SOFT, margin: 0,
  });

  const rows = [
    ['Item', 'Price'],
    ['Small token bundle', '$0.80 -> 100 tokens'],
    ['Large token bundle', '$4.00 -> 600 tokens (~17% off)'],
    ['Generate a plan (search)', '69 tokens (~$0.46-0.55)'],
    ['Walk a spot in 3D', '131 tokens (~$0.87-1.05)'],
    ['Share 5 photos + a review', '+35 tokens back'],
  ];
  slide.addTable(rows.map((r, i) => r.map((c) => ({
    text: c,
    options: {
      fontFace: SAFE_BODY, fontSize: 14, color: i === 0 ? WHITE : INK, bold: i === 0,
      fill: i === 0 ? { color: OCEAN_DEEP } : { color: i % 2 === 0 ? SAND : WHITE },
      align: 'left', valign: 'middle',
    },
  }))), {
    x: 0.9, y: 1.75, w: 7.2, colW: [4.2, 3.0], rowH: 0.55, border: { type: 'solid', color: 'E0D6BE', pt: 0.75 },
  });

  slide.addShape('roundRect', { x: 8.5, y: 1.75, w: 3.9, h: 3.3, rectRadius: 0.12, fill: { color: SUN, transparency: 88 }, line: { color: SUN, width: 1.25 } });
  slide.addText('Margin check', { x: 8.8, y: 1.95, w: 3.3, h: 0.45, fontFace: SAFE_HEADER, fontSize: 16, bold: true, color: 'B57A00', margin: 0 });
  slide.addText(
    'Actual LLM cost per search: a fraction of a cent. Priced at 69 tokens (~$0.50), '
    + 'that is roughly two orders of magnitude of margin before hosting, support, and refunds.',
    { x: 8.8, y: 2.5, w: 3.3, h: 2.4, fontFace: SAFE_BODY, fontSize: 12.5, color: INK, margin: 0 },
  );
  footer(slide, false);
}

// ---------- 11. Roadmap ----------
{
  const slide = pres.addSlide();
  darkBg(slide);
  slide.addText("What's Next", { x: 0.9, y: 0.6, w: 8, h: 0.7, fontFace: SAFE_HEADER, fontSize: 30, bold: true, color: WHITE, margin: 0 });

  slide.addShape('roundRect', { x: 0.9, y: 1.5, w: 11.2, h: 1.85, rectRadius: 0.1, fill: { color: SUN, transparency: 85 }, line: { color: SUN, width: 1.25 } });
  slide.addText('Headline idea: crowdsourced photos, real rewards', { x: 1.2, y: 1.7, w: 10.6, h: 0.45, fontFace: SAFE_HEADER, fontSize: 17, bold: true, color: SUN_LIGHT, margin: 0 });
  slide.addText(
    'Travelers upload up to 5 of their own photos per spot -> vision model extracts richer ambiance -> traveler earns a real 35-token reward. '
    + 'Fully legitimate (user-submitted, not scraped). Needs accounts, storage, and moderation — a real backend, deliberately out of scope for now.',
    { x: 1.2, y: 2.15, w: 10.6, h: 1.1, fontFace: SAFE_BODY, fontSize: 13.5, color: WHITE, margin: 0 },
  );

  const rest = [
    'Real payment processing and persistent accounts for the token economy',
    'Move the OpenAI call server-side before any public deployment',
    'Hotel, flight, and other token-gated booking add-ons',
    'Expand beyond Nice to more destinations',
    'Touch controls for mobile (today assumes a keyboard)',
    'A real usability study outside the two-person team',
  ];
  slide.addText(rest.map((t, i) => ({ text: t, options: { bullet: { code: '2022' }, breakLine: i < rest.length - 1, color: 'CFE3E8', fontSize: 14 } })), {
    x: 0.9, y: 3.7, w: 11, h: 2.9, fontFace: SAFE_BODY, paraSpaceAfter: 10, margin: 0,
  });
  footer(slide, true);
}

// ---------- 12. Closing ----------
{
  const slide = pres.addSlide();
  darkBg(slide);
  sunMotif(slide, { x: 10.6, y: 4.6, size: 3.4, opacity: 92 });
  slide.addShape('ellipse', { x: 10.6, y: 4.6, w: 3.4, h: 3.4, fill: { color: SUN, transparency: 15 }, line: { type: 'none' } });
  slide.addText('Thank you', { x: 0.9, y: 2.6, w: 9, h: 1.0, fontFace: SAFE_HEADER, fontSize: 44, bold: true, color: WHITE, margin: 0 });
  slide.addText('Craft a transparent plan. Roam the winner in 3D.', {
    x: 0.9, y: 3.55, w: 9.5, h: 0.6, fontFace: SAFE_BODY, fontSize: 17, italic: true, color: 'CFE3E8', margin: 0,
  });
  slide.addText(GITHUB_URL, { x: 0.9, y: 4.5, w: 8, h: 0.5, fontFace: SAFE_BODY, fontSize: 16, color: SUN_LIGHT, margin: 0 });
}

pres.writeFile({ fileName: path.join(__dirname, 'Final_Presentation.pptx') }).then(() => {
  console.log('written');
});
