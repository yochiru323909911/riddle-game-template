const baseUrl = 'http://localhost:3000/api/players'

async function parseResponse(res) {
  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }
  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`)
  }
  return data
}

export async function findPlayerByName(name) {
  const res = await fetch(`${baseUrl}?name=${encodeURIComponent(name)}`)
  const data = await parseResponse(res)
  return Array.isArray(data) ? data[0] : undefined
}

export async function createPlayer(name) {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, lowestTime: null })
  })
  return parseResponse(res)
}

export async function updatePlayer(player) {
  const found = await findPlayerByName(player.name)
  if (!found) return

  const res = await fetch(`${baseUrl}/${found.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: player.name, lowestTime: player.lowestTime })
  })
  return parseResponse(res)
}

export async function getAllPlayers() {
  const res = await fetch(baseUrl)
  return parseResponse(res)
}
