import { call, put, takeEvery, takeLatest } from "redux-saga/effects"
import type { PayloadAction } from "@reduxjs/toolkit"
import {
  fetchSongsRequest,
  fetchSongsSuccess,
  fetchSongsFailure,
  createSongRequest,
  createSongSuccess,
  createSongFailure,
  updateSongRequest,
  updateSongSuccess,
  updateSongFailure,
  deleteSongRequest,
  deleteSongSuccess,
  deleteSongFailure,
  type Song,
} from "./songsSlice"

// API base URL - adjust according to your backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// API functions
const api = {
  fetchSongs: async (): Promise<Song[]> => {
    console.log("🌐 Fetching songs from:", `${API_BASE_URL}/songs`)

    const response = await fetch(`${API_BASE_URL}/songs`)
    console.log("📡 Response received:", response.status, response.statusText)

    if (!response.ok) {
      throw new Error(`Failed to fetch songs: ${response.status} ${response.statusText}`)
    }

    // ✅ Actually parse the JSON data
    const data = await response.json()
    console.log("📦 Parsed JSON data:", data)

    // Handle the response format from your updated backend
    if (data.success && data.data && Array.isArray(data.data)) {
      console.log(`✅ Found ${data.data.length} songs`)
      return data.data
    } else if (Array.isArray(data)) {
      // Fallback for direct array response
      console.log(`✅ Found ${data.length} songs (direct array)`)
      return data
    } else {
      console.warn("⚠️ Unexpected API response format:", data)
      return []
    }
  },

  createSong: async (song: Omit<Song, "_id">): Promise<Song> => {
    console.log("🌐 Creating song:", song)

    const response = await fetch(`${API_BASE_URL}/songs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(song),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to create song: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("📦 Created song response:", data)

    return data.data || data
  },

  updateSong: async (id: string, song: Omit<Song, "_id">): Promise<Song> => {
    console.log("🌐 Updating song:", id, song)

    const response = await fetch(`${API_BASE_URL}/songs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(song),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to update song: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log("📦 Updated song response:", data)

    return data.data || data
  },

  deleteSong: async (id: string): Promise<{ id: string }> => {
    console.log("🌐 Deleting song:", id)

    const response = await fetch(`${API_BASE_URL}/songs/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to delete song: ${response.status} ${response.statusText}`)
    }

    console.log("✅ Song deleted successfully")
    return { id }
  },
}

// Saga workers
function* fetchSongsSaga() {
  try {
    console.log("🔄 Saga: Starting to fetch songs...")
    const songs: Song[] = yield call(api.fetchSongs)
    console.log("✅ Saga: Songs fetched successfully, count:", songs.length)
    console.log("📋 Saga: First song:", songs[0])
    yield put(fetchSongsSuccess(songs))
  } catch (error) {
    console.error("❌ Saga: Failed to fetch songs:", error)
    yield put(fetchSongsFailure(error instanceof Error ? error.message : "Unknown error"))
  }
}

function* createSongSaga(action: PayloadAction<Omit<Song, "_id">>) {
  try {
    console.log("🔄 Saga: Creating song...")
    const song: Song = yield call(api.createSong, action.payload)
    console.log("✅ Saga: Song created successfully:", song)
    yield put(createSongSuccess(song))
  } catch (error) {
    console.error("❌ Saga: Failed to create song:", error)
    yield put(createSongFailure(error instanceof Error ? error.message : "Unknown error"))
  }
}

function* updateSongSaga(action: PayloadAction<{ id: string; song: Omit<Song, "_id"> }>) {
  try {
    console.log("🔄 Saga: Updating song...")
    const { id, song } = action.payload
    const updatedSong: Song = yield call(api.updateSong, id, song)
    console.log("✅ Saga: Song updated successfully:", updatedSong)
    yield put(updateSongSuccess(updatedSong))
  } catch (error) {
    console.error("❌ Saga: Failed to update song:", error)
    yield put(updateSongFailure(error instanceof Error ? error.message : "Unknown error"))
  }
}

function* deleteSongSaga(action: PayloadAction<string>) {
  try {
    console.log("🔄 Saga: Deleting song...")
    const id = action.payload
    yield call(api.deleteSong, id)
    console.log("✅ Saga: Song deleted successfully")
    yield put(deleteSongSuccess(id))
  } catch (error) {
    console.error("❌ Saga: Failed to delete song:", error)
    yield put(deleteSongFailure(error instanceof Error ? error.message : "Unknown error"))
  }
}

// Root saga
export function* songsSaga() {
  yield takeLatest(fetchSongsRequest.type, fetchSongsSaga)
  yield takeEvery(createSongRequest.type, createSongSaga)
  yield takeEvery(updateSongRequest.type, updateSongSaga)
  yield takeEvery(deleteSongRequest.type, deleteSongSaga)
}
