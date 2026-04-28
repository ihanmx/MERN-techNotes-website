import { useRef, useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type React from "react";
import { useAppDispatch } from "../../app/hooks";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";

//"If this function returns true, you can trust that err is a FetchBaseQueryError from now on."
const isFetchBaseQueryError = (err: unknown): err is FetchBaseQueryError =>
  typeof err === "object" && err !== null && "status" in err;

const Login = () => {
  const userRef = useRef<HTMLInputElement>(null); //must have null +and generic
  const errRef = useRef<HTMLParagraphElement>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current?.focus(); //must have ?
  }, []);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/dash");
    } catch (err) {
      if (!isFetchBaseQueryError(err)) {
        setErrMsg("No Server Response");
      } else if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else if (
        typeof err.data === "object" &&
        err.data !== null &&
        "message" in err.data
      ) {
        setErrMsg(String(err.data.message));
      } else {
        setErrMsg("Login failed");
      }
      errRef.current?.focus();
    }
  };

  const handleUserInput = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setErrMsg("");
  };

  const handlePwdInput = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrMsg("");
  };

  const handleToggle = () => setPersist((prev) => !prev);

  const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading) return <p>Loading...</p>;

  return (
    <section className="public">
      <header>
        <h1>Employee Login</h1>
      </header>
      <main className="login">
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label htmlFor="username">Username:</label>
          <input
            className="form__input"
            type="text"
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            className="form__input"
            type="password"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />
          <button className="form__submit-button">Sign In</button>

          <label htmlFor="persist" className="form__persist">
            <input
              type="checkbox"
              className="form__checkbox"
              id="persist"
              onChange={handleToggle}
              checked={persist}
            />
            Trust This Device
          </label>
        </form>
      </main>
      <footer>
        <Link to="/">Back to Home</Link>
      </footer>
    </section>
  );
};

export default Login;

// const isFetchBaseQueryError = (err: unknown): err is FetchBaseQueryError =>
//   typeof err === "object" && err !== null && "status" in err;

// Part 1 — (err: unknown)
// Standard parameter list. "This function takes one parameter named err, typed unknown."

// Part 2 — :
// The colon that separates parameters from the return type — same as in (): number or (x: string): boolean.

// Part 3 — err is FetchBaseQueryError
// This is the return type. Normally you'd write a plain type here like boolean or string. But TS lets you write a special form: <paramName> is <Type>.

// This means:

// "The function returns a boolean. And when that boolean is true, the compiler should treat err as a FetchBaseQueryError from then on."

// So is is an operator?
// Sort of — but not in the regular sense.

// It's not an arithmetic or logical operator like +, &&, ===.
// It's a TypeScript-only keyword that exists only in the return-type position of a function signature.
// It compiles down to nothing at runtime — purely a hint to the type system.
// You can't do this:

// if (err is FetchBaseQueryError) { ... }   // ❌ syntax error
// The is keyword only works in return type annotations, nowhere else.
