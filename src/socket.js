import { io } from "socket.io-client";

const socket = io("https://adminpro-server-n5dp.onrender.com", {
  autoConnect: true,
});

export default socket;
