const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, required: true },
  readingNotes: { type: [String], default: [] },
  syllabus: { type: [String], default: [] },
  roadmap: { type: [String], default: [] },
  downloadUrl: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);