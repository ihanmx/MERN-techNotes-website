import { useState } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import type { INote } from "./notesApiSlice";
import type { IUser } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";
import {
  Alert,
  Badge,
  Card,
  Checkbox,
  IconButton,
  Input,
  Label,
  PageHeader,
  Select,
  Textarea,
} from "../../ui";

interface EditNoteFormProps {
  note: INote;
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

const formatDateTime = (iso: string): string =>
  new Date(iso).toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

const EditNoteForm = ({ note, users }: EditNoteFormProps) => {
  const [updateNote, { isLoading, isError, error }] = useUpdateNoteMutation();
  const [deleteNote, { isError: isDelError, error: delerror }] =
    useDeleteNoteMutation();
  const navigate = useNavigate();
  const { isManager, isAdmin } = useAuth();

  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const [completed, setCompleted] = useState(note.completed);
  const [userId, setUserId] = useState(note.user);

  const onTitleChanged = (e: React.ChangeEvent<HTMLInputElement>) =>
    setTitle(e.target.value);
  const onTextChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setText(e.target.value);
  const onCompletedChanged = () => setCompleted((prev) => !prev);
  const onUserIdChanged = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setUserId(e.target.value);

  const canSave = [title, text, userId].every(Boolean) && !isLoading;

  const onSaveNoteClicked = async () => {
    if (!canSave) return;
    try {
      await updateNote({
        id: note.id,
        user: userId,
        title,
        text,
        completed,
      }).unwrap();
      navigate("/dash/notes");
    } catch {
      /* surfaced via error state */
    }
  };

  const onDeleteNoteClicked = async () => {
    try {
      await deleteNote({ id: note.id }).unwrap();
      navigate("/dash/notes");
    } catch {
      /* surfaced via delerror state */
    }
  };

  const options = users.map((user) => (
    <option key={user.id} value={user.id} className="bg-surface-2 text-ink-100">
      {user.username}
    </option>
  ));

  const errContent = getErrorMessage(error) || getErrorMessage(delerror);
  const showError = (isError || isDelError) && errContent;

  return (
    <section>
      <PageHeader
        title={
          <span className="inline-flex items-center gap-3 flex-wrap">
            Edit Note
            <Badge tone="secondary" className="font-mono">
              #{note.ticket}
            </Badge>
          </span>
        }
        subtitle={
          completed ? (
            <Badge tone="success" dot>
              Completed
            </Badge>
          ) : (
            <Badge tone="danger" dot>
              Open
            </Badge>
          )
        }
        actions={
          <>
            <IconButton
              tone="primary"
              label="Save"
              onClick={onSaveNoteClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </IconButton>
            {(isManager || isAdmin) && (
              <IconButton
                tone="danger"
                label="Delete"
                onClick={onDeleteNoteClicked}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </IconButton>
            )}
          </>
        }
      />

      {showError && (
        <div className="mb-5">
          <Alert tone="danger">{errContent}</Alert>
        </div>
      )}

      <Card>
        <form
          className="space-y-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <Label htmlFor="note-title">Title</Label>
            <Input
              id="note-title"
              name="title"
              type="text"
              autoComplete="off"
              value={title}
              onChange={onTitleChanged}
              invalid={!title}
            />
          </div>

          <div>
            <Label htmlFor="note-text">Text</Label>
            <Textarea
              id="note-text"
              name="text"
              value={text}
              onChange={onTextChanged}
              invalid={!text}
            />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4">
              <Checkbox
                id="note-completed"
                name="completed"
                checked={completed}
                onChange={onCompletedChanged}
                label="Work complete"
              />

              <div>
                <Label htmlFor="note-username">Assigned to</Label>
                <Select
                  id="note-username"
                  name="username"
                  value={userId}
                  onChange={onUserIdChanged}
                >
                  {options}
                </Select>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-wider text-ink-400">
                  Created
                </div>
                <div className="mt-1 text-ink-100 font-medium">
                  {formatDateTime(note.createdAt)}
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs uppercase tracking-wider text-ink-400">
                  Last updated
                </div>
                <div className="mt-1 text-ink-100 font-medium">
                  {formatDateTime(note.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </form>
      </Card>
    </section>
  );
};

export default EditNoteForm;