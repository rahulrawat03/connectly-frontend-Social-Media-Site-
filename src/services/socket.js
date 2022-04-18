import { io } from "socket.io-client";

const socket = io.connect(process.env.REACT_APP_BACKEND);

export function addUser(userId) {
  socket.emit("addUser", userId);
}

export function sendMessage(userId, friendId, text) {
  socket.emit("sendMessage", { userId, friendId, text });
}

export function listenMessage(handler) {
  socket.on("receiveMessage", handler);
}

export function offMessageListener(handler) {
  socket.off("receiveMessage", handler);
}

export function sendBadge(friendId, convId) {
  socket.emit("sendBadge", { friendId, convId });
}

export function listenBadge(handler) {
  socket.on("receiveBadge", handler);
}

export function offBadgeListener(handler) {
  socket.off("receiveBadge", handler);
}
