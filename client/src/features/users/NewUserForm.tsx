import { useState } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

import { useAddNewUserMutation } from "./usersApiSlice";
import { ROLES } from "../../config/roles";
import type { Role } from "../../config/roles";

const USER_REGEX = /^[A-z]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const getErrorMessage = (err: unknown): string => {
  if (
    typeof err === "object" &&
    err !== null &&
    "data" in err &&
    typeof err.data === "object" &&
    err.data !== null &&
    "message" in err.data
  ) {
    return String(err.data.message);
  }
  return "";
};

const NewUserForm = () => {
  const [addNewUser, { isLoading, isError, error }] = useAddNewUserMutation();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState<Role[]>(["Employee"]);

  const validUsername = USER_REGEX.test(username);
  const validPassword = PWD_REGEX.test(password);

  const onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const onRolesChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );
    setRoles(values as Role[]);
  };

  const canSave =
    [roles.length, validUsername, validPassword].every(Boolean) && !isLoading;

  const onSaveUserClicked = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSave) return;
    try {
      await addNewUser({ username, password, roles }).unwrap();
      setUsername("");
      setPassword("");
      setRoles([]);
      navigate("/dash/users");
    } catch {
      // surfaced via the `error` state
    }
  };

  const options = Object.values(ROLES).map((role) => (
    <option key={role} value={role}>
      {role}
    </option>
  ));

  const errClass = isError ? "errmsg" : "offscreen";
  const validUserClass = !validUsername ? "form__input--incomplete" : "";
  const validPwdClass = !validPassword ? "form__input--incomplete" : "";
  const validRolesClass = !roles.length ? "form__input--incomplete" : "";

  return (
    <>
      <p className={errClass}>{getErrorMessage(error)}</p>

      <form className="form" onSubmit={onSaveUserClicked}>
        <div className="form__title-row">
          <h2>New User</h2>
          <div className="form__action-buttons">
            <button className="icon-button" title="Save" disabled={!canSave}>
              <FontAwesomeIcon icon={faSave} />
            </button>
          </div>
        </div>

        <label className="form__label" htmlFor="username">
          Username: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validUserClass}`}
          id="username"
          name="username"
          type="text"
          autoComplete="off"
          value={username}
          onChange={onUsernameChanged}
        />

        <label className="form__label" htmlFor="password">
          Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
        />

        <label className="form__label" htmlFor="roles">
          ASSIGNED ROLES:
        </label>
        <select
          id="roles"
          name="roles"
          className={`form__select ${validRolesClass}`}
          multiple
          size={3}
          value={roles}
          onChange={onRolesChanged}
        >
          {options}
        </select>
      </form>
    </>
  );
};

export default NewUserForm;
