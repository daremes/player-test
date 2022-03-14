import { createUseStyles } from "react-jss";
import { VscLoading } from "react-icons/vsc";
import classNames from "classnames";

const useStyles = createUseStyles({
  wrapper: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    position: "absolute",
    top: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 300,
    overflow: "hidden",
  },
  icon: {
    animation: "$spin 500ms infinite linear",
  },
  "@keyframes spin": {
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: "rotate(360deg)",
    },
  },
});

const Spinner = () => {
  const classes = useStyles();

  return (
    <div className={classNames(classes.wrapper)}>
      <VscLoading className={classNames(classes.icon)} size={32} />
    </div>
  );
};

export default Spinner;
