// Entry point of the game. Run it with: node app.js
//
// This file should:
// 1. Import PromptSync (from 'prompt-sync') and create the `prompt` function.
// 2. Import the Riddle class, the Player class, and the array of all riddles (from riddles/index.js).
// 3. Show a welcome message and ask the player for their name, then create a Player object.
// 4. Loop over all riddles. For each riddle:
//    - save the start time (Date.now())
//    - create a Riddle object and call its ask() method
//    - save the end time (Date.now())
//    - save the time using player.recordTime()
// 5. After the loop, call player.showStats() to show total time and average time per riddle.
import PromptSync from 'prompt-sync';
import Player from './classes/Player.js';
import MultipleChoiceRiddle from './classes/MultipleChoiceRiddle.js';
import Riddle from './classes/Riddle.js';
// import riddles from './riddles/index.js'
import * as riddlesApi from './api/riddlesApi.js'
import * as playersApi from './api/playerssApi.js'

const prompt = PromptSync();
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] = [array[j], array[i]];
    }
}

let riddles,choice

do{
  riddles=await riddlesApi.getAllRiddles()
  choice=prompt("What do you want to do?")
console.log(choice);
switch(choice){
  case '1':
    await game()
    break;
 case '2':
   addRiddle()
   break
case '3':{
    console.log(riddles);
    break}
case '4':
  update()
  break
case '5':
  deleteR()
 break;
case '6':
 Leaderboard()
 break
}}while(choice!=0)
    






async function game(){
  let record=0
console.log('welcome to the game!');
 const level = prompt('Choose difficulty: easy / medium / hard: ');
const name=prompt("what's your name?")
const searchName=await playersApi.findPlayerByName(name)
if(searchName){
  console.log(`hello ${name} ! your previous lowest time was ${searchName.lowestTime}`);  
}
else{
  await playersApi.createPlayer(name)
}
const player=new Player(name);
let penalty =0
const filterdeRiddles=riddles.filter(item=>{return item.difficulty===level})
shuffle(filterdeRiddles)
filterdeRiddles.forEach(element => {
    const start=Date.now()/1000
    const riddle=new MultipleChoiceRiddle(element.name,element.taskDescription,element.correctAnswer,element.choices,element.difficulty,element.timeLimit,element.hint)
    penalty=riddle.ask(prompt)
     const end=Date.now()/1000
     player.recordTime(start,end,penalty)
     record+=end-start+penalty
     console.log(end-start);
     


});

player.showStats()
  console.log("Great job,"+name);
  console.log("your time is "+record);
  

if(searchName){
  if(searchName.lowestTime>record)
  {
    console.log("new record! time updated.");
    // searchName.lowestTime=record
    await playersApi.updatePlayer({"name":name,"lowestTime":record})
  }
}
else{
  await playersApi.updatePlayer({"name":name,"lowestTime":record})

}
}
async function addRiddle(){
    const name=prompt("Enter riddle name:")
    const category=prompt("Enter riddle category:(hard/medium/easy)")
    const description=prompt("Enter description:")
    const answer=prompt("Enter correct answer:")
    // const answerToInt=parseInt(answer)
    // let id=parseInt(riddles[riddles.length-1].id)+1
    const randomNum1 = Math.floor(Math.random() * 31) + 20;
    const randomNum2 = Math.floor(Math.random() * 31) + 20;
     const r = await riddlesApi.createRiddle(new MultipleChoiceRiddle(name,description,answer,[answer,randomNum1,randomNum2],category,20,"aaaa"))
     console.log("successful added!"+r.name);
     
}
async function update(){
    let id=null
    let r
    do{
  id=prompt("enter a correct riddle id to update")
  console.log(id);
  
  r=riddles.find(i=>i.id===id)
  }while(r===undefined)
    
    console.log("each key press Y to change N to pass");
    let updatedRiddle=r
  for(let key in r){
    const p=prompt(`${key} : ${r[key]}`)
    if(p==='n'||p==='N')
      continue
    const value=prompt("enter the new value")
    r.key=value
  }
  const updated=await riddlesApi.updateRiddle(id,r)
}
async function deleteR(){
  const id=prompt("enter riddle id to delete")
  const r=await riddlesApi.deleteRiddle(id)
  console.log("successful delete!");
  
}
async function Leaderboard(){
  let players=await playersApi.getAllPlayers()
  players=players.filter((i)=>i.lowestTime!=null)
  players=players.toSorted((a,b)=>a.lowestTime-b.lowestTime)
  console.log(`leaderBoard:🏆 \n${players[0].name}- ${players[0].lowestTime} seconds \n ${players[1].name}- ${players[1].lowestTime} seconds`);
  
}