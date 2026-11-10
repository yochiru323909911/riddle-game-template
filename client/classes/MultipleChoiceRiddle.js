import Riddle from "./Riddle.js";
import { askText, number, paint, warning } from "../style.js";
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
        console.log('')
        console.log(`${paint('1', this.name)}: ${this.taskDescription}`)
        if (!Array.isArray(this.choices)) {
            this.choices = String(this.choices ?? '')
                .split(',')
                .map((item) => item.trim())
                .filter((item) => item !== '');
        }
        this.choices.forEach((item,index)=>{
            console.log(`  ${number(index + 1 + ')')} ${item}`)
        })
         let answer,panelty=0
         do{
            answer=prompt(askText('Enter the option number: '))
            if((Date.now()/1000)-start>=this.timeLimit){
            console.log(warning("Too slow! 5 seconds penalty applied."));
             return 5}

             if(answer==="hint"){
               console.log(`Hint: ${this.hint}`);
               panelty+=10
               console.log(warning("10 seconds penalty applied."));
               continue
             }
             if(this.choices[answer-1]!=this.correctAnswer){
               console.log(warning("Wrong answer, try again."))
             }
         }
         while(this.choices[answer-1]!=this.correctAnswer);
         return panelty;

}}