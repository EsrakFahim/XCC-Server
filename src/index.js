import dotenv from "dotenv";
import { connectDB } from "./db/index.js";
import app from "./app.js";

// Load environment variables
dotenv.config({
      path: "./env",
});

// Initialize server variable
let server;

const startServer = async () => {
      try {
            // Connect to MongoDB
            await connectDB();

            // Define a basic route
            app.get("/", (req, res) => {
                  res.send("Welcome to the API");
            });

            // Start the server
            const PORT = process.env.PORT || 5050;
            server = app.listen(PORT, () => {
                  console.log(`🚀 Server running on port ${PORT}`);
            });

            // Handle server errors
            server.on("error", (err) => {
                  console.error("❌ Server Error:", err);
            });
      } catch (error) {
            console.error("❌ Failed to connect to the database:", error);

            // Fallback route if DB connection fails
            app.get("/", (req, res) => {
                  res.status(500).send("Service Unavailable");
            });
      }
};

// Start the server
startServer();

// Graceful shutdown
const gracefulShutdown = async (signal) => {
      console.log(`\n🛑 Received ${signal}. Closing server gracefully...`);
      if (server) {
            server.close(() => {
                  console.log("💡 HTTP server closed");
            });
      }
      await mongoose.connection.close(false);
      console.log("🔒 MongoDB connection closed");
      process.exit(0);
};

// Handle system signals for graceful shutdown
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// Handle uncaught exceptions and unhandled promise rejections
process.on("uncaughtException", (err) => {
      console.error("⚠️ Uncaught Exception:", err);
      process.exit(1);
});
process.on("unhandledRejection", (reason, promise) => {
      console.error("⚠️ Unhandled Rejection:", reason);
      process.exit(1);
});
