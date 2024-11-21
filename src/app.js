import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

dotenv.config(); // Load environment variables

const app = express();

// CORS configuration
const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:3036",
      "https://xcc-dashboard.vercel.app",
      "https://xcclive.vercel.app"
];

const corsOptions = {
      origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                  callback(null, true);
            } else {
                  callback(new Error("Not allowed by CORS"));
            }
      },
      credentials: true, // Allow cookies to be sent
      optionsSuccessStatus: 200,
};

// Rate Limiting: Limit each IP to 100 requests per windowMs (15 minutes)
const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per windowMs
      message: {
            message: "Too many requests from this IP, please try again after 15 minutes",
      },
});

// Middleware setup
app.use(morgan("dev")); // Log HTTP requests in the console
app.use(express.static("public", { maxAge: "1d" })); // Cache static assets for 1 day
app.use(cors(corsOptions));
app.use(helmet({
      contentSecurityPolicy: false, // Disable if using inline scripts/styles
}));
app.use(compression()); // Compress all HTTP responses
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(limiter); // Apply rate limiting

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
      console.error("❌ Error:", err.stack);
      res.status(err.status || 500).json({
            success: false,
            message: err.message || "Internal Server Error",
      });
});

// 404 Handler
app.use((req, res) => {
      res.status(404).json({
            success: false,
            message: "Route Not Found",
      });
});

// Export the app
export { app };
