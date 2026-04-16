const User = require("../models/User");
const Note = require("../models/Note");
const bcrypt = require("bcrypt");
//asyncHandler (from express-async-handler) wraps your async function and automatically catches any rejected promises or thrown erro so no need for try catch
const asyncHandler = require("express-async-handler");

// @desc Get all notes
// @route GET /notes
// @access Private

const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find();
});
