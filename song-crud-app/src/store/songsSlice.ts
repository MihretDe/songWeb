import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  year: number;
}

interface SongsState {
  list: Song[];
  loading: boolean;
  error: string | null;
}

const initialState: SongsState = {
  list: [],
  loading: false,
  error: null,
};

const songsSlice = createSlice({
  name: "songs",
  initialState,
  reducers: {
    fetchSongs: (state) => {
      state.loading = true;
    },
    fetchSongsSuccess: (state, action: PayloadAction<Song[]>) => {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchSongsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchSongs, fetchSongsSuccess, fetchSongsFailure } = songsSlice.actions;
export default songsSlice.reducer;
