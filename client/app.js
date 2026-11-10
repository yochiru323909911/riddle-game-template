import PromptSync from 'prompt-sync';
import Player from './classes/Player.js';
import MultipleChoiceRiddle from './classes/MultipleChoiceRiddle.js';
import * as riddlesApi from './api/riddlesApi.js'
import * as playersApi from './api/playerssApi.js'
import { askText, success, warning, number, field, paint } from './style.js'

const prompt = PromptSync();

function ask(message) {
  return prompt(askText(message));
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
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

function serverMessage(error) {
  const code = error.cause?.code;
  if (code === 'ECONNREFUSED' || code === 'ECONNRESET' || error.message === 'fetch failed') {
    return 'The server is not running. Start it with npm run server.';
  }
  return error.message;
}

function showMenu() {
  console.log('');
  console.log(paint('1', 'What do you want to do?'));
  const options = [
    ['1', 'Play the game'],
    ['2', 'Create a new riddle'],
    ['3', 'Read all riddles'],
    ['4', 'Update an existing riddle'],
    ['5', 'Delete a riddle'],
    ['6', 'View leaderboard'],
    ['0', 'Exit']
  ];
  for (const [option, label] of options) {
    console.log(`  ${number(option + '.')} ${label}`);
  }
}

function showRiddles(list) {
  if (!list.length) {
    console.log(warning('No riddles yet.'));
    return;
  }
  for (const riddle of list) {
    console.log('');
    console.log(paint('1', riddle.name || '(no name)'));
    for (const [key, value] of Object.entries(riddle)) {
      console.log('  ' + field(key, value));
    }
  }
}

let riddles = [];
let choice = '';

showMenu();
do {
  try {
    riddles = await riddlesApi.getAllRiddles();
    console.log('');
    choice = ask('Enter a number from the menu: ');
    choice = choice == null ? '0' : String(choice).trim();

    switch (choice) {
      case '1':
        await game();
        break;
      case '2':
        await addRiddle();
        break;
      case '3':
        showRiddles(riddles);
        break;
      case '4':
        await update();
        break;
      case '5':
        await deleteR();
        break;
      case '6':
        await leaderboard();
        break;
      case '0':
        break;
      default:
        console.log(warning('Enter one of these numbers: 1, 2, 3, 4, 5, 6, or 0.'));
    }
  } catch (error) {
    console.log(warning(serverMessage(error)));
    const again = ask('Press 0 to exit, or Enter to try again: ');
    if (again === '0') choice = '0';
  }
} while (choice !== '0');

async function game() {
  console.log('');
  console.log(paint('1', 'Welcome to the game!'));
  const level = (ask('Enter difficulty (easy, medium, or hard): ') || '').trim().toLowerCase();
  const name = (ask('Enter your name: ') || '').trim();
  if (!name) {
    console.log(warning('A name is required.'));
    return;
  }

  const existing = await playersApi.findPlayerByName(name);
  if (!existing) {
    await playersApi.createPlayer(name);
  } else if (existing.lowestTime != null) {
    console.log(`Hi ${name}! Your previous lowest time was ${number(existing.lowestTime)} seconds.`);
  }

  const player = new Player(name);
  const filteredRiddles = riddles.filter((item) => item.difficulty === level);
  if (!filteredRiddles.length) {
    console.log(warning(`No riddles found for "${level}".`));
    return;
  }

  shuffle(filteredRiddles);
  let record = 0;
  for (const element of filteredRiddles) {
    const start = Date.now() / 1000;
    const riddle = new MultipleChoiceRiddle(
      element.name,
      element.taskDescription,
      element.correctAnswer,
      element.choices,
      element.difficulty,
      element.timeLimit,
      element.hint
    );
    const penalty = riddle.ask(prompt);
    const end = Date.now() / 1000;
    player.recordTime(start, end, penalty);
    record += end - start + penalty;
  }

  player.showStats();
  const time = Number(record.toFixed(2));
  console.log('');
  console.log(success(`Great job, ${name}!`));
  console.log(`Your time: ${number(time)} seconds`);

  const previous = existing?.lowestTime;
  if (previous == null || time < previous) {
    await playersApi.updatePlayer({ name, lowestTime: time });
    console.log(success('New record! Time updated.'));
  }
}

async function addRiddle() {
  const name = ask('Enter riddle name: ');
  const description = ask('Enter description: ');
  const answer = ask('Enter correct answer: ');
  const category = ask('Enter difficulty (easy, medium, or hard): ');
  const randomNum1 = Math.floor(Math.random() * 31) + 20;
  const randomNum2 = Math.floor(Math.random() * 31) + 20;
  await riddlesApi.createRiddle(new MultipleChoiceRiddle(
    name,
    description,
    answer,
    [answer, randomNum1, randomNum2],
    category,
    20,
    'aaaa'
  ));
  console.log(success('Riddle saved!'));
}

async function update() {
  const id = ask('Enter the riddle id to update: ');
  const riddle = riddles.find((item) => sameId(item.id, id));
  if (!riddle) {
    console.log(warning('Riddle not found.'));
    return;
  }

  console.log('Press Enter to keep the current value, or type a new one.');
  const updated = { ...riddle };
  for (const key of Object.keys(riddle)) {
    if (key === 'id') continue;
    const shown = Array.isArray(riddle[key]) ? riddle[key].join(', ') : riddle[key];
    const value = prompt(field(key, shown) + ' ');
    if (value == null || value.trim() === '') continue;
    if (key === 'choices') {
      updated[key] = value.split(',').map((item) => item.trim()).filter((item) => item !== '');
    } else if (typeof riddle[key] === 'number' && Number.isFinite(Number(value))) {
      updated[key] = Number(value);
    } else {
      updated[key] = value.trim();
    }
  }
  await riddlesApi.updateRiddle(riddle.id, updated);
  console.log(success('Riddle updated!'));
}

async function deleteR() {
  const id = ask('Enter the riddle id to delete: ');
  await riddlesApi.deleteRiddle(id);
  console.log(success('Riddle deleted!'));
}

async function leaderboard() {
  const players = await playersApi.getAllPlayers();
  const ranked = players
    .filter((player) => player.lowestTime != null)
    .sort((a, b) => a.lowestTime - b.lowestTime);

  console.log('');
  console.log(paint('1', '🏆 Leaderboard'));
  if (!ranked.length) {
    console.log('No finished games yet.');
    return;
  }
  ranked.forEach((player, index) => {
    console.log(`${number(index + 1 + '.')} ${player.name} - ${number(player.lowestTime)} seconds`);
  });
}
