/**
 * AI Service API client — all 5 features
 * Proxied via Vite: /ai → http://localhost:8000
 */
import axios from 'axios'

const ai = axios.create({ baseURL: '/ai' })

/** Explain H-Script code (or selected snippet) */
export async function explainCode(code, selection = null) {
  const { data } = await ai.post('/explain', { code, selection })
  return data.explanation
}

/** Generate H-Script code from a plain description */
export async function generateCode(prompt, context = null) {
  const { data } = await ai.post('/generate', { prompt, context })
  return data   // { code, explanation }
}

/** Fix H-Script code given an error message */
export async function fixCode(code, error) {
  const { data } = await ai.post('/fix', { code, error })
  return data   // { fixed_code, explanation }
}

/** Autocomplete — returns array of completion strings */
export async function autocomplete(prefix) {
  const { data } = await ai.post('/autocomplete', { prefix })
  return data.completions   // string[]
}

/** Explain an error in friendly Hinglish */
export async function explainError(code, error) {
  const { data } = await ai.post('/explain-error', { code, error })
  return data   // { error_type, explanation, hint }
}

/** Agentic multi-turn chat */
export async function agentChat(message, code = null, history = []) {
  const { data } = await ai.post('/agent', { message, code, history })
  return data   // { reply, action, result, history }
}
