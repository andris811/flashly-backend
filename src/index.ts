import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";


dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Flashly backend is running!");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
