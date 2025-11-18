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

// API Routes
app.get("/api/menu", async (req, res) => {
  const { date, meal } = req.query;

  if (!date) {
    return res.status(400).json({ error: "Date parameter is required" });
  }

  try {
    const result = await scrapeMenu(date, meal);
    res.json(result);
  } catch (error) {
    console.error("Error scraping menu:", error);
    res.status(500).json({ error: error.message || "Failed to fetch menu data" });
  }
});

// Serve frontend if dist folder exists (for full-stack deployment)
const distPath = join(__dirname, "..", "dist");
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // Serve index.html for all non-API routes
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
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
