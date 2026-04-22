const User = require("../models/User");
const Note = require("../models/Note");
const bcrypt = require("bcrypt");
//asyncHandler (from express-async-handler) wraps your async function and automatically catches any rejected promises or thrown erro so no need for try catch
const asyncHandler = require("express-async-handler");

// @desc Get all users
// @route GET /users
// @access Private

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  //select to avoid return pass and lean to not get full doc as res

  if (!users?.length) {
    //!user is not enough it returns []
    return res.status(400).json({ message: "No Users found" });
  }
  return res.json(users);
});
// @desc Post new user
// @route Post /users
// @access Private

const createNewUser = asyncHandler(async (req, res) => {
  let { username, password, roles } = req.body;
  //confirm data
  if (!username || !password) {
    return res.status(400).json({ message: "All field are required" });
  }

  username = username.trim().toLowerCase();

  const duplicate = await User.findOne({ username }).lean().exec(); //// With .exec() — returns a true Promise (preferred)

  //check for duplicate
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  //hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  const UserObj =
    !Array.isArray(roles) || !roles.length
      ? { username, password: hashedPassword }
      : { username, password: hashedPassword, roles };

  //Create and store new user
  const user = await User.create(UserObj);

  if (user) {
    //created
    return res.status(201).json({ message: `New user ${username} created` });
  } else {
    return res.status(400).json({ message: "Invalid user data received" });
  }
});

// @desc Update a user
// @route PATCH /users
// @access Private

const updateUser = asyncHandler(async (req, res) => {
  let { id, username, password, roles, active } = req.body;

  //confirm data
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All field are required" });
  }

  username = username.trim().toLowerCase();

  const user = await User.findById(id).exec(); //no lean because we want this as mongoose doc with save and so on not js obj
  //exec makes is as promise so error stack trace is cleaner and more useful

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  //check for duplicate

  const duplicate = await User.findOne({ username }).lean().exec();
  //only allows update for original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;
  //because we dont always update password
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();
  res.json({ message: `${updatedUser.username} updated` });
});

// @desc Delete a user
// @route DELETE /users
// @access Private

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  // Confirm data
  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  //check if the user still have notes
  const notes = await Note.findOne({ user: id }).lean().exec();
  if (notes) {
    return res.status(400).json({ message: "User has assigned notes" });
  }

  // Does the user exist to delete?
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
