import { createSlice, createAsyncThunk, createAction, PayloadAction } from '@reduxjs/toolkit';
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
      const token = sessionStorage.getItem('authToken');

      if (!token) {
        return thunkAPI.rejectWithValue('Authorization token is missing!');
      }
      
      const response = await axios.post(`${API_BASE_URL}/Album`, album, {
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

// rename album
export const updateAlbum = createAsyncThunk(
  'album/update',
  async ({ id, userId, albumName }: { id: number; userId: number; albumName: string }, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('authToken');

      if (!token) {
        return thunkAPI.rejectWithValue('Authorization token is missing!');
      }
      
      const response = await axios.put(`${API_BASE_URL}/Album/${id}/album-of/${userId}`, albumName, 
       { headers: {
        "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
        }}
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response || error.message);
    }
  }
);

//get albums by user
export const fetchAlbumsByUser = createAsyncThunk(
  'album/fetchByUser',
  async (userId: number, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('authToken');

      if (!token) {
        return thunkAPI.rejectWithValue('Authorization token is missing!');
      }

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

export const deleteAlbum = createAsyncThunk(
  'albums/deleteAlbum',
  async (albumId: number, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('authToken');

      if (!token) {
        return thunkAPI.rejectWithValue('Authorization token is missing!');
      }

      await axios.delete(`${API_BASE_URL}/Album/${albumId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return albumId; // מחזירים את ה-albumId כדי לעדכן את ה-Redux
    } catch (error: any) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to delete album');
    }
  }
);


export const searchAlbumsByName = createAsyncThunk(
  'albums/searchByName',
  async ({ userId, parentId, name }:{userId:number, parentId:number, name:string}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Album/search-in/${parentId}/of/${userId}`, {
        params: { name },
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to search albums');
    }
  }
);

// albumThunks.ts
export const searchAlbumsByDate = createAsyncThunk(
  'albums/searchByDate',
  async ({ userId, startDate, endDate, parentAlbumId,}: { userId: number; startDate?: Date; endDate?: Date; parentAlbumId?: number },
  { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Album/by-date-and-user/${userId}`, {
        params: { startDate, endDate, parentAlbumId },
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
            'Content-Type': 'application/json'
        },
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Failed to search albums by date');
    }
  }
);

// Slice
const albumSlice = createSlice({
  name: 'album',
  initialState: {
    albums: [] as Album[],
    loading: false,
    error: null as string | null,
    success: false,
    allAlbums: [] as Album[]
  },
  reducers: {
    resetAlbumState: (state) => {
      state.albums = [];
      state.loading = false;
      state.error = null;
      state.success = false;
      state.allAlbums = []
    },
    resetAlbums:(state)=>{
      state.albums=[]
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
      .addCase(updateAlbum.fulfilled, (state, action) => {
        const updatedAlbum = action.payload;
        const index = state.albums.findIndex(a => a.id === updatedAlbum.id);
        if (index !== -1) {
          state.albums[index] = updatedAlbum;
        }
        state.loading = false;
        state.success = true;
      })
      .addCase(updateAlbum.rejected, (state, action) => {
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
      .addCase(deleteAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.error=''
        state.albums = state.albums.filter(album => album.id !== action.payload);
      })
      .addCase(deleteAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //Search album by date
      .addCase(searchAlbumsByDate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAlbumsByDate.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload;
      })
      .addCase(searchAlbumsByDate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //search album by name
      .addCase(searchAlbumsByName.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchAlbumsByName.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload;
      })
      .addCase(searchAlbumsByName.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
  },
});

export const { resetAlbumState, resetAlbums} = albumSlice.actions;

export default albumSlice;