import { useState } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";
import { useAddNewNoteMutation } from "./notesApiSlice";
import type { IUser } from "../users/usersApiSlice";
import {
  Alert,
  Card,
  IconButton,
  Input,
  Label,
  PageHeader,
  Select,
  Textarea,
} from "../../ui";

interface NewNoteFormProps {
  users: IUser[];
}

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

const NewNoteForm = ({ users }: NewNoteFormProps) => {
  const [addNewNote, { isLoading, isError, error }] = useAddNewNoteMutation();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(users[0]?.id ?? "");

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onTextChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setText(e.target.value);
  const onUserIdChanged = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setUserId(e.target.value);

  const canSave = [title, text, userId].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSave) return;
    try {
      await addNewNote({ user: userId, title, text }).unwrap();
      navigate("/dash/notes");
    } catch {
      /* surfaced via error state */
    }
  };

  const options = users.map((user) => (
    <option key={user.id} value={user.id} className="bg-surface-2 text-ink-100">
      {user.username}
    </option>
  ));

  return (
    <section>
      <PageHeader
        title="New techNote"
        subtitle="Open a fresh repair ticket"
        actions={
          <IconButton
            tone="primary"
            label="Save"
            disabled={!canSave}
            onClick={() => {
              const form = document.getElementById(
                "new-note-form",
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
        <form id="new-note-form" className="space-y-5" onSubmit={onSaveNoteClicked}>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              autoComplete="off"
              value={title}
              onChange={onTitleChanged}
              invalid={!title}
              placeholder="Short summary"
            />
          </div>

          <div>
            <Label htmlFor="text">Text</Label>
            <Textarea
              id="text"
              name="text"
              value={text}
              onChange={onTextChanged}
              invalid={!text}
              placeholder="Describe the issue or repair details..."
            />
          </div>

          <div className="max-w-sm">
            <Label htmlFor="username">Assigned to</Label>
            <Select
              id="username"
              name="username"
              value={userId}
              onChange={onUserIdChanged}
            >
              {options}
            </Select>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default NewNoteForm;