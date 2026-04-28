import { useState } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

import { useAddNewUserMutation } from "./usersApiSlice";
import { ROLES } from "../../config/roles";
import type { Role } from "../../config/roles";
import {
  Alert,
  Card,
  IconButton,
  Input,
  Label,
  PageHeader,
  Select,
} from "../../ui";

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
    <option key={role} value={role} className="bg-surface-2 text-ink-100">
      {role}
    </option>
  ));

  return (
    <section>
      <PageHeader
        title="New User"
        subtitle="Provision a fresh staff account"
        actions={
          <IconButton
            tone="primary"
            label="Save"
            disabled={!canSave}
            onClick={() => {
              const form = document.getElementById(
                "new-user-form",
              ) as HTMLFormElement | null;
              form?.requestSubmit();
            }}
          >
            <FontAwesomeIcon icon={faSave} />
          </IconButton>
        }
      />

      {isError && (
        <div className="mb-5">
          <Alert tone="danger">{getErrorMessage(error)}</Alert>
        </div>
      )}

      <Card>
        <form id="new-user-form" className="space-y-5" onSubmit={onSaveUserClicked}>
          <div>
            <Label htmlFor="username" hint="[3-20 letters]">
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              autoComplete="off"
              value={username}
              onChange={onUsernameChanged}
              invalid={!validUsername}
            />
          </div>

          <div>
            <Label htmlFor="password" hint="[4-12 chars incl. !@#$%]">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={onPasswordChanged}
              invalid={!validPassword}
            />
          </div>

          <div className="max-w-sm">
            <Label htmlFor="roles">Assigned roles</Label>
            <Select
              id="roles"
              name="roles"
              multiple
              size={3}
              value={roles}
              onChange={onRolesChanged}
              invalid={!roles.length}
            >
              {options}
            </Select>
            <p className="mt-2 text-xs text-ink-500">
              Hold Ctrl / ⌘ to select multiple.
            </p>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default NewUserForm;