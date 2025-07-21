// src/services/songService.ts
import axios from "axios";
import Song from "../models/Song";

export const fetchAndSaveSongs = async (searchTerm: string) => {
  const res = await axios.get("https://itunes.apple.com/search", {
    params: {
      term: searchTerm,
      entity: "song",
      limit: 20,
    },
  });

  const songs = res.data.results.map((track: any) => ({
    title: track.trackName,
    artist: track.artistName,
    album: track.collectionName,
    year: new Date(track.releaseDate).getFullYear(),
    duration: track.trackTimeMillis,
  }));

  // Save to MongoDB
  const saved = await Song.insertMany(songs);
  return saved;
};
