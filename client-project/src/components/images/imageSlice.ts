import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ImagePostModal } from '../../types/ImagePostModal';
import { Image } from '../../types/Image';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//upload image
export const uploadImage = createAsyncThunk(
  'image/uploadImage',
  async (image: ImagePostModal, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('authToken');

      if (!token) {
        return thunkAPI.rejectWithValue('Authorization token is missing!');
      }

      const response = await axios.post(`${API_BASE_URL}/File`, image, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log(error);

      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

//get all images by user id
export const getFilesByUser = createAsyncThunk(
  'image/getFilesByUser',
  async (userId: number, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/File/user/${userId}`);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

//get root files by user id
export const getRootFilesByUser = createAsyncThunk(
  'image/getRootFilesByUser',
  async (userId: number, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('authToken');

      if (!token) {
        return thunkAPI.rejectWithValue('Authorization token is missing!');
      }

      const response = await axios.get(`${API_BASE_URL}/File/${userId}/root-files`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const updateFileName = createAsyncThunk(
  'file/updateFileName',
  async ({ userId, fileId, newName }: { userId: number; fileId: number; newName: string }, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) return thunkAPI.rejectWithValue('Authorization token is missing!');

      const response = await axios.put(
        `${API_BASE_URL}/File/${fileId}/file-of/${userId}`, newName,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//reset image state
export const resetRootFiles = createAction('image/resetRootFiles');

//download image
export const getDownloadUrl = createAsyncThunk(
  'image/getDownloadUrl',
  async (fileName: string, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) {
        return thunkAPI.rejectWithValue('Authorization token is missing!');
      }

      const response = await axios.get(`${API_BASE_URL}/S3/download-url/${fileName}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      return response.data.downloadUrl;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

const imageSlice = createSlice({
  name: 'image',
  initialState: {
    image: null,
    uploading: false,
    error: '',
    success: false,
    pending: true,
    files: [] as Image[],
    downloadUrl: ''
  },
  reducers: {
    resetImageState: (state) => {
      state.image = null;
      state.uploading = false;
      state.error = '';
      state.success = false;
      state.downloadUrl = ''
    },
  },
  extraReducers: (builder) => {
    builder
      // מקרים של העלאת קובץ
      .addCase(uploadImage.pending, (state) => {
        state.uploading = true;
        state.error = '';
        state.success = false;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.uploading = false;
        state.image = action.payload;
        state.success = true;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploading = false;
        console.log(action);
        state.error = action.payload as string;
        state.success = false;
      })
      // מקרים של שליפת קבצים של משתמש
      .addCase(getFilesByUser.pending, (state) => {
        state.pending = true;
        state.error = '';
      })
      .addCase(getFilesByUser.fulfilled, (state, action) => {
        state.pending = false;
        state.files = action.payload;
      })
      .addCase(getFilesByUser.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload as string;
      })
      .addCase(getRootFilesByUser.pending, (state) => {
        state.pending = true;
        state.error = '';
      })
      .addCase(getRootFilesByUser.fulfilled, (state, action) => {
        state.pending = false;
        state.files = action.payload;
      })
      .addCase(getRootFilesByUser.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload as string;
      })
      .addCase(resetRootFiles, (state) => {
        state.files = [];
      })
      .addCase(getDownloadUrl.fulfilled, (state, action) => {
        state.pending = false;
        state.downloadUrl = action.payload;
      })
      .addCase(getDownloadUrl.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload as string;
      })
      .addCase(getDownloadUrl.pending, (state) => {
        state.pending = true;
        state.error = '';
      })
      .addCase(updateFileName.pending, (state) => {
        state.pending = true;
        state.error = '';
      })
      .addCase(updateFileName.fulfilled, (state, action) => {
        const updatedFile = action.payload;
        const index = state.files.findIndex(f => f.id === updatedFile.id);
        if (index !== -1) {
          state.files[index] = updatedFile;
        }
        state.pending = false;
        state.success = true;
      })
      .addCase(updateFileName.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetImageState } = imageSlice.actions;

export default imageSlice;

