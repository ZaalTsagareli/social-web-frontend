import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = "http://localhost:4500";

export const socket = (token) =>
  io(URL, {
    autoConnect: false,
    extraHeaders: {
      token: token,
    },
  });
