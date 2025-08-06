import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import deckRoutes from "./routes/decks"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/decks", deckRoutes)

app.get("/", (req, res) => {
  res.send("Flashly backend is running!");
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
