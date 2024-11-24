import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import morgan from "morgan";

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const isProduction = "production" === "production";
// const allowedOrigins = isProduction
//       ? ["https://xcc-dashboard-v11.vercel.app", "https://www.xavironconstructioncorp.com", "https://www.xavironconstructioncorp.com/admin"]
//       : ["http://localhost:5173", "http://localhost:3036"];

// console.log(allowedOrigins);

const allowedOrigins = '*';

const corsOptions = {
      origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                  callback(null, true);
            } else {
                  callback(new Error("Not allowed by CORS"));
            }
      },
      credentials: true, // Allow cookies
      optionsSuccessStatus: 200, // For older browsers
};

// Middleware setup
app.use(morgan("dev")); // Log HTTP requests
app.use(express.static("public", { maxAge: "1d" })); // Serve static assets
app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests globally

app.use(
      helmet({
            contentSecurityPolicy: false, // Disable CSP for inline scripts/styles if needed
      })
);
app.use(compression()); // Compress responses
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Rate Limiting
const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP
      message: {
            message: "Too many requests from this IP, please try again after 15 minutes",
      },
});
app.use(limiter);

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

// 404 Handler
app.all("*", (req, res) => {
      res.status(404).json({
            success: false,
            message: "Route Not Found",
      });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
      console.error("❌ Error:", err.stack);
      res.status(err.status || 500).json({
            success: false,
            message: err.message || "Internal Server Error",
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
});

// Export the app for Vercel
export default app;
