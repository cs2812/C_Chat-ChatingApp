const http=require("http")
const express = require("express")
const app=express()
const server=http.createServer(app)
const io=require("socket.io")(server)
const port = process.env.PORT || 3000;

app.use(express.static(__dirname+"/public")) //for use scc file
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html") // for html file
})

// Socket.io Setup----->
const users={}
const history=[];
io.on("connection",(socket)=>{
    // console.log(socket.id);
    socket.on("new user joined",(username)=>{
        users[socket.id]=username
        // console.log(users)
        socket.broadcast.emit("user-connected",username) 
        io.emit("user-list",users);
    })
    socket.on("disconnect",()=>{
        socket.broadcast.emit("user-disconnected",users[socket.id]);
        delete users[socket.id];
        io.emit("user-list",users);
    })
    socket.on("message",(data)=>{
        history.push(data)
        socket.broadcast.emit("message",{user:data.user,msg:data.msg});
    })
    socket.emit("history",history)
})
//Socket.io Setup End---->
server.listen(port,()=>{
    console.log("server start at "+ port)
})