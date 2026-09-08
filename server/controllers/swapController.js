const SwapRequest = require("../models/SwapRequest");
const SkillPost = require("../models/SkillPost");

const requestFields = [
  { path: "requester", select: "name email" },
  { path: "recipient", select: "name email" },
  { path: "skill", select: "title category description amount" }
];

const populateRequest = (query) => query.populate(requestFields);

const createSwapRequest = async (req, res) => {
  const { skillId, note } = req.body;

  try {
    const skill = await SkillPost.findById(skillId).populate("user", "name email");
    if (!skill) return res.status(404).json({ msg: "Skill post not found" });
    if (skill.user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ msg: "You cannot request a swap with yourself" });
    }

    const existing = await SwapRequest.findOne({
      requester: req.user._id,
      recipient: skill.user._id,
      skill: skill._id,
      status: "pending"
    });
    if (existing) return res.status(409).json({ msg: "A swap request is already pending" });

    const request = await SwapRequest.create({
      requester: req.user._id,
      recipient: skill.user._id,
      skill: skill._id,
      note: note?.trim() || undefined
    });
    const populated = await populateRequest(SwapRequest.findById(request._id));

    const io = req.app.get("io");
    if (io) {
      io.to(`user:${skill.user._id}`).emit("notification", {
        type: "swapRequest",
        request: populated,
        amount: skill.amount || 0
      });
    }

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getIncomingRequests = async (req, res) => {
  try {
    const requests = await populateRequest(
      SwapRequest.find({ recipient: req.user._id }).sort({ createdAt: -1 })
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOutgoingRequests = async (req, res) => {
  try {
    const requests = await populateRequest(
      SwapRequest.find({ requester: req.user._id }).sort({ createdAt: -1 })
    );
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateSwapStatus = async (req, res) => {
  const { status } = req.body;
  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ msg: "Status must be accepted or rejected" });
  }

  try {
    const request = await SwapRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: "Swap request not found" });
    if (request.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Only the skill owner can respond to this request" });
    }
    if (request.status !== "pending") {
      return res.status(409).json({ msg: "This request has already been resolved" });
    }

    request.status = status;
    await request.save();
    const populated = await populateRequest(SwapRequest.findById(request._id));

    const io = req.app.get("io");
    if (io) {
      io.to(`user:${request.requester}`).emit("notification", {
        type: "swapUpdated",
        request: populated
      });
    }

    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const paySwapRequest = async (req, res) => {
  try {
    const request = await SwapRequest.findById(req.params.id).populate("skill", "title amount");
    if (!request) return res.status(404).json({ msg: "Swap request not found" });
    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: "Only the learner who requested the swap can pay" });
    }
    if (request.status !== "accepted") {
      return res.status(400).json({ msg: "The teacher must accept the swap before payment" });
    }
    if (request.paymentStatus === "paid") {
      return res.status(409).json({ msg: "This swap has already been paid" });
    }

    request.paymentStatus = "paid";
    request.paidAt = new Date();
    await request.save();
    const populated = await populateRequest(SwapRequest.findById(request._id));

    const io = req.app.get("io");
    if (io) {
      io.to(`user:${request.recipient}`).emit("notification", {
        type: "paymentReceived",
        request: populated,
        amount: request.skill.amount || 0
      });
    }

    res.json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createSwapRequest,
  getIncomingRequests,
  getOutgoingRequests,
  updateSwapStatus,
  paySwapRequest
};