const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getMessagesForUser,
  getConversation,
  getConversationList
} = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, sendMessage);
router.get("/", authMiddleware, getMessagesForUser);
router.get("/conversations", authMiddleware, getConversationList);
router.get("/:userId", authMiddleware, getConversation);

module.exports = router;
