import { Fragment, useEffect, useRef, useState } from "react";
import classes from "./chat.module.css";
import { socket } from "../../socket/socket";
import { current } from "@reduxjs/toolkit";

export function SendMessage(props) {
  const sms = useRef();
  const smh = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [timer, setTimer] = useState(null);

  const inputChanged = (e) => {
    setInputValue(e.target.value);
    props.socket.emit("typing", { email: localStorage.getItem("email") });
    clearTimeout(timer);

    const newTimer = setTimeout(() => {
      props.socket.emit("stopTyping", { email: localStorage.getItem("email") });
      console.log("sending stop typing event");
    }, 500);

    setTimer(newTimer);
  };
  // console.log()

  const send = (event) => {
    event.preventDefault();

    if (sms?.current?.value !== "") {
      props.socket.emit("message", JSON.stringify({ key: sms.current.value }));
      sms.current.value = "";
      smh.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    console.log("vcdilob");
    smh?.current?.scrollIntoView({ behavior: "smooth" });
  }, [props.messages]);

  return (
    <div className={classes["container"]}>
      {console.log(props.typers)}
      {props.typers && (
        <p style={{ color: "white" }}>
          {props.typers.map((data) => {
            return `${data}, `;
          })}{" "}
          typing
        </p>
      )}

      <div className={classes["chat-container"]}>
        {props.messages.length > 0 &&
          props.messages.map((data, index) => {
            return (
              <div key={index} className={classes["chat-message"]} ref={smh}>
                <span className={classes["chat-author"]}>
                  {localStorage.getItem("email") === data.email
                    ? "you"
                    : data.email.split("@")[0]}
                </span>
                <span className={classes["chat-text"]}>: {data.sent}</span>
                <p className={classes.time}>Date: {data.createdAt}</p>
                <p className={classes["chat-divider"]}></p>
              </div>
            );
          })}
      </div>

      <form className={classes.control}>
        <input
          onChange={inputChanged}
          className={classes.input}
          placeholder="type"
          ref={sms}
        />
        <button className={classes["send-button"]} onClick={send}>
          Send Message
        </button>
      </form>
    </div>
  );
}
