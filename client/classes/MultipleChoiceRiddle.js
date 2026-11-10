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
        console.log(`${this.name} : ${this.taskDescription}`)
        this.choices.forEach((item,index)=>{
            console.log(`${index+1}: ${item}`)
        })
         let answer,panelty=0
         do{
            answer=prompt('Your answer: ')
            if((Date.now()/1000)-start>=this.timeLimit){
            console.log("Too slow! 5 seconds penalty applied.");
             return 5}

             if(answer==="hint"){
               console.log(this.hint);
               panelty+=10
               console.log("10 seconds penalty applied.");
               continue
             }
             if(this.choices[answer-1]!=this.correctAnswer){
               console.log("Wrong answer, try again.")
             }
         }
         while(this.choices[answer-1]!=this.correctAnswer);
         return panelty;

}}