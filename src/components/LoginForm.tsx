import { ChangeEvent, MouseEvent, useRef, useState } from "react";
import { createUseStyles } from "react-jss";
import { handleSignIn } from "../utils/firebase";
import Button from "./Button";
import Spinner from "./Spinner";

const DEFAULT_LOGIN = {
  email: "",
  password: "",
};

const useStyles = createUseStyles({
  box: {
    width: 300,
    position: "relative",
    height: "100%",
    flexDirection: "column",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "1px solid #ccc",
    padding: 24,
    borderRadius: 8,
  },
  title: {
    fontSize: 26,
    height: 48,
  },
  inputWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  inputGroup: {
    width: 300,
    display: "flex",
    flexDirection: "column",
    "& input": {
      height: 32,
      margin: "4px 0",
      fontSize: 18,
    },
    margin: "12px 0",
    padding: "0 24px",
  },
  submit: {
    border: "1px solid black",
    padding: "6px 12px",
    color: "#fff",
    background: "#000",
    textTransform: "uppercase",
    height: 40,
    fontSize: 16,
    "&:disabled": {
      color: "#ccc",
      borderColor: "#ccc",
      background: "transparent",
      pointerEvents: "none",
      cursor: "progress",
    },
  },
  error: {
    width: "100%",
    marginTop: 8,
    fontSize: 14,
    fontStyle: "italic",
    whiteSpace: "pre-line",
    color: "#de398b",
    textAlign: "center",
  },
});

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState(DEFAULT_LOGIN);
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState(false);
  const classes = useStyles();

  const handleValuesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onError = () => {
    setLoading(false);
    setError(true);
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const signIn = async (e: MouseEvent<HTMLButtonElement>) => {
    const { email, password } = loginData;
    setLoading(true);
    const user = await handleSignIn(email, password);
    if (!user) {
      onError();
    }
  };

  return (
    <div>
      <form ref={formRef} noValidate>
        <div className={classes.box}>
          <h1 className={classes.title}>Login</h1>
          <div className={classes.inputGroup}>
            <input
              id="user"
              autoComplete="username"
              name="email"
              type="email"
              disabled={loading}
              placeholder="Email"
              onChange={handleValuesChange}
            />
            <input
              autoComplete="current-password"
              name="password"
              disabled={loading}
              type="password"
              placeholder="Heslo"
              onChange={handleValuesChange}
            />
          </div>
          <Button
            className={classes.submit}
            type="submit"
            disabled={loading}
            onClick={signIn}
          >
            Přihlásit se
          </Button>
          {error && (
            <div className={classes.error}>
              Máš to špatně
              <br />
              Uklidni se - výdech, nádech
              <br />
              Snad nemrazí tě z toho v zádech?
            </div>
          )}
        </div>
      </form>
      {loading && <Spinner />}
    </div>
  );
};

export default LoginForm;
