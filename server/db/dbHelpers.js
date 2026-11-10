import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const dbPath = path.join(path.dirname(fileURLToPath(import.meta.url)), 'db.json');

export async function readDb() {
  const text = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(text);
}

export async function writeDb(db) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2));
}
