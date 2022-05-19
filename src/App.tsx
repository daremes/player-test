import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Button from "./components/Button";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Sons from "./routes/Sons";
import SonsPlayer from "./components/SonsPlayer";
import { useAuth } from "./utils/useAuth";
import { createUseStyles } from "react-jss";
import Spinner from "./components/Spinner";
import { FaPlay } from "react-icons/fa";

const useStyles = createUseStyles({
  base: {
    width: "100%",
    position: "relative",
    overflow: "hidden",
    fontFamily: "Helvetica, Roboto, sans-serif",
  },
  title: {
    textDecoration: "none",
    color: "#fff",
    "&:visited": {
      color: "#fff",
    },
    "& h1": {
      fontSize: 20,
    },
  },
  navigation: {
    boxSizing: "border-box",
    color: "#fff",
    height: 54,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#222",
    padding: "0 24px",
    boxShadow: "0 2px 4px 0 rgba(0,0,0,.4)",
  },
  layout: {
    margin: "8px 16px",
  },
});

export default function App() {
  const { currentUser, loading, handleSignOut } = useAuth();
  const classes = useStyles();

  if (loading) return <Spinner />;

  if (!currentUser) return <Login />;

  return (
    <Router>
      <div className={classes.base}>
        <nav className={classes.navigation}>
          <Link className={classes.title} to="/">
            <FaPlay color="#fafafa" />
          </Link>
          <Button onClick={handleSignOut}>Odhlásit se</Button>
        </nav>
        <div className={classes.layout}>
          <Routes>
            <Route path="sons" element={<Sons />}>
              <Route path="live" element={<SonsPlayer live="24" />} />
              <Route
                path="vod"
                element={<SonsPlayer idec="417233100051001" />}
              />
            </Route>
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
