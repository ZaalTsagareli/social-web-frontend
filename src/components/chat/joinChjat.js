import { socket } from "../../socket/socket";
export function JoinChat() {
  const joinChat = () => {
    socket.emit("join", { chatId: 4 });
  };
  return <button onClick={joinChat}>join chat</button>;
}
