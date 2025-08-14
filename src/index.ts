import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import deckRoutes from "./routes/decks";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

/**
 * CORS
 * - Allow Vercel app domain
 * - Allow local dev (Vite)
 * - Optionally allow any *.vercel.app previews via regex (uncomment if needed)
 */
const allowedOrigins: (string | RegExp)[] = [
  "https://flashly-iota.vercel.app", // ← my Vercel domain (NO trailing slash)
  "http://localhost:5173",
  // /^https:\/\/.*\.vercel\.app$/,   // ← uncomment to allow ALL vercel.app previews
];

const corsOptions: cors.CorsOptions = {
  origin(origin, callback) {
    // Non-browser requests (no Origin header) → allow
    if (!origin) return callback(null, true);

    const ok = allowedOrigins.some((o) =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );

    return ok ? callback(null, true) : callback(new Error("CORS: origin not allowed"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204, // preflight OK
  // credentials: false, // enable only if use cookies
};

app.use(cors(corsOptions));
// Explicitly answer all preflight requests
app.options("*", cors(corsOptions));

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
    console.log("PORT env is:", process.env.PORT);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();