"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "../src/store"
import {
  fetchSongsRequest,
  createSongRequest,
  updateSongRequest,
  deleteSongRequest,
  setSelectedSong,
  setModalOpen,
  setDeleteDialogOpen,
  setCurrentPage,
  setItemsPerPage,
  setSearchTerm,
  setSortField,
  clearError,
  type Song,
} from "../src/store/songsSlice"
import {
  Container,
  Header,
  Title,
  Subtitle,
  Card,
  CardHeader,
  CardContent,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  FormGroup,
  Label,
  Input,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  PaginationContainer,
  PaginationInfo,
  PaginationControls,
  Badge,
  LoadingContainer,
  ErrorMessage,
} from "./styled"

export default function SongsPage() {
  const dispatch = useDispatch()
  const {
    displayedSongs, // ✅ Changed from 'songs' to 'displayedSongs'
    pagination,
    loading,
    error,
    selectedSong,
    isModalOpen,
    isDeleteDialogOpen,
    searchTerm,
    sortField,
    sortDirection,
  } = useSelector((state: RootState) => state.songs)

  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    year: new Date().getFullYear(),
    genre: "",
    duration: "",
  })

  // Load all songs on component mount
  useEffect(() => {
    console.log("🚀 Dispatching fetchSongsRequest") // Debug log
    dispatch(fetchSongsRequest())
  }, [dispatch])

  // Debug: Log state changes
  useEffect(() => {
    console.log("📊 Redux State Update:", {
      displayedSongs: displayedSongs.length,
      totalItems: pagination.totalItems,
      loading,
      error,
    })
  }, [displayedSongs, pagination.totalItems, loading, error])

  // Update form data when editing
  useEffect(() => {
    if (selectedSong && isModalOpen) {
      setFormData({
        title: selectedSong.title,
        artist: selectedSong.artist,
        album: selectedSong.album,
        year: selectedSong.year,
        genre: selectedSong.genre,
        duration: selectedSong.duration,
      })
    } else if (!isModalOpen) {
      resetForm()
    }
  }, [selectedSong, isModalOpen])

  const resetForm = () => {
    setFormData({
      title: "",
      artist: "",
      album: "",
      year: new Date().getFullYear(),
      genre: "",
      duration: "",
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedSong) {
      dispatch(updateSongRequest({ id: selectedSong._id, song: formData }))
    } else {
      dispatch(createSongRequest(formData))
    }
  }

  const handleEdit = (song: Song) => {
    dispatch(setSelectedSong(song))
    dispatch(setModalOpen(true))
  }

  const handleDelete = () => {
    if (selectedSong) {
      dispatch(deleteSongRequest(selectedSong._id))
    }
  }

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage))
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    dispatch(setItemsPerPage(newItemsPerPage))
  }

  const handleSearch = (term: string) => {
    dispatch(setSearchTerm(term))
  }

  const handleSort = (field: keyof Song) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc"
    dispatch(setSortField({ field, direction: newDirection }))
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const openAddModal = () => {
    dispatch(setSelectedSong(null))
    dispatch(setModalOpen(true))
  }

  const closeModal = () => {
    dispatch(setModalOpen(false))
    dispatch(setSelectedSong(null))
  }

  const openDeleteDialog = (song: Song) => {
    dispatch(setSelectedSong(song))
    dispatch(setDeleteDialogOpen(true))
  }

  const closeDeleteDialog = () => {
    dispatch(setDeleteDialogOpen(false))
    dispatch(setSelectedSong(null))
  }

  const getSortIcon = (field: keyof Song) => {
    if (sortField !== field) return " ↕️"
    return sortDirection === "asc" ? " ↑" : " ↓"
  }

  // Debug: Add some console logs
  console.log("🔍 Component Render:", {
    displayedSongs: displayedSongs.length,
    loading,
    error,
    pagination,
  })

  return (
    <Container>
      <Header>
        <div>
          <Title>Songs Library</Title>
          <Subtitle>Manage your music collection</Subtitle>
        </div>
        <Button onClick={openAddModal}>+ Add Song</Button>
      </Header>

      {error && (
        <ErrorMessage>
          {error}
          <Button variant="secondary" size="sm" onClick={() => dispatch(clearError())} style={{ marginLeft: "1rem" }}>
            Dismiss
          </Button>
        </ErrorMessage>
      )}

      <Card>
        <CardHeader>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <div>
              <Title style={{ fontSize: "1.25rem" }}>Songs Collection</Title>
              <Subtitle>
                {pagination.totalItems} songs total • Page {pagination.currentPage} of {pagination.totalPages}
              </Subtitle>
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
              <div>
                <Label htmlFor="itemsPerPage" style={{ marginRight: "0.5rem", marginBottom: 0 }}>
                  Show:
                </Label>
                <select
                  id="itemsPerPage"
                  value={pagination.itemsPerPage}
                  onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                  style={{
                    padding: "0.5rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.375rem",
                    fontSize: "0.875rem",
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: "1rem" }}>
            <Input
              type="text"
              placeholder="Search songs by title, artist, album, or genre..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ maxWidth: "400px" }}
            />
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <LoadingContainer>Loading songs...</LoadingContainer>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead style={{ cursor: "pointer", userSelect: "none" }} onClick={() => handleSort("title")}>
                    Title{getSortIcon("title")}
                  </TableHead>
                  <TableHead style={{ cursor: "pointer", userSelect: "none" }} onClick={() => handleSort("artist")}>
                    Artist{getSortIcon("artist")}
                  </TableHead>
                  <TableHead style={{ cursor: "pointer", userSelect: "none" }} onClick={() => handleSort("album")}>
                    Album{getSortIcon("album")}
                  </TableHead>
                  <TableHead style={{ cursor: "pointer", userSelect: "none" }} onClick={() => handleSort("year")}>
                    Year{getSortIcon("year")}
                  </TableHead>
                  <TableHead style={{ cursor: "pointer", userSelect: "none" }} onClick={() => handleSort("genre")}>
                    Genre{getSortIcon("genre")}
                  </TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead style={{ textAlign: "right" }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <tbody>
                {displayedSongs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      style={{
                        textAlign: "center",
                        padding: "2rem",
                        color: "#6b7280",
                      }}
                    >
                      {searchTerm ? "No songs found matching your search." : "No songs available."}
                    </TableCell>
                  </TableRow>
                ) : (
                  displayedSongs.map((song) => (
                    <TableRow key={song._id}>
                      <TableCell style={{ fontWeight: 600 }}>{song.title}</TableCell>
                      <TableCell>{song.artist}</TableCell>
                      <TableCell>{song.album}</TableCell>
                      <TableCell>{song.year}</TableCell>
                      <TableCell>
                        <Badge>{song.genre}</Badge>
                      </TableCell>
                      <TableCell>{song.duration}</TableCell>
                      <TableCell style={{ textAlign: "right" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button variant="secondary" size="sm" onClick={() => handleEdit(song)}>
                            Edit
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => openDeleteDialog(song)}>
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </tbody>
            </Table>
          )}
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <PaginationContainer>
              <PaginationInfo>
                Showing {displayedSongs.length === 0 ? 0 : (pagination.currentPage - 1) * pagination.itemsPerPage + 1}{" "}
                to {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
                {pagination.totalItems} songs
                {searchTerm && ` (filtered)`}
              </PaginationInfo>
              <PaginationControls>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(pagination.totalPages, 10) }, (_, i) => {
                  let page = i + 1
                  if (pagination.totalPages > 10) {
                    const start = Math.max(1, pagination.currentPage - 5)
                    const end = Math.min(pagination.totalPages, start + 9)
                    page = start + i
                    if (page > end) return null
                  }
                  return (
                    <Button
                      key={page}
                      variant={page === pagination.currentPage ? "primary" : "secondary"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  Next
                </Button>
              </PaginationControls>
            </PaginationContainer>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <Title style={{ fontSize: "1.25rem", margin: 0 }}>{selectedSong ? "Edit Song" : "Add New Song"}</Title>
            </ModalHeader>
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <FormGroup>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="artist">Artist</Label>
                  <Input
                    id="artist"
                    type="text"
                    value={formData.artist}
                    onChange={(e) => handleInputChange("artist", e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="album">Album</Label>
                  <Input
                    id="album"
                    type="text"
                    value={formData.album}
                    onChange={(e) => handleInputChange("album", e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleInputChange("year", Number.parseInt(e.target.value))}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="genre">Genre</Label>
                  <Input
                    id="genre"
                    type="text"
                    value={formData.genre}
                    onChange={(e) => handleInputChange("genre", e.target.value)}
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    type="text"
                    placeholder="3:45"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    required
                  />
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : selectedSong ? "Update Song" : "Add Song"}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && selectedSong && (
        <ModalOverlay onClick={closeDeleteDialog}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <Title style={{ fontSize: "1.25rem", margin: 0 }}>Confirm Delete</Title>
            </ModalHeader>
            <ModalBody>
              <p>
                Are you sure you want to delete "{selectedSong.title}" by {selectedSong.artist}? This action cannot be
                undone.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={closeDeleteDialog}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete} disabled={loading}>
                {loading ? "Deleting..." : "Delete Song"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  )
}
