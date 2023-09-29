const socket = io();
let textarea = document.querySelector("textarea");
let main = document.querySelector("main");

let username = localStorage.getItem("username");
const userId =
  localStorage.getItem("userId") ||
  localStorage.getItem(
    "userId",
    localStorage.setItem("userId", Math.random().toString(32).split(".")[1])
  );
textarea.addEventListener("keyup", (e) => {
  let data = {
    username,
    message: e.target.value.trim(),
    userId,
  };
  if (e.key == "Enter" && data.message !== " ") {
    addMessages(data, "sent");
    socket.emit("send-message", data);
    e.target.value = "";
  }
});
socket.on("new-messages", (data) => {
  addMessages(data, "received");
});
function addMessages(data, type) {
  let p = document.createElement("p");
  p.innerText = data.username;
  let h3 = document.createElement("h3");
  h3.innerText = data.message;
  let messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.classList.add(type);
  messageDiv.appendChild(p);
  messageDiv.appendChild(h3);
  main.appendChild(messageDiv);
  scrollBottom();
}
function scrollBottom() {
  main.scrollTop = main.scrollHeight;
}
function addUsername() {
  let user = document.getElementById("username").value;
  if (user.length < 3) {
    alert("Minimun 3 letters are required");
  } else {
    username = user;
    socket.emit("new-user-connected", username);
    let dialog = document.querySelector("dialog");
    dialog.removeAttribute("open");
    localStorage.setItem("username", user);
  }
}
if (username) {
  let dialog = document.querySelector("dialog");
  dialog.removeAttribute("open");
}
socket.on("welcome-user", (userName) => {
  let p = document.createElement("p");
  p.innerText = userName + " joined the chat!";
  p.classList.add("user-entered");
  main.appendChild(p);
});

socket.on("olderMessages", (messages) => {
  console.log(messages);
  messages.forEach((message) => {
    if (message.userId == userId) {
      addMessages(message, "sent");
    } else {
      addMessages(message, "received");
    }
  });
});
