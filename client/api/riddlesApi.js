const baseUrl = 'http://localhost:3000/api/riddles'

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

export async function getAllRiddles() {
  const res = await fetch(baseUrl)
  return parseResponse(res)
}

export async function createRiddle(riddle) {
  const res = await fetch(baseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(riddle)
  })
  return parseResponse(res)
}

export async function updateRiddle(id, riddle) {
  const res = await fetch(`${baseUrl}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(riddle)
  })
  return parseResponse(res)
}

export async function deleteRiddle(id) {
  const res = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' })
  return parseResponse(res)
}
