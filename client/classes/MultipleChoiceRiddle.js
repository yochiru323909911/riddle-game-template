import Riddle from "./Riddle.js";
export default class MultipleChoiceRiddle extends Riddle{
    constructor(name,taskDescription,correctAnswer,c,difficulty,timeLimit,hint){
       super(name,taskDescription,correctAnswer)
       this.choices=c
       this.difficulty=difficulty
       this.timeLimit=timeLimit
       this.hint=hint
    }
    ask(prompt){
        const start=Date.now()/1000
        const showChoices=this.choices.map((item,index)=>{return `\n ${index+1}: ${item}`})
         // let answer=prompt(`${this.name} :${this.taskDescription} ${showChoices}\n`)
         // if((Date.now()/1000)-start>=this.timeLimit){
         //    console.log("Too slow! 5 seconds penalty applied.");
         //    return false}
            
         // while(this.choices[answer-1]!=this.correctAnswer){
         //     if((Date.now()/1000)-start>=this.timeLimit){
         //    console.log("Too slow! 5 seconds penalty applied.");
         //    return false}
         //     answer=prompt(`${this.name} :${this.taskDescription} ${showChoices}\n`)

         // }
         let answer,panelty=0
         do{
            answer=prompt(`${this.name} :${this.taskDescription} ${showChoices}\n`)
            if((Date.now()/1000)-start>=this.timeLimit){
            console.log("Too slow! 5 seconds penalty applied.");
             return 5}
            //  console.log(answer);
             
             if(answer==="hint"){
               console.log(this.hint);
               panelty+=10
               console.log("10 seconds penalty applied.");}
         }
         while(this.choices[answer-1]!=this.correctAnswer);
         return panelty;
    
}}