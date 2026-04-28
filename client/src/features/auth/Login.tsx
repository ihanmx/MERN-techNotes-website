import { useRef, useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightToBracket,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch } from "../../app/hooks";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import {
  Logo,
  Card,
  Input,
  Label,
  Button,
  Checkbox,
  Alert,
  Spinner,
} from "../../ui";

//"If this function returns true, you can trust that err is a FetchBaseQueryError from now on."
const isFetchBaseQueryError = (err: unknown): err is FetchBaseQueryError =>
  typeof err === "object" && err !== null && "status" in err;

const Login = () => {
  const userRef = useRef<HTMLInputElement>(null);
  const errRef = useRef<HTMLParagraphElement>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current?.focus();
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

  if (isLoading)
    return (
      <section className="flex-1 flex items-center justify-center p-6">
        <Spinner size={40} label="Signing in..." />
      </section>
    );

  return (
    <section className="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size={44} />
        </div>

        <Card>
          <header className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight">
              Employee Login
            </h1>
            <p className="text-sm text-ink-400 mt-1">
              Sign in with your staff credentials.
            </p>
          </header>

          <p
            ref={errRef}
            className={errMsg ? "block mb-4" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg && <Alert tone="danger">{errMsg}</Alert>}
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                ref={userRef}
                value={username}
                onChange={handleUserInput}
                autoComplete="off"
                required
                placeholder="e.g. janedoe"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={handlePwdInput}
                required
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              rightIcon={<FontAwesomeIcon icon={faRightToBracket} />}
            >
              Sign In
            </Button>

            <Checkbox
              id="persist"
              onChange={handleToggle}
              checked={persist}
              label="Trust this device"
            />
          </form>
        </Card>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-ink-400 hover:text-white transition-colors"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Login;