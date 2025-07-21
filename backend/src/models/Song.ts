// src/models/Song.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ISong extends Document {
  title: string;
  artist?: string;
  album?: string;
  year?: number;
  duration?: number;
}

const SongSchema: Schema = new Schema({
  title: { type: String, required: true },
  artist: String,
  album: String,
  year: Number,
  duration: Number,
});

export default mongoose.model<ISong>("Song", SongSchema);
