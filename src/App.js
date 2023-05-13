import { Route, Routes } from "react-router-dom";
import Headers from "./components/header/header";
import Signup from "./components/signup/signup";
import { socket } from "./socket/socket";
import { useDispatch } from "react-redux";
import { ConnectionState } from "./components/socket/connectionState";
import { Events } from "./components/socket/events";
import axios from "axios";

import { ConnectionManager } from "./components/socket/connectionManeger";
import { userSliceActions } from "./store/userSlice";
import SigIn from "./components/sigin/sigin";
import { JoinChat } from "./components/chat/joinChjat";
import { useSelector } from "react-redux";

import { Fragment, useEffect, useState } from "react";
import { SendMessage } from "./components/chat/sendMessage";

function App() {
  const token1 = localStorage.getItem("token");
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);
  const [sent, setSent] = useState("");
  const [sockett, setSockett] = useState(null);
  const [messages, setMessages] = useState([]);
  const dispatch = useDispatch();
  const token2 = useSelector((data) => data.userSlice.token);

  function getNowTime() {
    var currentDate = new Date();

    var year = currentDate.getFullYear();
    var month = currentDate.getMonth() + 1; // Months are zero-based, so we add 1
    var day = currentDate.getDate();

    var hours = currentDate.getHours();
    var minutes = currentDate.getMinutes();

    // Formatting the components with leading zeros if necessary
    var formattedMonth = month < 10 ? "0" + month : month;
    var formattedDay = day < 10 ? "0" + day : day;
    var formattedHours = hours < 10 ? "0" + hours : hours;
    var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    var fullDate =
      year +
      "-" +
      formattedMonth +
      "-" +
      formattedDay +
      " " +
      formattedHours +
      ":" +
      formattedMinutes;

    return fullDate;
  }
  function formatDateTime(dateString) {
    console.log(dateString, "dsasadasfa");
    console.log(dateString);
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
      console.log(date, "data");
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
        console.log(err);
        setIsConnected(false);
      }

      function onFooEvent(value) {
        setFooEvents((previous) => [...previous, value]);
      }
      io.connect();
      io.on("connection", onConnect);
      io.on("disconnect", (err) => onDisconnect(err));
      io.on("error", (err) => {
        console.log(err);
        if (err === "token is not verifed") {
          alert(
            "we are sarry! your token is expired or is invalid, please login again."
          );
          localStorage.clear();
          window.location.reload();
        }
        console.log(err);
      });
      io.on("join", (data) => {
        console.log("joined chat");
      });
      io.on("message", (data) => {
        console.log("data", data);
        data["createdAt"] = formatDateTime(data["createdAt"]);
        setMessages((prev) => [...prev, data]);
      });
      io.on("sent", (data) => {
        setSent("sent");
      });

      return () => {
        io.off("sent");
        io.off("connect", onConnect);
        io.off("disconnect", onDisconnect);
        io.off("foo", onFooEvent);
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
              <Fragment>
                <ConnectionState isConnected={isConnected} />
                <Events events={fooEvents} />
                {/* <ConnectionManager />
                <JoinChat /> */}
                <SendMessage
                  socket={sockett}
                  setSent={setSent}
                  messages={messages}
                  sent={sent}
                />
              </Fragment>
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
