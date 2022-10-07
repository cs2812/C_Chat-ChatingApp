const socket= io();
var username;
var chats = document.querySelector(".chats")
var users_List= document.querySelector(".users-list")
var users_count = document.querySelector(".users-count")
var sendBtn = document.querySelector("#msg-send")
var user_msg = document.querySelector("#user-msg")
do{
    username = prompt("Enter Your Name: ");
}while(!username);

/* It will be called when you will join */
socket.emit("new user joined",username)

/*Notifying that user is joined */
socket.on("user-connected",(socket_name)=>{
    userJoinLeft(socket_name,"joined")
})

/* function to create joined/Left status div*/
function userJoinLeft(name,status){
let div=document.createElement("div")
div.classList.add("user-join");
let content=`<p> <b>${name}</b> ${status} the chat</p>`
div.innerHTML=content;
chats.appendChild(div) 
chats.scrollTop = chats.scrollHeight
}

/*Notifying that user is Left */
socket.on("user-disconnected",(socket_name)=>{
    userJoinLeft(socket_name,"Left")
})

/* For updating users list and user counts */
socket.on("user-list",(users)=>{
    users_List.innerHTML="";
    let arr=Object.values(users)
    for(let i=0;i<arr.length;i++){
        let p=document.createElement("p")
        p.innerText=arr[i]
        users_List.appendChild(p);
    }
    users_count.innerText=arr.length
    // console.log(arr.length)   
})

/* for sending message */
sendBtn.addEventListener("click",()=>{
    let data={
        user:username,
        msg:user_msg.value
    }
    if(user_msg.value!=""){
        appendMessage(data,"outgoing");
        socket.emit("message",data);
    }
    user_msg.value="";   
})

user_msg.addEventListener("keydown", (e)=> {
    if (e.key === "Enter") { // key code of the keybord key
      let data={
        user:username,
        msg:user_msg.value
    }
    if(user_msg.value != "" ){
        appendMessage(data,"outgoing");
        socket.emit("message",data);
    }
    user_msg.value="";   
    }
  });




socket.on("message",(data)=>{
    appendMessage(data,"incoming");
})
socket.on("history",(history)=>{
    for(let m of history){
        appendMessage(m,"incoming")
    }
})
function appendMessage(data,status){
    let div=document.createElement("div")
    div.classList.add("message",status);
    let content=`
    <h5>${data.user}</h5>
    <p>${data.msg}</p>`
    div.innerHTML=content;
    chats.appendChild(div);
    chats.scrollTop = chats.scrollHeight
}

