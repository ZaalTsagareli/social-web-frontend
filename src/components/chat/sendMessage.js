import { Fragment, useEffect, useRef, useState } from "react";
import classes from "./chat.module.css";
import { socket } from "../../socket/socket";

export function SendMessage(props) {
  const sms = useRef();
  const smh = useRef(null);
  const [v, setV] = useState(props.messages.length);
  // console.log()

  const send = () => {
    props.socket.emit("message", JSON.stringify({ key: sms.current.value }));
    sms.current.value = "";
    smh.current?.scrollIntoView({ behavior: "smooth" });
    setV(props.messages.length);
  };

  useEffect(() => {
    console.log("vcdilob");
    smh?.current?.scrollIntoView({ behavior: "smooth" });
  }, [props.messages]);

  return (
    <div className={classes["container"]}>
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
      <div className={classes.control}>
        <input className={classes.input} placeholder="type" ref={sms} />
        <button className={classes["send-button"]} onClick={send}>
          Send Message
        </button>
      </div>
    </div>
  );
}
