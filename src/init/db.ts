import mongoose from "mongoose";
import "../schema";

const mongoURI = process.env.MONGO_URI;

// Connect to database
if (mongoURI) {
  mongoose.connect(mongoURI);

  mongoose.connection.on("connected", () => {
    console.log("🛰️ Connected to Database");
  });
  // Log connection errors
  mongoose.connection.on("error", (error) => {
    console.error("🥭 MongoDB Connection Error!", error);
  });
} else {
  console.error("🥭 MONGO_URI not defined in env.");
}
