import express from "express";
import cors from "cors";
import { scrapeMenu } from "./scrape.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET"],
}));

// Create API router to ensure API routes are handled separately
const apiRouter = express.Router();

// Test endpoint to verify API is working
apiRouter.get("/test", (req, res) => {
  res.json({ message: "API is working!", timestamp: new Date().toISOString() });
});

apiRouter.get("/menu", async (req, res) => {
  console.log("API /api/menu called with:", { date: req.query.date, meal: req.query.meal });
  const { date, meal } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Date parameter is required" });
  }

  try {
    const result = await scrapeMenu(date, meal);
    console.log("API /api/menu returning result");
    res.json(result);
  } catch (error) {
    console.error("Error scraping menu:", error);
    res.status(500).json({ error: error.message || "Failed to fetch menu data" });
  }
});

// Mount API router - MUST be before static file serving
app.use("/api", apiRouter);

// Serve frontend if dist folder exists (for full-stack deployment)
const distPath = join(__dirname, "..", "dist");
if (existsSync(distPath)) {
  // Serve static files (CSS, JS, images, etc.) - explicitly skip API routes
  app.use((req, res, next) => {
    // CRITICAL: Skip static file serving for API routes
    if (req.path.startsWith("/api")) {
      console.log("Skipping static file serving for API route:", req.path);
      return next();
    }
    // Serve static files for non-API routes only
    const staticHandler = express.static(distPath, { index: false });
    staticHandler(req, res, next);
  });
  
  // Serve index.html for all non-API routes (SPA fallback)
  // IMPORTANT: This must NOT match API routes - they're already handled above
  app.get("*", (req, res, next) => {
    // CRITICAL: Never serve HTML for API routes
    if (req.path.startsWith("/api")) {
      console.log("Catch-all route: API route detected, returning 404:", req.path);
      return res.status(404).json({ error: "API endpoint not found" });
    }
    console.log("Serving index.html for route:", req.path);
    const indexPath = join(distPath, "index.html");
    if (existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: "Frontend not found. Please build the frontend first." });
    }
  });
  
  console.log("Frontend static files enabled from:", distPath);
} else {
  console.log("Frontend dist folder not found at:", distPath);
  console.log("Serving API only. Deploy frontend separately or build it first.");
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (existsSync(distPath)) {
    console.log("Frontend is being served from /dist");
  } else {
    console.log("Frontend not found. Deploy frontend separately or build it first.");
  }
});
