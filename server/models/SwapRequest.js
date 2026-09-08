const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SkillPost",
    required: true
  },
  note: {
    type: String,
    default: "I would like to learn from you and explore a skill exchange."
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["unpaid", "paid"],
    default: "unpaid"
  },
  paidAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

swapRequestSchema.index({ requester: 1, recipient: 1, skill: 1, status: 1 });

module.exports = mongoose.model("SwapRequest", swapRequestSchema);