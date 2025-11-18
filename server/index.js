import express from "express";
import cors from "cors";
import { scrapeMenu } from "./scrape.js";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET"],
}));

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
