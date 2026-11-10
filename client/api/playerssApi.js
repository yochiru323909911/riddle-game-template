export async function   findPlayerByName(name){

  const res=await fetch(`http://localhost:3000/players?name=${name}`)
    const data=await res.json()
    
    return data?data[0]:undefined
}
export async function   createPlayer(name){

  const res=await fetch(`http://localhost:3000/players?name=${name}`,{method:'post',
    headers:{"Content-Type":"application/json"} ,
    body:JSON.stringify({name:name,lowestTime:null})}
    )
    const data=await res.json()
    return data
}
export async function   updatePlayer(player){
 const found = await findPlayerByName(player.name);

    if (!found) return;

    const res = await fetch(
        `http://localhost:3000/players/${found.id}`,{method:'put',
    headers: {"Content-Type":"application/json"},
    body:JSON.stringify({name:player.name,lowestTime:player.lowestTime})}
    )
    const data=await res.json()
    return data
}
export async function getAllPlayers(){

  const res=await fetch(`http://localhost:3000/players`)
    const data=await res.json()
    
    return data
}