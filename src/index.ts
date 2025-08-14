import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import deckRoutes from "./routes/decks";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// CORS: start permissive in staging, then lock to your domains
app.use(
  cors({
    origin: [
      "https://flashly-iota.vercel.app/", 
      "http://localhost:5173",              // dev vite
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/decks", deckRoutes);

// Health + root
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.get("/", (_req, res) => res.send("Flashly backend is running!"));

async function start() {
  try {
    await connectDB();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();