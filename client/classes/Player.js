// The Player class. Export it as the default export.
//
// Properties:
// - name
// - times (an array that holds the time it took to solve each riddle)
//
// Methods:
// - recordTime(start, end)
//   - calculate the duration (end - start) and add it to the times array
// - showStats()
//   - show the total time and the average time per riddle
export default class Player{
    constructor(name){
        this.name=name
        this.times=[]
    }
    recordTime(start, end,penalty ){
        this.times.push(end-start+penalty)
    }
    showStats(){
    let sum=0;
    this.times.forEach((element,index )=> {
        console.log(`time for riddle ${index+1} :${element}`);
        sum+=parseInt(element)
        
    });
    console.log(`the avarage time for riddle: ${sum/(this.times.length)}`);
    
    
    }
}