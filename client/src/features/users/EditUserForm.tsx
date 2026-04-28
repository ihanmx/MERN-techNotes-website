import { useState } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import { useUpdateUserMutation, useDeleteUserMutation } from "./usersApiSlice";
import type { IUser } from "./usersApiSlice";
import { ROLES } from "../../config/roles";
import type { Role } from "../../config/roles";
import {
  Alert,
  Card,
  Checkbox,
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
    <option key={role} value={role} className="bg-surface-2 text-ink-100">
      {role}
    </option>
  ));

  const canSave = password
    ? [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    : [roles.length, validUsername].every(Boolean) && !isLoading;

  const errContent = getErrorMessage(error) || getErrorMessage(delerror);
  const showError = (isError || isDelError) && errContent;

  return (
    <section>
      <PageHeader
        title="Edit User"
        subtitle="Update credentials, roles, and account status"
        actions={
          <>
            <IconButton
              tone="primary"
              label="Save"
              onClick={onSaveUserClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </IconButton>
            <IconButton
              tone="danger"
              label="Delete"
              onClick={onDeleteUserClicked}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </IconButton>
          </>
        }
      />

      {showError && (
        <div className="mb-5">
          <Alert tone="danger">{errContent}</Alert>
        </div>
      )}

      <Card>
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
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
            <Label
              htmlFor="password"
              hint="[empty = no change · 4-12 chars incl. !@#$%]"
            >
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={onPasswordChanged}
              invalid={Boolean(password) && !validPassword}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
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

            <div>
              <Label>Status</Label>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <Checkbox
                  id="user-active"
                  name="user-active"
                  checked={active}
                  onChange={onActiveChanged}
                  label="Active account"
                />
                <p className="mt-2 text-xs text-ink-500">
                  Inactive users cannot log in.
                </p>
              </div>
            </div>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default EditUserForm;