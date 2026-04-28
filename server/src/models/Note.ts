import { Schema, model, Types } from "mongoose";
import { AutoIncrementID } from "@typegoose/auto-increment";

export interface INote {
  user: Types.ObjectId;
  title: string;
  text: string;
  completed: boolean;
  ticket?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const noteSchema = new Schema<INote>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    title: { type: String, required: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    ticket: { type: Number },
  },
  { timestamps: true },
);

noteSchema.plugin(AutoIncrementID, {
  field: "ticket",
  startAt: 500,
  trackerCollection: "identitycounters",
  trackerModelName: "identitycounter",
});

export default model<INote>("Note", noteSchema);
