// The Riddle class. Export it as the default export.
//
// Properties (received in the constructor):
// - id
// - name
// - taskDescription
// - correctAnswer
//
// Method:
// - ask(prompt)
//   - show the riddle (name and taskDescription) to the player
//   - ask the player for an answer using the `prompt` function that is passed in
//   - keep asking until the answer is correct
export default class Riddle{
    constructor(name,taskDescription,correctAnswer){
        this.id=null
        this.name=name
        this.taskDescription=taskDescription
        this.correctAnswer=correctAnswer
    }
    ask(prompt){
        // console.log();
        let answer=prompt(`${this.name} :${this.taskDescription}`)
         while(answer!=this.correctAnswer){
            answer=prompt(`${this.name} :${this.taskDescription}`)
         }
    }
}