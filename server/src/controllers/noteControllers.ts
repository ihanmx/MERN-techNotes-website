import type { RequestHandler } from "express";
import User from "../models/User.js";
import Note from "../models/Note.js";
import { Types } from "mongoose";

interface CreateNoteBody {
  user?: string;
  title?: string;
  text?: string;
}

interface UpdateNoteBody {
  id?: string;
  user?: string;
  title?: string;
  text?: string;
  completed?: boolean;
}

interface DeleteNoteBody {
  id?: string;
}

// @desc Get all notes
// @route GET /notes
// @access Private
export const getAllNotes: RequestHandler = async (_req, res) => {
  const notes = await Note.find().lean();

  if (!notes?.length) {
    res.status(400).json({ message: "No notes found" });
    return;
  }

  const notesWithUser = await Promise.all(
    notes.map(async (note) => {
      const user = await User.findById(note.user).lean().exec();
      return { ...note, username: user?.username ?? "unknown" };
    }),
  );

  res.json(notesWithUser);
};

// @desc Create new note
// @route POST /notes
// @access Private
export const createNewNote: RequestHandler<
  unknown,
  unknown,
  CreateNoteBody
> = async (req, res) => {
  const { user, title, text } = req.body;

  if (
    typeof user !== "string" ||
    typeof title !== "string" ||
    typeof text !== "string"
  ) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const duplicate = await Note.findOne({ title }).lean().exec();
  if (duplicate) {
    res.status(409).json({ message: "Duplicate note title" });
    return;
  }

  const note = await Note.create({ user, title, text });
  if (note) {
    res.status(201).json({ message: "New note created" });
  } else {
    res.status(400).json({ message: "Invalid note data received" });
  }
};

// @desc Update a note
// @route PATCH /notes
// @access Private
export const updateNote: RequestHandler<
  unknown,
  unknown,
  UpdateNoteBody
> = async (req, res) => {
  const { id, user, title, text, completed } = req.body;

  if (
    typeof id !== "string" ||
    typeof user !== "string" ||
    typeof title !== "string" ||
    typeof text !== "string" ||
    typeof completed !== "boolean"
  ) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  const note = await Note.findById(id).exec();
  if (!note) {
    res.status(400).json({ message: "Note not found" });
    return;
  }

  const duplicate = await Note.findOne({ title }).lean().exec();
  if (duplicate && duplicate._id.toString() !== id) {
    res.status(409).json({ message: "Duplicate note title" });
    return;
  }

  note.user = new Types.ObjectId(user);
  note.title = title;
  note.text = text;
  note.completed = completed;

  const updatedNote = await note.save();
  res.json(`'${updatedNote.title}' updated`);
};

// @desc Delete a note
// @route DELETE /notes
// @access Private
export const deleteNote: RequestHandler<
  unknown,
  unknown,
  DeleteNoteBody
> = async (req, res) => {
  const { id } = req.body;
  if (typeof id !== "string") {
    res.status(400).json({ message: "Note ID required" });
    return;
  }

  const note = await Note.findById(id).exec();
  if (!note) {
    res.status(400).json({ message: "Note not found" });
    return;
  }

  await note.deleteOne();
  res.json(`Note '${note.title}' with ID ${note._id} deleted`);
};
