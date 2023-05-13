import classes from "./button.module.css";
export default function Button(props) {
  return (
    <button onClick={() => props.onClick()} className={classes.button}>
      {props.content}
    </button>
  );
}
