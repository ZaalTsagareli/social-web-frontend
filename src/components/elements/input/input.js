import classes from "./input.module.css";

export default function Input(props) {
  return (
    <input
      type={props.type ? props.type : "text"}
      onChange={(event) => props.onChange(event.target.value)}
      className={classes.input}
      placeholder={props.placeholder}
    />
  );
}
