// server/src/controllers/song.controller.ts
import type { Request, Response } from "express"
import Song from "../models/Song"
import mongoose from "mongoose"

// Helper function for error responses
const handleError = (res: Response, error: any, message = "An error occurred") => {
  console.error(`❌ ${message}:`, error)

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: Object.values(error.errors).map((err: any) => err.message),
    })
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    })
  }

  res.status(500).json({
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  })
}

// GET /api/songs - Get all songs
export const getSongs = async (req: Request, res: Response) => {
  try {
    console.log("🔍 Fetching all songs from database...")
    const songs = await Song.find().sort({ createdAt: -1 }) // Sort by newest first

    console.log(`✅ Found ${songs.length} songs`)

    res.json({
      success: true,
      count: songs.length,
      data: songs, // ✅ This matches what your saga expects
    })
  } catch (error) {
    console.error("❌ Error fetching songs:", error)
    handleError(res, error, "Failed to fetch songs")
  }
}

// GET /api/songs/:id - Get single song by ID
export const getSongById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid song ID format",
      })
    }

    const song = await Song.findById(id)

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      })
    }

    res.json({
      success: true,
      data: song,
    })
  } catch (error) {
    handleError(res, error, "Failed to fetch song")
  }
}

// POST /api/songs - Create new song
export const createSong = async (req: Request, res: Response) => {
  try {
    console.log("🆕 Creating new song:", req.body)

    const { title, artist, album, year, genre, duration } = req.body

    // Basic validation
    if (!title || !artist || !album) {
      return res.status(400).json({
        success: false,
        message: "Title, artist, and album are required",
      })
    }

    // Check if song already exists
    const existingSong = await Song.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
      artist: { $regex: new RegExp(`^${artist}$`, "i") },
    })

    if (existingSong) {
      return res.status(409).json({
        success: false,
        message: "Song with this title and artist already exists",
      })
    }

    const newSong = new Song({
      title,
      artist,
      album,
      year: year || new Date().getFullYear(),
      genre: genre || "Unknown",
      duration: duration || "0:00",
    })

    const savedSong = await newSong.save()
    console.log("✅ Song created successfully:", savedSong._id)

    res.status(201).json({
      success: true,
      message: "Song created successfully",
      data: savedSong, // ✅ This matches what your saga expects
    })
  } catch (error) {
    console.error("❌ Error creating song:", error)
    handleError(res, error, "Failed to create song")
  }
}

// PUT /api/songs/:id - Update song by ID
export const updateSong = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { title, artist, album, year, genre, duration } = req.body

    console.log(`🔄 Updating song ${id}:`, req.body)

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid song ID format",
      })
    }

    // Basic validation
    if (!title || !artist || !album) {
      return res.status(400).json({
        success: false,
        message: "Title, artist, and album are required",
      })
    }

    // Check if another song with same title/artist exists (excluding current song)
    const existingSong = await Song.findOne({
      _id: { $ne: id },
      title: { $regex: new RegExp(`^${title}$`, "i") },
      artist: { $regex: new RegExp(`^${artist}$`, "i") },
    })

    if (existingSong) {
      return res.status(409).json({
        success: false,
        message: "Another song with this title and artist already exists",
      })
    }

    const updatedSong = await Song.findByIdAndUpdate(
      id,
      {
        title,
        artist,
        album,
        year: year || new Date().getFullYear(),
        genre: genre || "Unknown",
        duration: duration || "0:00",
        updatedAt: new Date(),
      },
      {
        new: true, // Return updated document
        runValidators: true, // Run schema validators
      },
    )

    if (!updatedSong) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      })
    }

    console.log("✅ Song updated successfully:", updatedSong._id)

    res.json({
      success: true,
      message: "Song updated successfully",
      data: updatedSong, // ✅ This matches what your saga expects
    })
  } catch (error) {
    console.error("❌ Error updating song:", error)
    handleError(res, error, "Failed to update song")
  }
}

// DELETE /api/songs/:id - Delete song by ID
export const deleteSong = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    console.log(`🗑️ Deleting song ${id}`)

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid song ID format",
      })
    }

    const deletedSong = await Song.findByIdAndDelete(id)

    if (!deletedSong) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      })
    }

    console.log("✅ Song deleted successfully:", deletedSong._id)

    res.json({
      success: true,
      message: "Song deleted successfully",
      data: deletedSong, // ✅ This matches what your saga expects
    })
  } catch (error) {
    console.error("❌ Error deleting song:", error)
    handleError(res, error, "Failed to delete song")
  }
}

// GET /api/songs/search?q=query - Search songs
export const searchSongs = async (req: Request, res: Response) => {
  try {
    const { q } = req.query

    if (!q || typeof q !== "string") {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      })
    }

    const searchRegex = new RegExp(q, "i") // Case-insensitive search

    const songs = await Song.find({
      $or: [{ title: searchRegex }, { artist: searchRegex }, { album: searchRegex }, { genre: searchRegex }],
    }).sort({ createdAt: -1 })

    res.json({
      success: true,
      count: songs.length,
      query: q,
      data: songs,
    })
  } catch (error) {
    handleError(res, error, "Failed to search songs")
  }
}
