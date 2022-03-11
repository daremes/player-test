import { createUseStyles } from "react-jss";
import { Link, Outlet } from "react-router-dom";

const useStyles = createUseStyles({
  wrapper: {
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    fontSize: 26,
  },
  link: {
    color: "#000",
    "&:visited": {
      color: "inherit",
    },
  },
});

export default function Sons() {
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <div>
        <Link className={classes.link} to={"/sons/vod"}>
          VOD
        </Link>
      </div>
      <div>
        <Link className={classes.link} to={"/sons/live"}>
          Živě
        </Link>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
