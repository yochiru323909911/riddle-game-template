# Riddle Game - JavaScript Terminal Project

A terminal game that asks the player riddles, measures how long each riddle took, and shows statistics at the end.

This repository is a **template**. The folders and files are ready, and every file has a comment that describes what should be written in it. Write all the code yourself.

## Getting started

1. Clone this repository.
2. Run `npm install` (this installs `prompt-sync`).
3. Fill in each file according to the comment inside it.
4. Run the game with `node app.js` directly in the terminal (not through a piped command).

## Folder structure

```
riddle-game/
├── app.js
├── package.json
├── riddles/
│   ├── index.js
│   ├── r1.js
│   ├── r2.js
│   ├── r3.js
│   ├── r4.js
│   └── r5.js
└── classes/
    ├── Riddle.js
    └── Player.js
```

## Tasks

### Riddle files

**Task 1: Create the riddles** (`riddles/r1.js` to `riddles/r5.js`)

- Each file exports a riddle object with `id`, `name`, `taskDescription` and `correctAnswer`.
- Example:

```js
// riddles/r1.js
export default {
  id: 1,
  name: "Easy Math",
  taskDescription: "What is 5 + 3?",
  correctAnswer: "8"
};
```

- Write 5 riddles of your own.

**Task 2: Load all riddles at once** (`riddles/index.js`)

- Import all five riddles and export them together as one array.

### Classes

**Task 3: The Riddle class** (`classes/Riddle.js`)

- Properties: `id`, `name`, `taskDescription`, `correctAnswer`.
- Method `ask(prompt)`:
  - Show the riddle.
  - Ask for user input.
  - Keep asking until the correct answer is given.

**Task 4: The Player class** (`classes/Player.js`)

- Properties: `name`, `times[]` (array of time durations per riddle).
- Methods:
  - `recordTime(start, end)`
  - `showStats()` - show total and average time.

### Game logic (`app.js`)

**Task 5: Set up terminal input**

- Install `prompt-sync` (already listed in `package.json`, so `npm install` is enough).
- Set it up:

```js
import PromptSync from 'prompt-sync';
const prompt = PromptSync();
```

**Task 6: Ask for the player name**

- Show a welcome message.
- Use `prompt` to ask: "What is your name?"
- Create a `Player` object with the name.

**Task 7: Use all the riddles**

- In `app.js`, import the array from `riddles/index.js`.

**Task 8: Main game loop**

- Loop through all riddles:
  - Record `startTime` with `Date.now()`.
  - Create a `Riddle` object and call `ask()`.
  - Record `endTime`.
  - Save the time using `player.recordTime()`.

**Task 9: Show final stats**

- After all riddles:
  - Show total time.
  - Show average time per riddle.

### Bonus (optional)

**Task 10: Multiple choice riddles**

- Create a `MultipleChoiceRiddle` class that inherits from `Riddle`.
- Add a `choices[]` property.
- Show numbered options.
- Accept numeric input and compare it to the correct answer.
- Create the file `classes/MultipleChoiceRiddle.js` yourself.

## Final deliverables

- Project folders and files ready.
- 5 riddles defined.
- Working `Riddle` and `Player` classes.
- `app.js` runs the full game.
- Terminal input with `prompt-sync`.
- Time tracking for each riddle.
- Final stats display.
- Optional: multiple choice riddles.

---

# Part 2: Database & New Features

We are improving the Riddle Game: the riddles and the players will be saved in a database, and the game gets a main menu, CRUD options for riddles, a "time to beat" and a leaderboard.

The database is a local server called **json-server**. It reads one file, `db.json`, and turns every array in it into an API address. Your code talks to it **only with `fetch`**, exactly like any other API (GET, POST, PUT, DELETE).

## Getting started (Part 2)

1. Install json-server (once):

```
npm install json-server@0.17.4
```

2. Add a script to `package.json`:

```json
"scripts": {
  "server": "json-server --watch db.json --port 3000"
}
```

3. Open **two terminals**:
   - Terminal 1: `npm run server` (keep it open, this is the database).
   - Terminal 2: `node app.js` (the game).

4. Check that the server works: open http://localhost:3000/riddles in the browser. You should see your riddles as JSON.

## New folder structure

```
riddle-game/
├── app.js
├── db.json            <- new: the database
├── package.json
├── api/               <- new: all the fetch calls
│   ├── riddlesApi.js
│   └── playersApi.js
└── classes/
    ├── Riddle.js
    └── Player.js
```

The `riddles/` folder is not needed anymore. The riddles now live in `db.json`.

## The API

json-server gives you these addresses automatically:

| Method | Address | What it does |
| --- | --- | --- |
| GET | `/riddles` | Get all riddles |
| GET | `/riddles/1` | Get the riddle with id 1 |
| POST | `/riddles` | Add a new riddle (json-server creates the `id` by itself) |
| PUT | `/riddles/1` | Replace the riddle with id 1 |
| DELETE | `/riddles/1` | Delete the riddle with id 1 |
| GET | `/players?name=Yishai` | Find players by name (returns an array) |

The same addresses exist for `/players`.

Remember:
- `fetch` returns a Promise. Use `async` / `await` (or `.then()`).
- Check `res.ok`. `fetch` does not throw an error on 404 or 500.
- For POST and PUT send `headers: { "Content-Type": "application/json" }` and `body: JSON.stringify(...)`.
- Use `try` / `catch`, so the game shows a clear message if the server is not running.
- `app.js` is an ES module, so you can use `await` directly at the top level of the file.

## Tasks

**Task 11: Riddle database** (`db.json`)

- Move all your riddles from `r1.js` ... `r5.js` into one file, as an array of objects.
- Example:

```json
{
  "riddles": [
    {
      "id": 1,
      "name": "Easy Math",
      "taskDescription": "What is 5 + 3?",
      "correctAnswer": "8"
    },
    {
      "id": 2,
      "name": "Riddle of Sound",
      "taskDescription": "I speak without a mouth. What am I?",
      "correctAnswer": "echo"
    }
  ],
  "players": []
}
```

- `db.json` must be valid JSON (double quotes, no comma after the last item).
- Delete the `riddles/` folder and load the riddles from the server instead.

**Task 12: Riddles API** (`api/riddlesApi.js`)

- Write and export an `async` function for every action:
  - `getAllRiddles()`
  - `createRiddle(riddle)`
  - `updateRiddle(id, riddle)`
  - `deleteRiddle(id)`
- Each function uses `fetch` with the right method and returns the data from the server.

**Task 13: Main menu** (`app.js`)

- Show a menu and keep showing it until the player chooses to exit:

```
What do you want to do?
1. Play the game
2. Create a new riddle
3. Read all riddles
4. Update an existing riddle
5. Delete a riddle
6. View leaderboard
0. Exit
```

**Task 14: Riddle CRUD options**

| Option | Description |
| --- | --- |
| Create | Ask for name, description and answer, and add the new riddle to the DB |
| Read | Show all riddles in the DB |
| Update | Ask for an ID and change the details of that riddle |
| Delete | Ask for an ID and remove that riddle |

- Example - creating a new riddle:

```
Enter riddle name: Hard Math
Enter description: What is 12 x 12?
Enter correct answer: 144
Riddle saved!
```

**Task 15: Player database** (`db.json` + `api/playersApi.js`)

- The `players` array in `db.json` keeps every player and their best time (in seconds):

```json
"players": [
  { "id": 1, "name": "Yishai", "lowestTime": 72 },
  { "id": 2, "name": "Sarah", "lowestTime": 65 }
]
```

- In `api/playersApi.js` write and export:
  - `findPlayerByName(name)` - returns the player, or `undefined` if there is no such player
  - `createPlayer(name)` - adds a new player with `lowestTime: null`
  - `updatePlayer(player)` - saves the player's new `lowestTime`
  - `getAllPlayers()`

**Task 16: Show "Time to Beat"**

- When a player starts a game:
  - Check if they already exist in the players DB.
  - If they do and they have a time, show:

```
Hi Yishai! Your previous lowest time was 72 seconds.
```

  - If not, add them to the DB with no `lowestTime` yet (`null`).

**Task 17: Update player time**

- After finishing the game:
  - If the player has no recorded time, save their time.
  - If their current time is lower than their saved `lowestTime`, update it.
- Example:

```
Great job, Yishai!
Your time: 68 seconds
New record! Time updated.
```

**Task 18: Leaderboard** (menu option 6)

- Load all players from the DB.
- Skip players who never finished a game (`lowestTime` is `null`).
- Sort by `lowestTime` ascending (fastest first).
- Show the results:

```
🏆 Leaderboard:
1. Sarah - 65 seconds
2. Yishai - 68 seconds
```

## Part 2 deliverables

- All riddles in one database file (`db.json`), served by json-server.
- All database actions done with `fetch` from the `api/` folder.
- A main menu with CRUD options for riddles.
- A player database.
- "Time to beat" shown before playing.
- The player's best time updated after playing.
- A leaderboard sorted by best time.
