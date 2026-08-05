// Thin client-side wrapper around the OpenAI Chat Completions API.
// Requires VITE_OPENAI_API_KEY in a local .env file (see .env.example).

export const MODEL = 'gpt-5.6-luna'

const API_URL = 'https://api.openai.com/v1/chat/completions'

function getApiKey() {
  const key = import.meta.env.VITE_OPENAI_API_KEY
  if (!key) {
    throw new Error(
      'Missing VITE_OPENAI_API_KEY. Add it to a local .env file (see .env.example).'
    )
  }
  return key
}

/**
 * Calls the chat completions endpoint asking for a strict JSON object back.
 * gpt-5.6-luna rejects function-tool calling combined with its default
 * reasoning_effort on this endpoint, so instead of tool-based structured
 * output we just instruct the model to return raw JSON and parse it.
 */
export async function chatJSON(messages) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getApiKey()}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      response_format: { type: 'json_object' },
      reasoning_effort: 'none',
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`OpenAI API error (${res.status}): ${body}`)
  }

  const data = await res.json()
  const content = data.choices[0].message.content
  return JSON.parse(content)
}
