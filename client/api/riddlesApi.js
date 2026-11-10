export async function getAllRiddles(){
  const res=await fetch('http://localhost:3000/riddles')
  const data=await res.json()
  return data
}
export async function  createRiddle(riddle){
    console.log(riddle);
    
  const res=await fetch(`http://localhost:3000/riddles/`,
     {method:'post',
   headers: { "Content-Type": "application/json" },
    body:JSON.stringify(riddle)})
  
  const data=await res.json()
  console.log(data);
  
  return data
}
export async function  updateRiddle(id, riddle){
  const res=await fetch(`http://localhost:3000/riddles/${id}`,
    {method:'put',
    headers: {"Content-Type":"application/json"},
    body:JSON.stringify(riddle)})
    const data=await res.json()
    return data
}
export async function  deleteRiddle(id){

  const res=await fetch(`http://localhost:3000/riddles/${id}`,
    {method:'delete',
    headers:{ "Content-Type":"application/json"}}
    )
    const data=await res.json()
    return data
}