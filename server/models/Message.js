const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    name: { type: String, default: "shared-document.pdf" },
    mimeType: { type: String, default: "application/pdf" },
    url: { type: String, required: true }
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skill: { type: mongoose.Schema.Types.ObjectId, ref: "SkillPost" },
  text: { type: String, default: "" },
  attachment: { type: attachmentSchema, default: null },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);
