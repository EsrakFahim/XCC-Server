import mongoose from "mongoose";
import { DB_name } from "../constant.js";

// Optimized MongoDB connection function
const connectDB = async () => {
      try {
            const DB = await mongoose.connect(`${process.env.DB_CONNECTION_URI}/${DB_name}`, {
                  useNewUrlParser: true,
                  useUnifiedTopology: true,
                  maxPoolSize: 20, // Maximum number of sockets in the connection pool
                  minPoolSize: 5, // Minimum number of sockets in the connection pool
                  serverSelectionTimeoutMS: 5000, // Timeout for initial server selection
                  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
                  connectTimeoutMS: 10000, // Timeout for initial connection
                  retryWrites: true, // Enable retryable writes
                  w: 'majority', // Write concern to ensure data is written to majority of nodes
                  wtimeoutMS: 2500, // Timeout for write concern
            });

            console.log(
                  `✅ MongoDB connected successfully | HOST: ${DB.connection.host} | Database: ${DB.connection.name}`
            );

            // Event listeners for MongoDB connection status
            mongoose.connection.on("connected", () => {
                  console.log("🔗 MongoDB connection established");
            });

            mongoose.connection.on("error", (err) => {
                  console.error(`❌ MongoDB connection error: ${err.message}`);
            });

            mongoose.connection.on("disconnected", () => {
                  console.warn("⚠️ MongoDB connection lost. Reconnecting...");
            });

            mongoose.connection.on("reconnected", () => {
                  console.log("🔄 MongoDB reconnected");
            });

            mongoose.connection.on("close", () => {
                  console.log("🔒 MongoDB connection closed");
            });
      } catch (error) {
            console.error(`❌ MongoDB connection failed: ${error.message}`);
            process.exit(1); // Exit the process with failure code
      }
};

// Graceful shutdown for MongoDB connection when the app is terminated
process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("🛑 MongoDB connection closed due to app termination");
      process.exit(0);
});

export { connectDB };
