import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AlbumPostModel } from '../../types/AlbumPostModel';
import { Image } from '../../types/Image';
import { Album } from '../../types/Album';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = sessionStorage.getItem('authToken');

const authHeader = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
};

// create an album
export const createAlbum = createAsyncThunk(
  'album/create',
  async (album: AlbumPostModel, thunkAPI) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Album`, album, authHeader);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// rename album
export const updateAlbum = createAsyncThunk(
  'album/update',
  async ({ id, userId, albumName }: { id: number; userId: number; albumName: string }, thunkAPI) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/Album/${id}/album-of/${userId}`, albumName, authHeader);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// delete album
export const deleteAlbum = createAsyncThunk(
  'album/delete',
  async (id: number, thunkAPI) => {
    try {
      await axios.delete(`${API_BASE_URL}/Album/${id}`, authHeader);
      return id;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// add file to album
export const addFileToAlbum = createAsyncThunk(
  'album/addFile',
  async ({ albumId, fileId }: { albumId: number; fileId: number }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Album/${albumId}/add-file/${fileId}`, null, authHeader);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get files from album
export const getFilesByAlbum = createAsyncThunk(
  'album/getFilesByAlbum',
  async (albumId: number, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Album/${albumId}/files`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// get albums child
export const fetchChildAlbums = createAsyncThunk(
  'album/fetchChildAlbums',
  async ({ userId, parentId }: { userId: number; parentId: number }, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('authToken');

      if (!token) {
        return thunkAPI.rejectWithValue('Authorization token is missing!');
      }

      const response = await axios.get(`${API_BASE_URL}/Album/children-of-album/${parentId}/by-user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//get albums by user
export const fetchAlbumsByUser = createAsyncThunk(
  'album/fetchByUser',
  async (userId: number, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Album/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
      );
      return response.data;

    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const resetFiles = createAction('album/resetFiles');

// Slice
const albumSlice = createSlice({
  name: 'album',
  initialState: {
    albums: [] as any[],
    files: [] as Image[],
    loading: false,
    error: null as string | null,
    success: false,
    allAlbums: [] as Album[]
  },
  reducers: {
    resetAlbumState: (state) => {
      state.albums = [];
      state.files = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.allAlbums = []
    },
    updateFileInAlbum: (state, action) => {
      const updatedFile = action.payload;
      const index = state.files.findIndex(f => f.id === updatedFile.id);
      if (index !== -1) {
        state.files[index] = updatedFile;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Album
      .addCase(createAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.albums.push(action.payload);
        state.success = true;
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Album
      .addCase(updateAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlbum.fulfilled, (state) => { // אולי צריך להוסיף action
        state.loading = false;
        state.success = true;
      })
      .addCase(updateAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Album
      .addCase(deleteAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = state.albums.filter(album => album.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Add File To Album
      .addCase(addFileToAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFileToAlbum.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addFileToAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Files By Album
      .addCase(getFilesByAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFilesByAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.files = action.payload;
        state.success = true;
      })
      .addCase(getFilesByAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get Child Albums
      .addCase(fetchChildAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChildAlbums.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload;
        state.success = true;
      })
      .addCase(fetchChildAlbums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //get all albums 
      .addCase(fetchAlbumsByUser.pending, (state) => {
        // state.loading = true;
        // state.error = null;
      })
      .addCase(fetchAlbumsByUser.fulfilled, (state, action) => {
        // state.loading = false;
        state.allAlbums = action.payload;
      })
      .addCase(fetchAlbumsByUser.rejected, (state, action) => {
        // state.loading = false;
        // state.error = action.payload as string;
      })
      .addCase(resetFiles, (state) => {
        state.files = [];
      });
  },
});

export const { resetAlbumState } = albumSlice.actions;
export const { updateFileInAlbum } = albumSlice.actions;

export default albumSlice;