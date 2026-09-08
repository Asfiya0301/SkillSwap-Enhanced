const express = require("express");
const router = express.Router();
const {
  createSwapRequest,
  getIncomingRequests,
  getOutgoingRequests,
  updateSwapStatus,
  paySwapRequest
} = require("../controllers/swapController");
const protect = require("../middleware/authMiddleware");

router.use(protect);
router.post("/", createSwapRequest);
router.get("/incoming", getIncomingRequests);
router.get("/outgoing", getOutgoingRequests);
router.patch("/:id/status", updateSwapStatus);
router.patch("/:id/pay", paySwapRequest);

module.exports = router;