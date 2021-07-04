import * as http from "http";

import { Server } from "socket.io";
import cors from "cors";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    ori: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Server is running");
});

io.on("connection", (socket) => {
  socket.emit("id", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("call_ended");
  });

  socket.on("call_user", ({ userCallId, signalData, from, name }) => {
    io.to(userCallId).emit("call_user", { signal: signalData, from, name });
  });

  socket.on("answer_call", (data) => {
    io.to(data.to).emit("call_accepted", data.signal);
  });
});

server.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
