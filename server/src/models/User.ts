import { Schema, model } from "mongoose";

export interface IUser {
  username: string;
  password: string;
  roles: string[];
  active: boolean;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ["Employee"],
  },
  active: {
    type: Boolean,
    default: true,
  },
});

export default model<IUser>("User", userSchema);
