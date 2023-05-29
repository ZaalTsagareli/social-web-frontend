import React from "react";

export function ConnectionState({ isConnected }) {
  return (
    <p>
      State: {"" + isConnected}. you : {localStorage.getItem("email")}
    </p>
  );
}
