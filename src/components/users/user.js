import { useState } from "react";
import "./user.css";
export function Users(props) {
  const handleUserClick = (user) => {
    props.setChat(user);
  };

  return (
    <div className="users-container">
      {props.users.map((data) => (
        <div
          key={data.user}
          className={`user ${props.chat === data.user ? "selected" : ""}`}
          onClick={() => handleUserClick(data.user)}
        >
          <span>User: {data.user}</span>
        </div>
      ))}
    </div>
  );
}
