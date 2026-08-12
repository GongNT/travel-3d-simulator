import { chatWithTools } from './openai'
import { SPOTS } from '../data/spots'
import { WALK_3D_COST } from './tokens'

// A bounded tool-calling agent: every tool it can call wraps a function this
// app already trusts (the deterministic scoring engine, the plan-report
// generator, the existing walk-unlock flow) - the agent never has open-ended
// access to anything, and no tool has a real-world side effect (no real
// payments, no network calls beyond the ones the app already makes).

const MAX_TOOL_ROUNDS = 4

const SYSTEM_PROMPT = `You are the CNR (Craft N Roam) trip concierge, a chat assistant embedded in a \
travel-planning app for Nice, France. You have tools to adjust the traveler's plan, look up details on a \
specific spot, unlock the 3D walk-through, and download a plan report. Always use a tool when the traveler \
asks for an action (adjusting preferences, spot info, walking a spot, downloading a report) rather than \
just describing what you would do. Keep replies short and conversational (1-3 sentences). The five spots \
available are: Promenade des Anglais, Vieux Nice (Old Town), Castle Hill (Colline du Chateau), Cours Saleya \
Market, and Port de Nice (Port Lympia). Never invent scores, prices, or facts not returned by a tool.`

export const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'adjust_plan',
      description:
        'Adjust the traveler\'s budget level, time available, or category weights. Only include the fields '
        + 'that should change; omitted fields keep their current value. Re-ranks the plan instantly.',
      parameters: {
        type: 'object',
        properties: {
          budgetLevel: { type: 'integer', minimum: 1, maximum: 5 },
          timeBudgetHours: { type: 'integer', minimum: 1, maximum: 12 },
          relax: { type: 'number', minimum: 0, maximum: 1 },
          adventure: { type: 'number', minimum: 0, maximum: 1 },
          culture: { type: 'number', minimum: 0, maximum: 1 },
          food: { type: 'number', minimum: 0, maximum: 1 },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_spot_details',
      description: 'Look up full details and visitor reviews for one of the five spots, plus its current rank/score if a plan has been generated.',
      parameters: {
        type: 'object',
        properties: { spotName: { type: 'string' } },
        required: ['spotName'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'unlock_and_walk',
      description: `Unlock 3D walking (costs ${WALK_3D_COST} tokens once, covers every spot afterward) and open the walk-through for a named spot.`,
      parameters: {
        type: 'object',
        properties: { spotName: { type: 'string' } },
        required: ['spotName'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'download_report',
      description: 'Download the current trip plan as a text report.',
      parameters: { type: 'object', properties: {} },
    },
  },
]

function findSpot(spotName) {
  if (!spotName) return null
  const needle = spotName.trim().toLowerCase()
  return (
    SPOTS.find((s) => s.name.toLowerCase() === needle)
    || SPOTS.find((s) => s.name.toLowerCase().includes(needle) || needle.includes(s.name.toLowerCase()))
    || null
  )
}

function executeTool(name, args, context) {
  const { prefs, onPrefsChange, scored, onEnter, balance, has3DAccess, onDownloadReport } = context

  if (name === 'adjust_plan') {
    if (!prefs || !onPrefsChange) {
      return { ok: false, message: 'No plan has been generated yet - the traveler needs to describe their trip first.' }
    }
    const next = {
      ...prefs,
      budgetLevel: args.budgetLevel ?? prefs.budgetLevel,
      timeBudgetHours: args.timeBudgetHours ?? prefs.timeBudgetHours,
      categoryWeights: {
        relax: args.relax ?? prefs.categoryWeights.relax,
        adventure: args.adventure ?? prefs.categoryWeights.adventure,
        culture: args.culture ?? prefs.categoryWeights.culture,
        food: args.food ?? prefs.categoryWeights.food,
      },
    }
    onPrefsChange(next)
    return { ok: true, updatedPrefs: next, message: 'Plan re-ranked with the new weights.' }
  }

  if (name === 'get_spot_details') {
    const spot = findSpot(args.spotName)
    if (!spot) return { ok: false, message: `No spot matching "${args.spotName}" in the demo dataset.` }
    const ranked = scored?.find((r) => r.spot.id === spot.id)
    return {
      ok: true,
      name: spot.name,
      tagline: spot.tagline,
      category: spot.category,
      costLevel: spot.costLevel,
      durationHours: spot.durationHours,
      travelTimeMinutes: spot.travelTimeMinutes,
      reviews: spot.reviews,
      currentScore: ranked ? Math.round(ranked.score * 100) : null,
    }
  }

  if (name === 'unlock_and_walk') {
    const spot = findSpot(args.spotName)
    if (!spot) return { ok: false, message: `No spot matching "${args.spotName}" in the demo dataset.` }
    if (!has3DAccess && balance < WALK_3D_COST) {
      return { ok: false, message: `Not enough tokens - unlocking 3D walking costs ${WALK_3D_COST} tokens and the traveler has ${balance}.` }
    }
    onEnter?.(spot)
    return { ok: true, message: `Opening the 3D walk-through for ${spot.name}.` }
  }

  if (name === 'download_report') {
    if (!scored?.length) return { ok: false, message: 'No plan has been generated yet.' }
    onDownloadReport?.()
    return { ok: true, message: 'Report downloaded.' }
  }

  return { ok: false, message: `Unknown tool: ${name}` }
}

export function initialMessages() {
  return [{ role: 'system', content: SYSTEM_PROMPT }]
}

export async function runConciergeTurn(history, userText, context) {
  const messages = [...history, { role: 'user', content: userText }]

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const assistantMsg = await chatWithTools(messages, TOOLS)
    messages.push(assistantMsg)

    if (!assistantMsg.tool_calls?.length) {
      return { messages, replyText: assistantMsg.content || '' }
    }

    for (const call of assistantMsg.tool_calls) {
      let args = {}
      try {
        args = JSON.parse(call.function.arguments || '{}')
      } catch {
        // leave args empty if the model sent malformed JSON
      }
      const result = executeTool(call.function.name, args, context)
      messages.push({ role: 'tool', tool_call_id: call.id, content: JSON.stringify(result) })
    }
  }

  const replyText = "Sorry, I'm having trouble completing that - could you try rephrasing?"
  messages.push({ role: 'assistant', content: replyText })
  return { messages, replyText }
}
