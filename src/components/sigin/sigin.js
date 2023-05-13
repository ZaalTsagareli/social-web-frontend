import { Fragment, useState } from "react";
import classes from "./sigin.module.css";
import Input from "../elements/input/input";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { userSliceActions } from "../../store/userSlice";
import axios from "axios";

import Button from "../elements/button/button";
import Loading from "../loading/loading";
export default function SigIn(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [passwrd, setPassword] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const Sigin = async () => {
    try {
      setError(false);

      setLoading(true);
      const req = await axios.post(
        process.env.REACT_APP_SERVER + "auth/login",
        {
          email: email,
          password: passwrd,
        }
      );
      const data = req.data;
      console.log(data);
      if (req.data.succses) {
        setText("succses");
        localStorage.setItem("user", true);
        localStorage.setItem("token", req.data.token);
        localStorage.setItem("email", email);
        dispatch(userSliceActions.setToken(req.data.token));
        dispatch(userSliceActions.setUser(email));
        navigate("/");
      } else setText(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setError(true);
      setText(null);
      setText(err.response.data);
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <div className={classes.body}>
        <Input onChange={setEmail} placeholder="email"></Input>
        <Input
          type="password"
          onChange={setPassword}
          placeholder="password"
        ></Input>
        <Button onClick={Sigin} content="log in"></Button>
        {loading && <Loading />}

        <p style={error ? { color: "red" } : {}}>
          {text.message ? text.message : text}
        </p>
      </div>
    </Fragment>
  );
}
