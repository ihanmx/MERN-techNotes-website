import bcrypt from "bcrypt";
import type { RequestHandler } from "express";
import User from "../models/User.js";
import Note from "../models/Note.js";

interface CreateUserBody {
  username?: string;
  password?: string;
  roles?: string[];
}

interface UpdateUserBody {
  id?: string;
  username?: string;
  password?: string;
  roles?: string[];
  active?: boolean;
}

interface DeleteUserBody {
  id?: string;
}

// @desc Get all users
// @route GET /users
// @access Private
export const getAllUsers: RequestHandler = async (_req, res) => {
  const users = await User.find().select("-password").lean();

  if (!users?.length) {
    res.status(400).json({ message: "No Users found" });
    return;
  }
  res.json(users);
};

// @desc Create new user
// @route POST /users
// @access Private

// RequestHandler<unknown, unknown, CreateUserBody>
//             ^Params  ^ResBody  ^ReqBody
export const createNewUser: RequestHandler<
  unknown,
  unknown,
  CreateUserBody
> = async (req, res) => {
  let { username, password, roles } = req.body;

  if (typeof username !== "string" || typeof password !== "string") {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  username = username.trim().toLowerCase();

  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    res.status(409).json({ message: "Duplicate username" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userObj =
    !Array.isArray(roles) || !roles.length
      ? { username, password: hashedPassword }
      : { username, password: hashedPassword, roles };

  const user = await User.create(userObj);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
};

// @desc Update a user
// @route PATCH /users
// @access Private
export const updateUser: RequestHandler<
  unknown,
  unknown,
  UpdateUserBody
> = async (req, res) => {
  let { id, username, password, roles, active } = req.body;

  if (
    typeof id !== "string" ||
    typeof username !== "string" ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  username = username.trim().toLowerCase();

  const user = await User.findById(id).exec();
  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }

  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate && duplicate._id.toString() !== id) {
    res.status(409).json({ message: "Duplicate username" });
    return;
  }

  user.username = username;
  user.roles = roles;
  user.active = active;
  if (typeof password === "string" && password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();
  res.json({ message: `${updatedUser.username} updated` });
};

// @desc Delete a user
// @route DELETE /users
// @access Private

export const deleteUser: RequestHandler<
  unknown,
  unknown,
  DeleteUserBody
> = async (req, res) => {
  const { id } = req.body;
  if (typeof id !== "string") {
    res.status(400).json({ message: "User ID Required" });
    return;
  }

  const notes = await Note.findOne({ user: id }).lean().exec();
  if (notes) {
    res.status(400).json({ message: "User has assigned notes" });
    return;
  }

  const user = await User.findById(id).exec();
  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }

  await user.deleteOne();
  res.json(`Username ${user.username} with ID ${user._id} deleted`);
};
