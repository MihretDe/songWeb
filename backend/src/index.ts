// server/src/index.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import songRoutes from "./routes/song.routes";
import { fetchAndSaveSongs } from "./services/songService";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/songs", songRoutes);

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    // fetchAndSaveSongs("spiritual music")
  })
  .catch((err) => console.error("MongoDB connection error:", err));
