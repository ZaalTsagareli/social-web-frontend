import { Fragment, useState } from "react";
import classes from "./signup.module.css";
import Input from "../elements/input/input";
import axios from "axios";
import Button from "../elements/button/button";
import Loading from "../loading/loading";
export default function Signup(props) {
  const [email, setEmail] = useState("");
  const [passwrd, setPassword] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const signUp = async () => {
    try {
      setError(false);
      setLoading(true);
      const req = await axios.post(
        process.env.REACT_APP_SERVER + "auth/registration",
        {
          email: email,
          password: passwrd,
        }
      );
      const data = req.data;
      setText(data);
      setLoading(false);
    } catch (err) {
      setError(true);
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
        <Button onClick={signUp} content="signup"></Button>
        {loading && <Loading />}

        <p style={error ? { color: "red" } : {}}>
          {text.message ? text.message : text}
        </p>
      </div>
    </Fragment>
  );
}
