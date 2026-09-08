const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // useNewUrlParser/useUnifiedTopology are no-ops on modern Mongoose/driver
    // versions and were removed to avoid deprecation warnings.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("❌ DB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
