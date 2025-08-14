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
 * CORS setup
 * - Allow your Vercel app domain (NO trailing slash)
 * - Allow local Vite dev
 * - (Optional) allow all *.vercel.app previews via regex — uncomment if needed
 */
const allowedOrigins: (string | RegExp)[] = [
  "https://flashly-iota.vercel.app",
  "http://localhost:5173",
  // /^https:\/\/.*\.vercel\.app$/, // ← uncomment to allow *all* vercel.app previews
];

const corsOptions: cors.CorsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // server-to-server or same-origin
    const ok = allowedOrigins.some((o) =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );
    return ok ? cb(null, true) : cb(new Error("CORS: origin not allowed"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
  // credentials: false, // enable only if you use cookies
};

// 1) Apply CORS to every request (adds ACAO headers to GET/POST/OPTIONS/etc.)
app.use(cors(corsOptions));

// 2) Express v5-safe preflight handler (no wildcard path)
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    // CORS middleware above already set the Access-Control-Allow-* headers
    return res.sendStatus(204);
  }
  next();
});

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