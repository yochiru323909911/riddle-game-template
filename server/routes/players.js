import express from 'express';
import { readDb, writeDb } from '../db/dbHelpers.js';

const router = express.Router();

function nextId(items) {
  let max = 0;
  for (const item of items) {
    const n = Number(item.id);
    if (Number.isFinite(n) && n > max) max = n;
  }
  return max + 1;
}

function sameId(stored, param) {
  const left = String(stored);
  const right = String(param);
  const leftNum = Number(left);
  const rightNum = Number(right);
  if (left.trim() !== '' && right.trim() !== '' && Number.isFinite(leftNum) && Number.isFinite(rightNum)) {
    return leftNum === rightNum;
  }
  return left === right;
}

router.get('/', async (req, res) => {
  const db = await readDb();
  const { name } = req.query;
  if (name !== undefined) {
    res.json(db.players.filter((player) => player.name === name));
    return;
  }
  res.json(db.players);
});

router.post('/', async (req, res) => {
  const name = req.body?.name
  if (name === undefined || name === null || String(name).trim() === '') {
    res.status(400).json({ error: 'name is required' })
    return
  }
  const db = await readDb();
  const player = {
    id: nextId(db.players),
    name: String(name).trim(),
    lowestTime: null
  };
  db.players.push(player);
  await writeDb(db);
  res.status(201).json(player);
});

router.put('/:id', async (req, res) => {
  const db = await readDb();
  const index = db.players.findIndex((player) => sameId(player.id, req.params.id));
  if (index === -1) {
    res.status(404).json({ error: 'Player not found' });
    return;
  }
  const { id, ...rest } = req.body ?? {};
  const updated = { ...db.players[index], ...rest, id: db.players[index].id };
  db.players[index] = updated;
  await writeDb(db);
  res.json(updated);
});

export default router;
