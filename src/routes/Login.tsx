import LoginForm from "../components/LoginForm";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

const Login = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <LoginForm />
    </div>
  );
};

export default Login;
