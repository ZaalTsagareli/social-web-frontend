import classes from "./header.module.css";
import { Link, NavLink } from "react-router-dom";
export default function Headers(props) {
  return (
    <ul className={classes.header}>
      <li className={classes.li}>
        <NavLink
          className={({ isActive }) => (isActive ? classes.active : "")}
          to="/signup"
        >
          signup
        </NavLink>
      </li>
      <li>
        {" "}
        <NavLink
          className={({ isActive }) => (isActive ? classes.active : "")}
          to="/sigin"
        >
          Log in
        </NavLink>
      </li>
    </ul>
  );
}
