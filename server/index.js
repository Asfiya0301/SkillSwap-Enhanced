require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const skillRoutes = require("./routes/skillRoutes");
const messageRoutes = require("./routes/messageRoutes");
const swapRoutes = require("./routes/swapRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" }
});
app.set("io", io);

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/swaps", swapRoutes);
app.use("/api/books", bookRoutes);

app.get("/", (req, res) => {
  res.send("🚀 SkillSwap API is running...");
});

connectDB();

// ─── SOCKET.IO: live chat ──────────────────────────────────
// Clients authenticate with the same JWT used for REST calls, then join a
// room keyed to their own user id so messages can be pushed to them
// regardless of which conversation they're in.
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No auth token provided"));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error("Invalid or expired token"));
  }
});

io.on("connection", (socket) => {
  socket.join(`user:${socket.userId}`);

  socket.on("disconnect", () => {
    socket.leave(`user:${socket.userId}`);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
