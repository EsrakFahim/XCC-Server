import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";

dotenv.config(); // Load environment variables

const app = express();

// CORS configuration
const allowedOrigins = [
      "https://www.galaxyspark.agency",
      "https://galaxy-spark-admin-dashboard.vercel.app",
      "http://localhost:5173", // Removed trailing slash
      "http://localhost:3000",
];

const corsOptions = {
      origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin || allowedOrigins.includes(origin)) {
                  callback(null, true);
            } else {
                  callback(new Error("Not allowed by CORS"));
            }
      },
      credentials: true, // Allow cookies to be sent
      optionsSuccessStatus: 200, // For legacy browser support
};

// Middleware setup
app.use(express.static("public")); // Serve static files from 'public' directory
app.use(cors(corsOptions));
app.use(helmet()); // Security headers
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes import
import clientRouter from "./routes/client.routes.js";
import contactRoute from "./routes/contact.routes.js";
import serviceRoute from "./routes/service.routes.js";
import projectsRoute from "./routes/projects.routes.js";
import teamMemberRoute from "./routes/teamMember.routes.js";
import pricePlanRoute from "./routes/pricePlan.routes.js";
import agencyStatsRoute from "./routes/agencyStats.routes.js";
import homePageRoute from "./routes/homeItems.routes.js";
import aboutPageRoute from "./routes/aboutItems.routes.js";

// Routes setup
app.use("/api/v1/client", clientRouter);
app.use("/api/v1/contact", contactRoute);
app.use("/api/v1/service", serviceRoute);
app.use("/api/v1/projects", projectsRoute);
app.use("/api/v1/team-member", teamMemberRoute);
app.use("/api/v1/price-plan", pricePlanRoute);
app.use("/api/v1/agency-stats", agencyStatsRoute);
app.use("/api/v1/home-page", homePageRoute);
app.use("/api/v1/about-page", aboutPageRoute);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ message: err.message || "Internal Server Error" });
});

// 404 Handler
app.use((req, res) => {
      res.status(404).json({ message: "Route Not Found" });
});

export { app };
