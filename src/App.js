import { Route, Routes } from "react-router-dom";
import Headers from "./components/header/header";
import Signup from "./components/signup/signup";
import { socket } from "./socket/socket";
import { useDispatch } from "react-redux";
import { ConnectionState } from "./components/socket/connectionState";
import { Events } from "./components/socket/events";
import axios from "axios";
import { Users } from "./components/users/user";
import "./App.css";

import { userSliceActions } from "./store/userSlice";
import SigIn from "./components/sigin/sigin";
import { useSelector } from "react-redux";

import { Fragment, useEffect, useState } from "react";
import { SendMessage } from "./components/chat/sendMessage";

function App() {
  const token1 = localStorage.getItem("token");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [sent, setSent] = useState("");
  const [sockett, setSockett] = useState(null);
  const [typers, setTypers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [usr, setUsers] = useState([]);
  const [isChatSelected, setSelectChat] = useState(false);
  const dispatch = useDispatch();
  const token2 = useSelector((data) => data.userSlice.token);

  function formatDateTime(dateString) {
    var date = new Date(dateString);
    var tzOffset = 4; // Offset for Georgia timezone (Tbilisi) in hours
    // var localOffset = date.getTimezoneOffset() / 60;
    // var hoursDiff = tzOffset + localOffset;

    // date.setHours(date.getHours() + hoursDiff);

    var now = new Date();
    var timeDiff = now.getTime() - date.getTime();

    if (timeDiff < 24 * 60 * 60 * 1000) {
      // Less than a day
      var hours = date.getHours();

      var minutes = date.getMinutes();
      return hours + ":" + (minutes < 10 ? "0" + minutes : minutes);
    } else {
      var options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZone: "Asia/Tbilisi",
      };
      var formatter = new Intl.DateTimeFormat("en-US", options);
      return formatter.format(date);
    }
  }

  useEffect(() => {
    async function getMessages(token) {
      try {
        const data = await axios.get(
          "http://localhost:4500/messages/getMessages/4",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const users = await axios.get("http://localhost:4500/chat/getUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const idk = users.data.map((user) => {
          return { user: user["email"] };
        });
        setUsers(idk);

        console.log(users);
        const mydata = data.data.map((data) => {
          var formattedDate = formatDateTime(data["createdAt"]);
          return {
            email: data["user"]["email"],
            sent: data["content"],
            id: data["id"],
            createdAt: formattedDate,
          };
        });

        mydata.sort(function (a, b) {
          return a.id - b.id; // Sort in descending order based on id property
        });
        setMessages(mydata);
      } catch (err) {
        // window.location.reload(true);
        console.log(err);
      }
    }

    if (token1) {
      dispatch(userSliceActions.setToken(token1));
      getMessages(token1);
    }
  }, [token1]);

  useEffect(() => {
    if (token1) {
      const io = socket(token1);
      // console.log(io);
      function onConnect() {
        setSockett(io);

        io.emit("join", { chatId: 4 });

        setIsConnected(true);
      }

      function onDisconnect(err) {
        // io.connect();
        setIsConnected(false);
      }

      io.connect();
      io.on("connection", onConnect);
      io.on("disconnect", (err) => onDisconnect(err));
      io.on("error", (err) => {
        if (err === "token is not verifed") {
          alert(
            "we are sarry! your token is expired or is invalid, please login again."
          );
          localStorage.clear();
          window.location.reload();
        }
      });
      io.on("join", (data) => {
        console.log("joined chat");
      });
      io.on("typing", (data) => {
        console.log(typers, "typersssssssssssss");
        const user = data["email"].split("@")[0];

        const exsists = typers.findIndex((data) => data === user);

        if (exsists === -1) {
          setTypers((prev) => [...prev, user]);
        } else {
          console.log("aq ar shemovdivar");
        }
      });
      io.on("message", (data) => {
        data["createdAt"] = formatDateTime(data["createdAt"]);
        setMessages((prev) => [...prev, data]);
      });
      io.on("stopTyping", (data) => {
        const user = data["email"].split("@")[0];
        const mynewData = typers.filter((data) => data !== user);

        setTypers(mynewData);
      });
      io.on("sent", (data) => {
        setSent("sent");
      });

      return () => {
        io.off("sent");
        io.off("connect", onConnect);
        io.off("disconnect", onDisconnect);
        io.off("join");
        io.off("message");
      };
    }
  }, [token1]);
  return (
    <div className="App">
      {token1 || token2 ? (
        <Routes>
          <Route
            path="/"
            element={
              <div className="everythingCont">
                <Users
                  chat={isChatSelected}
                  setChat={setSelectChat}
                  users={usr}
                />
                {isChatSelected && (
                  <SendMessage
                    typers={Array.from(new Set(typers))}
                    socket={sockett}
                    setSent={setSent}
                    messages={messages}
                    sent={sent}
                  />
                )}
              </div>
            }
          />
        </Routes>
      ) : (
        <Fragment>
          <Headers />

          <Routes>
            <Route path="/signup" element={<Signup />} />
            <Route path="/sigin" element={<SigIn />} />
          </Routes>
        </Fragment>
      )}
    </div>
  );
}

export default App;
