import { useState } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import type { IUser } from "./usersApiSlice";
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

interface EditUserFormProps {
  user: IUser;
}

const EditUserForm = ({ user }: EditUserFormProps) => {
  const [updateUser, { isLoading, isError, error }] = useUpdateUserMutation();
  const [deleteUser, { isError: isDelError, error: delerror }] =
    useDeleteUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState(user.username);
  const [password, setPassword] = useState("");
  const [roles, setRoles] = useState<Role[]>(user.roles as Role[]);
  const [active, setActive] = useState(user.active);

  const validUsername = USER_REGEX.test(username);
  const validPassword = PWD_REGEX.test(password);

  const onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);
  const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const onRolesChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, (o) => o.value);
    setRoles(values as Role[]);
  };
  const onActiveChanged = () => setActive((prev) => !prev);

  const onSaveUserClicked = async () => {
    const payload = password
      ? { id: user.id, username, password, roles, active }
      : { id: user.id, username, roles, active };
    try {
      await updateUser(payload).unwrap();
      navigate("/dash/users");
    } catch {
      /* surfaced via error state */
    }
  };

  const onDeleteUserClicked = async () => {
    try {
      await deleteUser({ id: user.id }).unwrap();
      navigate("/dash/users");
    } catch {
      /* surfaced via delerror state */
    }
  };

  const options = Object.values(ROLES).map((role) => (
    <option key={role} value={role}>
      {role}
    </option>
  ));

  const canSave = password
    ? [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    : [roles.length, validUsername].every(Boolean) && !isLoading;

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validUserClass = !validUsername ? "form__input--incomplete" : "";
  const validPwdClass =
    password && !validPassword ? "form__input--incomplete" : "";
  const validRolesClass = !roles.length ? "form__input--incomplete" : "";

  const errContent = getErrorMessage(error) || getErrorMessage(delerror);

  return (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit User</h2>
          <div className="form__action-buttons">
            <button
              type="button"
              className="icon-button"
              title="Save"
              onClick={onSaveUserClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            <button
              type="button"
              className="icon-button"
              title="Delete"
              onClick={onDeleteUserClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
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
          Password: <span className="nowrap">[empty = no change]</span>{" "}
          <span className="nowrap">[4-12 chars incl. !@#$%]</span>
        </label>
        <input
          className={`form__input ${validPwdClass}`}
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChanged}
        />

        <label
          className="form__label form__checkbox-container"
          htmlFor="user-active"
        >
          ACTIVE:
          <input
            className="form__checkbox"
            id="user-active"
            name="user-active"
            type="checkbox"
            checked={active}
            onChange={onActiveChanged}
          />
        </label>

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

export default EditUserForm;
