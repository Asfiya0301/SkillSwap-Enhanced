const Message = require("../models/Message");

const sendMessage = async (req, res) => {
  const { to, skill, text, attachment } = req.body;
  const trimmedText = typeof text === "string" ? text.trim() : "";

  if (!to || (!trimmedText && !attachment?.url)) {
    return res.status(400).json({ msg: "Recipient and message text or PDF are required" });
  }

  try {
    const newMsg = await Message.create({
      from: req.user._id,
      to,
      skill,
      text: trimmedText,
      attachment: attachment && attachment.url ? {
        name: attachment.name || "shared-document.pdf",
        mimeType: attachment.mimeType || "application/pdf",
        url: attachment.url
      } : null
    });
    const populated = await newMsg.populate("from to", "name");

    // The sender receives the API response below; only push live updates to the recipient.
    const io = req.app.get("io");
    if (io) {
      io.to(`user:${to}`).emit("newMessage", populated);
    }

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMessagesForUser = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ from: req.user._id }, { to: req.user._id }]
    })
      .populate("from to", "name")
      .populate("skill", "title")
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Full message thread between the logged-in user and one other user
const getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const messages = await Message.find({
      $or: [
        { from: req.user._id, to: userId },
        { from: userId, to: req.user._id }
      ]
    })
      .populate("from to", "name")
      .populate("skill", "title")
      .sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// One row per person you've messaged, with their most recent message —
// powers an inbox/conversations list instead of one giant flat list.
const getConversationList = async (req, res) => {
  try {
    const myId = req.user._id;
    const messages = await Message.find({ $or: [{ from: myId }, { to: myId }] })
      .populate("from to", "name")
      .sort({ timestamp: -1 });

    const seen = new Map();
    for (const msg of messages) {
      const other = msg.from._id.toString() === myId.toString() ? msg.to : msg.from;
      const key = other._id.toString();
      if (!seen.has(key)) {
        seen.set(key, { user: other, lastMessage: msg.attachment ? `Shared a PDF: ${msg.attachment.name}` : msg.text, timestamp: msg.timestamp });
      }
    }

    res.json(Array.from(seen.values()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { sendMessage, getMessagesForUser, getConversation, getConversationList };
