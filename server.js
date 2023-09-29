const express = require("express");
const app = express();
const http = require("http");
const server = http.Server(app);
const io = require("socket.io")(server);

let users = [];
let messages = [];

app.use(express.static(__dirname + "/public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  users.push(socket.id);

  socket.emit("olderMessages", messages);
  socket.on("send-message", (data) => {
    messages.push(data);
    socket.broadcast.emit("new-messages", data);
  });

  socket.on("new-user-connected", (username) => {
    socket.broadcast.emit("welcome-user", username);
  });
  socket.on("disconnect", () => {
    users = users.filter((id) => id !== socket.id);
    if (users.length == 0) {
      messages = [];
    }
  });
});

server.listen(3000);
