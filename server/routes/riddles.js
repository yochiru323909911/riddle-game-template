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

function invalidRiddle(riddle) {
  for (const field of ['name', 'taskDescription', 'correctAnswer']) {
    const value = riddle?.[field]
    if (value === undefined || value === null || String(value).trim() === '') {
      return `${field} is required`
    }
  }
  return null
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
  res.json(db.riddles);
});

router.get('/:id', async (req, res) => {
  const db = await readDb();
  const riddle = db.riddles.find((item) => sameId(item.id, req.params.id));
  if (!riddle) {
    res.status(404).json({ error: 'Riddle not found' });
    return;
  }
  res.json(riddle);
});

router.post('/', async (req, res) => {
  const error = invalidRiddle(req.body)
  if (error) {
    res.status(400).json({ error })
    return
  }
  const db = await readDb();
  const { id, ...rest } = req.body ?? {};
  const riddle = { id: nextId(db.riddles), ...rest };
  db.riddles.push(riddle);
  await writeDb(db);
  res.status(201).json(riddle);
});

router.put('/:id', async (req, res) => {
  const db = await readDb();
  const index = db.riddles.findIndex((item) => sameId(item.id, req.params.id));
  if (index === -1) {
    res.status(404).json({ error: 'Riddle not found' });
    return;
  }
  const { id, ...rest } = req.body ?? {};
  const updated = { ...db.riddles[index], ...rest, id: db.riddles[index].id };
  const error = invalidRiddle(updated)
  if (error) {
    res.status(400).json({ error })
    return
  }
  db.riddles[index] = updated;
  await writeDb(db);
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const db = await readDb();
  const index = db.riddles.findIndex((item) => sameId(item.id, req.params.id));
  if (index === -1) {
    res.status(404).json({ error: 'Riddle not found' });
    return;
  }
  const [removed] = db.riddles.splice(index, 1);
  await writeDb(db);
  res.json(removed);
});

export default router;
