const mongoose = require("mongoose");
const { AutoIncrementID } = require("@typegoose/auto-increment");

const noteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
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

module.exports = mongoose.model("Note", noteSchema);
