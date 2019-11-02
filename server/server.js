const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const router = require("./router");
const cors = require("cors");
const { createUser, deleteUser, getUser } = require("./functions");

const app = express();

app.use(router);
app.use(cors);

const server = http.createServer(app);
const io = socketio(server);

io.on("connection", socket => {
  console.log("we have a new connection! - " + socket.id);
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = createUser({ name, id: socket.id, room });
    if (error) return callback(error);

    socket.join(room);

    socket.emit("servermessage", {
      sentby: "admin",
      msg: `${name}, welcome to ${room}!`
    });
    socket.broadcast.to(room).emit("servermessage", {
      sentby: "admin",
      msg: `${name} has joined the chat!`
    });
    console.log(`${name} has joined the room ${room}!`);
    callback();
  });

  socket.on("clientmessage", ({ sentby, msg }, callback) => {
    const user = getUser(socket.id);
    // console.log(room.room);
    // const { room } = getUser(socket.id);
    io.to(user.room).emit("servermessage", { sentby, msg });
    callback();
  });
  socket.on("disconnect", () => {
    const user = deleteUser(socket.id);
    console.log(`${user.name} has left the chat`);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
