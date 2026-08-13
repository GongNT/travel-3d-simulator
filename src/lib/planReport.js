import { jsPDF } from 'jspdf'
import { TRAVEL_TIME_FROM } from '../data/spots'
import { PLAN_SEARCH_COST, WALK_3D_COST, PHOTO_REVIEW_REWARD, PHOTO_REVIEW_MIN_PHOTOS, STARTING_BALANCE } from './tokens'

// Deterministic plan report built entirely from data already on screen
// (prefs summary + explanation from the LLM call already paid for, plus the
// scoring breakdown) - no extra LLM call, no extra token cost.

// ---- palette, matches src/App.css :root ----
const OCEAN_DEEP = '#0b4f6c'
const OCEAN = '#0c8599'
const OCEAN_LIGHT = '#4fb3c9'
const FOREST_DEEP = '#1b4332'
const FOREST = '#2d6a4f'
const SUN = '#f4a300'
const SUN_LIGHT = '#ffcf5c'
const CORAL = '#f2724b'
const SAND = '#fdf6e6'
const SAND_DARK = '#f2e2bf'
const INK = '#1f2d27'
const INK_SOFT = '#4a5d55'
const WHITE = '#ffffff'

const PAGE_W = 612
const PAGE_H = 792
const MARGIN = 54 // 0.75in

// Greedily pick the best-scoring spots that fit inside the traveler's stated
// time budget, in score order - a real, time-bounded itinerary rather than
// just the full ranked list.
export function pickItinerary(scored, timeBudgetHours) {
  const budget = Number(timeBudgetHours) || 0
  const picks = []
  let used = 0
  for (const entry of scored) {
    const remaining = budget - used
    if (entry.spot.durationHours <= remaining) {
      picks.push(entry)
      used += entry.spot.durationHours
    }
    if (budget - used <= 0) break
  }
  if (picks.length === 0 && scored.length) picks.push(scored[0])
  return { picks, usedHours: used, leftoverHours: Math.max(0, budget - used) }
}

function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

function lerpColor(a, b, t) {
  const [ar, ag, ab] = hexToRgb(a)
  const [br, bg, bb] = hexToRgb(b)
  return [ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t]
}

function gradientRect(doc, x, y, w, h, colorA, colorB, vertical = true) {
  const steps = 48
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1)
    const [r, g, b] = lerpColor(colorA, colorB, t)
    doc.setFillColor(r, g, b)
    if (vertical) {
      const stepH = h / steps
      doc.rect(x, y + i * stepH, w, stepH + 0.6, 'F')
    } else {
      const stepW = w / steps
      doc.rect(x + i * stepW, y, stepW + 0.6, h, 'F')
    }
  }
}

function rrect(doc, x, y, w, h, r, fill) {
  doc.setFillColor(...hexToRgb(fill))
  doc.roundedRect(x, y, w, h, r, r, 'F')
}

function chip(doc, label, x, y, bg, fg = WHITE, size = 8.5) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(size)
  const padX = 7
  const w = doc.getTextWidth(label) + padX * 2
  const h = size + 6
  rrect(doc, x, y, w, h, h / 2, bg)
  doc.setTextColor(...hexToRgb(fg))
  doc.text(label, x + w / 2, y + h / 2 + size * 0.32, { align: 'center' })
  return w
}

function wordmark(doc, x, y) {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(17)
  doc.setTextColor(...hexToRgb(WHITE))
  doc.text('CNR', x, y)
  const w = doc.getTextWidth('CNR ')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10.5)
  doc.setTextColor(...hexToRgb(SUN_LIGHT))
  doc.text('Craft N Roam', x + w, y)
}

function paragraph(doc, text, x, y, width, { size = 9.8, leading = 13.6, color = INK, font = 'normal' } = {}) {
  doc.setFont('helvetica', font)
  doc.setFontSize(size)
  doc.setTextColor(...hexToRgb(color))
  const lines = doc.splitTextToSize(text, width)
  lines.forEach((line, i) => doc.text(line, x, y + i * leading))
  return y + lines.length * leading
}

function bulletList(doc, items, x, y, width, { size = 9, leading = 12.6, color = INK, dotColor = INK, gap = 5 } = {}) {
  let cy = y
  items.forEach((item) => {
    doc.setFillColor(...hexToRgb(dotColor))
    doc.circle(x + 2, cy - 2.6, 1.6, 'F')
    cy = paragraph(doc, item, x + 10, cy, width - 10, { size, leading, color }) + gap
  })
  return cy
}

function footer(doc, label) {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(...hexToRgb(INK_SOFT))
  doc.text('CNR - Craft N Roam - Your trip plan - Nice, France (demo dataset)', MARGIN, PAGE_H - 36)
  doc.text(label, PAGE_W - MARGIN, PAGE_H - 36, { align: 'right' })
}

function timeString(hoursFromNine) {
  const totalMinutes = Math.round(hoursFromNine * 60)
  let h = 9 + Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12 = ((h + 11) % 12) + 1
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
}

function spotHighlights(spot) {
  // Pull the fixed, team-authored review text already in the dataset - no
  // fabricated content, no extra LLM call.
  return spot.reviews.map((r) => {
    const firstSentence = r.split('. ')[0]
    return firstSentence.endsWith('.') ? firstSentence : firstSentence + '.'
  })
}

export function generatePlanReportPDF({ prefsSummary, explanation, scored, prefs }) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const { picks, usedHours } = pickItinerary(scored, prefs?.timeBudgetHours ?? 5)
  const contentW = PAGE_W - MARGIN * 2

  // ============ PAGE 1: hero + itinerary timeline + cost ============
  const HERO_H = 190
  gradientRect(doc, 0, 0, PAGE_W, HERO_H, OCEAN_DEEP, FOREST_DEEP)
  wordmark(doc, MARGIN, 46)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.setTextColor(...hexToRgb(WHITE))
  doc.text('Your Nice Trip Plan', MARGIN, 82)

  const budgetLabel = prefs?.timeBudgetHours ? `${prefs.timeBudgetHours}-hour` : ''
  const subEndY = paragraph(
    doc,
    `A ${budgetLabel} plan built from your stated interests and CNR's deterministic scoring engine - `
      + `the same ranking shown on screen, picked down to what actually fits your time.`,
    MARGIN, 100, contentW,
    { size: 10.2, leading: 14, color: '#e9f3ee' },
  )

  const stats = [
    [`${usedHours}h`, 'Time planned'],
    [`${picks.length}`, 'Spots picked'],
    [`${prefs?.budgetLevel ?? '-'}/5`, 'Budget level'],
    [`${STARTING_BALANCE}`, 'Starting tokens'],
  ]
  let cx = MARGIN
  const chipY = subEndY + 8
  const chipH = 46
  const chipW = (contentW - 24) / 4
  stats.forEach(([val, label]) => {
    rrect(doc, cx, chipY, chipW, chipH, 8, WHITE)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(15)
    doc.setTextColor(...hexToRgb(FOREST_DEEP))
    doc.text(val, cx + chipW / 2, chipY + 24, { align: 'center' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.4)
    doc.setTextColor(...hexToRgb(INK_SOFT))
    doc.text(label, cx + chipW / 2, chipY + 37, { align: 'center' })
    cx += chipW + 8
  })

  let y = HERO_H + 34

  if (prefsSummary) {
    const quoteH = 40
    rrect(doc, MARGIN, y, contentW, quoteH, 8, SAND_DARK)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(10.5)
    doc.setTextColor(...hexToRgb(INK))
    doc.text(`"${prefsSummary}"`, MARGIN + 14, y + quoteH / 2 + 3.5)
    y += quoteH + 26
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13.5)
  doc.setTextColor(...hexToRgb(INK))
  doc.text("Today's plan", MARGIN, y)
  y += 20

  const lineX = MARGIN + 8
  const timelineStops = [
    { kind: 'START', time: '9:00 AM', place: `${TRAVEL_TIME_FROM.replace(', on foot', '')}`, color: null },
  ]
  let clock = 0
  picks.forEach((entry, i) => {
    const startClock = clock
    clock += entry.spot.durationHours
    timelineStops.push({
      kind: `STOP ${i + 1} - ${entry.spot.durationHours}h`,
      time: `${timeString(startClock)} - ${timeString(clock)}`,
      place: entry.spot.name,
      sub: `~${entry.spot.travelTimeMinutes} min walk from city center - ${entry.spot.tagline}`,
      color: i === 0 ? CORAL : i === 1 ? FOREST : OCEAN,
    })
  })
  timelineStops.push({ kind: 'END', time: timeString(clock), place: `${usedHours} hours of exploring done`, color: null })

  const ROW = 50
  let ty = y
  timelineStops.forEach((stop, i) => {
    const isStop = !!stop.color
    const r = isStop ? 6 : 3.2
    doc.setFillColor(...hexToRgb(stop.color || SAND_DARK))
    doc.circle(lineX, ty - 4, r, 'F')
    if (i < timelineStops.length - 1) {
      doc.setDrawColor(...hexToRgb(SAND_DARK))
      doc.setLineWidth(2)
      const rowH = stop.sub ? ROW + 12 : ROW
      doc.line(lineX, ty - 4 + r, lineX, ty - 4 + rowH)
    }
    const tx = lineX + 20
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.setTextColor(...hexToRgb(stop.color || INK_SOFT))
    doc.text(stop.kind.toUpperCase(), tx, ty)
    const kindW = doc.getTextWidth(stop.kind.toUpperCase())
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(...hexToRgb(INK_SOFT))
    doc.text('  ' + stop.time, tx + kindW + 6, ty)
    doc.setFont('helvetica', isStop ? 'bold' : 'normal')
    doc.setFontSize(isStop ? 12.5 : 9.5)
    doc.setTextColor(...hexToRgb(INK))
    doc.text(stop.place, tx, ty + 14)
    let rowH = ROW
    if (stop.sub) {
      const subY = paragraph(doc, stop.sub, tx, ty + 27, contentW - 90, { size: 8, leading: 10.5, color: INK_SOFT })
      rowH = subY - ty + 14
    }
    ty += rowH
  })

  y = ty + 10
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13.5)
  doc.setTextColor(...hexToRgb(INK))
  doc.text('What this costs (simulated tokens)', MARGIN, y)
  y += 18

  const costRows = [
    ['Starting balance', `+${STARTING_BALANCE}`, INK_SOFT],
    ['Generate this plan (search)', `-${PLAN_SEARCH_COST}`, CORAL],
    [`Unlock 3D walking for all spots (one-time)`, `-${WALK_3D_COST}`, CORAL],
    ['Balance after crafting + roaming', `= ${STARTING_BALANCE - PLAN_SEARCH_COST - WALK_3D_COST}`, FOREST],
    [
      `Share ${PHOTO_REVIEW_MIN_PHOTOS} photos + a review at each spot (+${PHOTO_REVIEW_REWARD} each, optional)`,
      `+${PHOTO_REVIEW_REWARD * picks.length}`,
      OCEAN,
    ],
  ]
  const rowH = 20
  rrect(doc, MARGIN, y, contentW, rowH * costRows.length + 10, 8, SAND)
  let ry = y + 16
  costRows.forEach(([label, amount, color]) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.2)
    doc.setTextColor(...hexToRgb(INK))
    doc.text(label, MARGIN + 14, ry)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.8)
    doc.setTextColor(...hexToRgb(color))
    doc.text(amount, PAGE_W - MARGIN - 14, ry, { align: 'right' })
    ry += rowH
  })

  footer(doc, 'Page 1 of 2')

  // ============ PAGE 2: full ranking + spot detail cards ============
  doc.addPage()
  gradientRect(doc, 0, 0, PAGE_W, 64, OCEAN_DEEP, OCEAN)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.setTextColor(...hexToRgb(WHITE))
  doc.text('How this plan was picked', MARGIN, 40)

  y = 92
  if (explanation) {
    y = paragraph(doc, explanation, MARGIN, y, contentW, { size: 9.6, leading: 13.4 })
    y += 10
  }
  const pickedIds = new Set(picks.map((p) => p.spot.id))
  y = paragraph(
    doc,
    `Every spot is scored the same deterministic way (50% preference match, 25% cost fit, 25% time fit, plus a `
      + `small tag bonus) - no LLM call, fully reproducible. The spots below were then chosen in score order, `
      + `skipping any that would overflow your ${prefs?.timeBudgetHours ?? 5}-hour budget.`,
    MARGIN, y, contentW, { size: 9.6, leading: 13.4, color: INK_SOFT },
  )
  y += 18

  const tableW = contentW
  const barX = MARGIN + tableW * 0.5
  const barW = tableW * 0.32
  scored.forEach(({ spot, score }) => {
    const picked = pickedIds.has(spot.id)
    const rh = 24
    rrect(doc, MARGIN, y, tableW, rh - 4, 5, picked ? SAND_DARK : SAND)
    doc.setFont('helvetica', picked ? 'bold' : 'normal')
    doc.setFontSize(9.3)
    doc.setTextColor(...hexToRgb(INK))
    doc.text(spot.name, MARGIN + 10, y + 14)
    rrect(doc, barX, y + 8, barW, 7, 3.5, WHITE)
    const fillW = barW * Math.min(1, score / 1.1)
    rrect(doc, barX, y + 8, fillW, 7, 3.5, picked ? CORAL : OCEAN_LIGHT)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.3)
    doc.text(score.toFixed(2), MARGIN + tableW - 10, y + 14, { align: 'right' })
    if (picked) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(6.4)
      doc.setTextColor(...hexToRgb(SUN))
      doc.text('IN PLAN', MARGIN + tableW - 50, y + 4)
    }
    y += rh
  })

  y += 22

  const cardGap = 14
  const cardCount = picks.length
  const cardW = (contentW - cardGap * (cardCount - 1)) / cardCount
  const cardH = 210
  const cardColors = [
    [CORAL, '#c9531f'],
    [FOREST, FOREST_DEEP],
    [OCEAN, OCEAN_DEEP],
  ]

  if (y + cardH > PAGE_H - 60) {
    footer(doc, 'Page 2 of 3')
    doc.addPage()
    y = 60
  }

  picks.forEach((entry, i) => {
    const cardX = MARGIN + i * (cardW + cardGap)
    const [a, b] = cardColors[i % cardColors.length]
    drawSpotCard(doc, cardX, y, cardW, cardH, a, b, entry.spot)
  })

  footer(doc, doc.internal.getNumberOfPages() === 2 ? 'Page 2 of 2' : `Page ${doc.internal.getNumberOfPages()} of ${doc.internal.getNumberOfPages()}`)

  return doc
}

function drawSpotCard(doc, x, y, w, h, colorA, colorB, spot) {
  rrect(doc, x, y, w, h, 10, WHITE)
  doc.saveGraphicsState()
  gradientRect(doc, x, y, w, 64, colorA, colorB, false)
  doc.restoreGraphicsState()

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12.5)
  doc.setTextColor(...hexToRgb(WHITE))
  const titleLines = doc.splitTextToSize(spot.name, w - 24)
  titleLines.forEach((line, i) => doc.text(line, x + 12, y + 22 + i * 14))
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.2)
  doc.setTextColor(...hexToRgb(SAND))
  doc.text(`${spot.durationHours}h - ${spot.category} - cost ${spot.costLevel}/5`, x + 12, y + 56)

  bulletList(doc, spotHighlights(spot), x + 12, y + 84, w - 24, {
    size: 8, leading: 10.8, color: INK, dotColor: colorA, gap: 6,
  })
}

export function downloadPlanReportPDF(doc) {
  doc.save('cnr-trip-plan.pdf')
}
