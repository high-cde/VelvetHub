/**
 * Velvet Bot — adapter autonomo ma spento senza credenziali.
 * Non pubblica automaticamente contenuti sessuali, annunci personali o media espliciti.
 * Richiede un allowlist di canali/pagine e un'azione esplicita in ambiente di produzione.
 */
const required = ['DISCORD_BOT_TOKEN', 'DISCORD_GUILD_ID']
const missing = required.filter(key => !process.env[key])

const policy = [
  '18+ only; no minors or age-ambiguous content',
  'consent-first; no coercion, exploitation, doxxing or unverified meetings',
  'no explicit sexual media; no automatic erotic advertising',
  'no crypto claims, payments, wallet signing or financial promises',
]

function clean(value, max = 1600) {
  return String(value || '').replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, max)
}

function assertSafe(message) {
  const text = clean(message, 2000).toLowerCase()
  const blocked = ['minorenne', 'minore', 'underage', 'child sexual', 'coercizione', 'ricatto', 'doxxing', 'incontro segreto']
  if (blocked.some(term => text.includes(term))) throw new Error('content_blocked_by_safety_policy')
}

async function discordSend(channelId, content) {
  if (!process.env.DISCORD_BOT_TOKEN) throw new Error('discord_not_configured')
  const response = await fetch(`https://discord.com/api/v10/channels/${encodeURIComponent(channelId)}/messages`, {
    method: 'POST', headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: clean(content) }),
  })
  if (!response.ok) throw new Error(`discord_http_${response.status}`)
  return response.json()
}

async function facebookPageSend(message) {
  if (!process.env.FACEBOOK_PAGE_ID || !process.env.FACEBOOK_PAGE_ACCESS_TOKEN) throw new Error('facebook_not_configured')
  assertSafe(message)
  const body = new URLSearchParams({ message: clean(message), access_token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN })
  const response = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(process.env.FACEBOOK_PAGE_ID)}/feed`, { method: 'POST', body })
  if (!response.ok) throw new Error(`facebook_http_${response.status}`)
  return response.json()
}

async function whatsappSend(to, message) {
  if (!process.env.WHATSAPP_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) throw new Error('whatsapp_not_configured')
  assertSafe(message)
  const response = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(process.env.WHATSAPP_PHONE_NUMBER_ID)}/messages`, {
    method: 'POST', headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to: clean(to, 40), type: 'text', text: { body: clean(message) } }),
  })
  if (!response.ok) throw new Error(`whatsapp_http_${response.status}`)
  return response.json()
}

async function main() {
  console.log(JSON.stringify({ service: 'Velvet Bot', mode: missing.length ? 'prepared_disabled' : 'configured_requires_allowlist', missing, policy }, null, 2))
  if (process.env.BOT_SELF_TEST === '1') {
    assertSafe('Prima il limite. Poi il rito. Community 18+ con consenso.')
    console.log('safety self-test: ok')
  }
}

export { discordSend, facebookPageSend, whatsappSend, assertSafe, policy }
if (import.meta.url === `file://${process.argv[1]}`) main().catch(error => { console.error(error.message); process.exitCode = 1 })
