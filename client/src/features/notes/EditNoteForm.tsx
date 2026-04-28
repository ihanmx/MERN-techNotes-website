import { useState } from "react";
import type React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";

import { useUpdateNoteMutation, useDeleteNoteMutation } from "./notesApiSlice";
import type { INote } from "./notesApiSlice";
import type { IUser } from "../users/usersApiSlice";
import useAuth from "../../hooks/useAuth";

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
    <option key={user.id} value={user.id}>
      {user.username}
    </option>
  ));

  const errClass = isError || isDelError ? "errmsg" : "offscreen";
  const validTitleClass = !title ? "form__input--incomplete" : "";
  const validTextClass = !text ? "form__input--incomplete" : "";
  const errContent = getErrorMessage(error) || getErrorMessage(delerror);

  return (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="form" onSubmit={(e) => e.preventDefault()}>
        <div className="form__title-row">
          <h2>Edit Note #{note.ticket}</h2>
          <div className="form__action-buttons">
            <button
              type="button"
              className="icon-button"
              title="Save"
              onClick={onSaveNoteClicked}
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {(isManager || isAdmin) && (
              <button
                type="button"
                className="icon-button"
                title="Delete"
                onClick={onDeleteNoteClicked}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            )}
          </div>
        </div>

        <label className="form__label" htmlFor="note-title">
          Title:
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="note-title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={onTitleChanged}
        />

        <label className="form__label" htmlFor="note-text">
          Text:
        </label>
        <textarea
          className={`form__input form__input--text ${validTextClass}`}
          id="note-text"
          name="text"
          value={text}
          onChange={onTextChanged}
        />

        <div className="form__row">
          <div className="form__divider">
            <label
              className="form__label form__checkbox-container"
              htmlFor="note-completed"
            >
              WORK COMPLETE:
              <input
                className="form__checkbox"
                id="note-completed"
                name="completed"
                type="checkbox"
                checked={completed}
                onChange={onCompletedChanged}
              />
            </label>

            <label
              className="form__label form__checkbox-container"
              htmlFor="note-username"
            >
              ASSIGNED TO:
            </label>
            <select
              id="note-username"
              name="username"
              className="form__select"
              value={userId}
              onChange={onUserIdChanged}
            >
              {options}
            </select>
          </div>
          <div className="form__divider">
            <p className="form__created">
              Created:
              <br />
              {formatDateTime(note.createdAt)}
            </p>
            <p className="form__updated">
              Updated:
              <br />
              {formatDateTime(note.updatedAt)}
            </p>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditNoteForm;
