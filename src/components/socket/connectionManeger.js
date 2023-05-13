import React from "react";
import { socket } from "../../socket/socket";
export function ConnectionManager() {
  function connect() {
    console.log("click");
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
    </>
  );
}
