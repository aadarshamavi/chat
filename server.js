const express = require("express")
const app = express()
const http = require("http")
const server = http.Server(app)
const io = require("socket.io")(server)

app.use(express.static(__dirname+"/public"))

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html")
})

io.on("connection",(socket)=>{
    console.log("User connected")
    socket.on("send-message",(data)=>{
        console.log(data)
        socket.broadcast.emit("new-messages",data)
    })
    socket.on("new-user-connected",username=>{
        socket.broadcast.emit("welcome-user",username)
    })
})

server.listen(3000)