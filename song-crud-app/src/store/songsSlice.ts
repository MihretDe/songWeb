import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export interface Song {
  _id: string
  title: string
  artist: string
  album: string
  year: number
  genre: string
  duration: string
  createdAt?: string
  updatedAt?: string
}

export interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface SongsState {
  allSongs: Song[] // Store all songs from backend
  displayedSongs: Song[] // Current page songs
  pagination: PaginationInfo
  loading: boolean
  error: string | null
  selectedSong: Song | null
  isModalOpen: boolean
  isDeleteDialogOpen: boolean
  searchTerm: string
  sortField: keyof Song | null
  sortDirection: "asc" | "desc"
}

const initialState: SongsState = {
  allSongs: [],
  displayedSongs: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
  },
  loading: false,
  error: null,
  selectedSong: null,
  isModalOpen: false,
  isDeleteDialogOpen: false,
  searchTerm: "",
  sortField: null,
  sortDirection: "asc",
}

const songSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    // Fetch all songs actions
    fetchSongsRequest: (state) => {
      state.loading = true
      state.error = null
    },
    fetchSongsSuccess: (state, action: PayloadAction<Song[]>) => {
      state.loading = false
      state.allSongs = action.payload
      // Recalculate pagination after fetching
      songSlice.caseReducers.updatePagination(state)
    },
    fetchSongsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Create song actions
    createSongRequest: (state, action: PayloadAction<Omit<Song, "_id">>) => {
      state.loading = true
      state.error = null
    },
    createSongSuccess: (state, action: PayloadAction<Song>) => {
      state.loading = false
      state.allSongs.unshift(action.payload) // Add to beginning
      state.isModalOpen = false
      // Recalculate pagination
      songSlice.caseReducers.updatePagination(state)
    },
    createSongFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Update song actions
    updateSongRequest: (state, action: PayloadAction<{ id: string; song: Omit<Song, "_id"> }>) => {
      state.loading = true
      state.error = null
    },
    updateSongSuccess: (state, action: PayloadAction<Song>) => {
      state.loading = false
      const index = state.allSongs.findIndex((song) => song._id === action.payload._id)
      if (index !== -1) {
        state.allSongs[index] = action.payload
      }
      state.isModalOpen = false
      state.selectedSong = null
      // Recalculate pagination
      songSlice.caseReducers.updatePagination(state)
    },
    updateSongFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Delete song actions
    deleteSongRequest: (state, action: PayloadAction<string>) => {
      state.loading = true
      state.error = null
    },
    deleteSongSuccess: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.allSongs = state.allSongs.filter((song) => song._id !== action.payload)
      state.isDeleteDialogOpen = false
      state.selectedSong = null
      // Recalculate pagination and adjust current page if needed
      const newTotalItems = state.allSongs.length
      const newTotalPages = Math.ceil(newTotalItems / state.pagination.itemsPerPage)
      if (state.pagination.currentPage > newTotalPages && newTotalPages > 0) {
        state.pagination.currentPage = newTotalPages
      }
      songSlice.caseReducers.updatePagination(state)
    },
    deleteSongFailure: (state, action: PayloadAction<string>) => {
      state.loading = false
      state.error = action.payload
    },

    // Pagination actions
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload
      songSlice.caseReducers.updatePagination(state)
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.itemsPerPage = action.payload
      state.pagination.currentPage = 1 // Reset to first page
      songSlice.caseReducers.updatePagination(state)
    },

    // Search and filter actions
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload
      state.pagination.currentPage = 1 // Reset to first page when searching
      songSlice.caseReducers.updatePagination(state)
    },

    // Sort actions
    setSortField: (state, action: PayloadAction<{ field: keyof Song; direction: "asc" | "desc" }>) => {
      state.sortField = action.payload.field
      state.sortDirection = action.payload.direction
      state.pagination.currentPage = 1 // Reset to first page when sorting
      songSlice.caseReducers.updatePagination(state)
    },

    // UI actions
    setSelectedSong: (state, action: PayloadAction<Song | null>) => {
      state.selectedSong = action.payload
    },
    setModalOpen: (state, action: PayloadAction<boolean>) => {
      state.isModalOpen = action.payload
      if (!action.payload) {
        state.selectedSong = null
      }
    },
    setDeleteDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.isDeleteDialogOpen = action.payload
    },
    clearError: (state) => {
      state.error = null
    },

    // Helper action to update pagination and displayed songs
    updatePagination: (state) => {
      let filteredSongs = [...state.allSongs]

      // Apply search filter
      if (state.searchTerm) {
        const searchLower = state.searchTerm.toLowerCase()
        filteredSongs = filteredSongs.filter(
          (song) =>
            song.title.toLowerCase().includes(searchLower) ||
            song.artist.toLowerCase().includes(searchLower) ||
            song.album.toLowerCase().includes(searchLower) ||
            song.genre.toLowerCase().includes(searchLower),
        )
      }

      // Apply sorting
      if (state.sortField) {
        filteredSongs.sort((a, b) => {
          const aValue = a[state.sortField!]
          const bValue = b[state.sortField!]

          let comparison = 0
          if (typeof aValue === "string" && typeof bValue === "string") {
            comparison = aValue.localeCompare(bValue)
          } else if (typeof aValue === "number" && typeof bValue === "number") {
            comparison = aValue - bValue
          }

          return state.sortDirection === "desc" ? -comparison : comparison
        })
      }

      // Calculate pagination
      const totalItems = filteredSongs.length
      const totalPages = Math.ceil(totalItems / state.pagination.itemsPerPage)
      const startIndex = (state.pagination.currentPage - 1) * state.pagination.itemsPerPage
      const endIndex = startIndex + state.pagination.itemsPerPage

      // Update pagination info
      state.pagination.totalItems = totalItems
      state.pagination.totalPages = totalPages

      // Set displayed songs for current page
      state.displayedSongs = filteredSongs.slice(startIndex, endIndex)
    },
  },
})

export const {
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
  setSelectedSong,
  setModalOpen,
  setDeleteDialogOpen,
  setCurrentPage,
  setItemsPerPage,
  setSearchTerm,
  setSortField,
  clearError,
  updatePagination,
} = songSlice.actions

export default songSlice.reducer
