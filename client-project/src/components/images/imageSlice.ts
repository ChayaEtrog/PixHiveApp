import { createSlice, createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ImagePostModal } from '../../types/ImagePostModal';
import { Image } from '../../types/Image';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
//upload image
export const uploadImage = createAsyncThunk(
  'image/uploadImage',
  async ({ image, albumId }: { image: ImagePostModal, albumId: number }, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('authToken');

      if (!token) {
        return thunkAPI.rejectWithValue('Authorization token is missing!');
      }

      const response = await axios.post(`${API_BASE_URL}/File/to-album/${albumId}`, image, {
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
      const response = await axios.get(`${API_BASE_URL}/File/user/${userId}`,{
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`, 
        },
      });
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

//rename file
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

// add file to album
export const addFileToAlbum = createAsyncThunk(
  'album/addFile',
  async ({ albumId, fileId }: { albumId: number; fileId: number }, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) return thunkAPI.rejectWithValue('Authorization token is missing!');
      const response = await axios.post(`${API_BASE_URL}/Album/${albumId}/add-file/${fileId}`, null,
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

// get files from album
export const getFilesByAlbum = createAsyncThunk(
  'album/getFilesByAlbum',
  async (albumId: number, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('authToken');
      if (!token) return thunkAPI.rejectWithValue('Authorization token is missing!');
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

//reset image state
export const resetFiles = createAction('image/resetFiles');

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

//delete image
export const removeFileFromAlbum = createAsyncThunk(
  'files/removeFileFromAlbum',
  async ({ fileId, albumId }: { fileId: number; albumId: number }, thunkAPI) => {
    try {
      const token = sessionStorage.getItem('authToken');

      if (!token) {
        return thunkAPI.rejectWithValue('Authorization token is missing!');
      }

      const response= await axios.delete(`${API_BASE_URL}/File/${fileId}/albums/${albumId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return { fileId:fileId, message: response.data};
    } catch (error: any) {
      console.log(error);
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to remove file from album');
    }
  }
);

//get recycle bin files
export const fetchDeletedFiles = createAsyncThunk(
  'files/fetchDeletedFiles', 
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/File/deleted`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

//recycle file
export const recycleFile = createAsyncThunk(
  'image/recycleFile',
  async (fileId: number, { rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE_URL}/File/recycle/${fileId}`, {}, { 
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`, 
        },
      });
      return fileId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

//delete file permenently
export const deleteFile = createAsyncThunk(
  'image/deleteFile',
  async (fileId: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/S3/${fileId}`, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
        },
      });

      console.log("File deleted successfully:", response.status);
      return fileId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message); // מחזיר שגיאה אם נכשל
    }
  }
);

// Search files by name
export const searchFiles = createAsyncThunk(
  'files/searchFiles',
  async ({ parentId, name, userId }: { parentId: number, name: string, userId: number }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/File/search-in/${parentId}/of/${userId}`, {
        params: { name },
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error searching files');
    }
  }
);

// Fetch files by tag and user
export const getFilesByTagAndUser = createAsyncThunk(
  'files/getFilesByTagAndUser',
  async (
    { userId, tagName, parentAlbumId }: { userId: number; tagName: string; parentAlbumId?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/File/by-tag-and-user/${userId}/${encodeURIComponent(tagName)}`, {
        params: parentAlbumId !== undefined ? { parentAlbumId } : {},
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error fetching files by tag and user');
    }
  }
);

// Fetch files by date range for a user
export const getFilesByDateAndUser = createAsyncThunk(
  'files/getFilesByDateAndUser',
  async (
    { userId, startDate, endDate, parentAlbumId,
    }: { userId: number; startDate?: Date; endDate?: Date; parentAlbumId?: number },
    { rejectWithValue }
  ) => {
    try {
      const params: any = {};
      if (startDate) params.startDate = startDate.toISOString();
      if (endDate) params.endDate = endDate.toISOString();
      if (parentAlbumId !== undefined) params.parentAlbumId = parentAlbumId;

      const response = await axios.get(`${API_BASE_URL}/File/by-date-and-user/${userId}`, {
        params,
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('authToken')}`,
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Error fetching files by date and user');
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
    deletedFiles: [] as Image[],
    downloadUrl: '',
    isRootFiles: false,
    isSearch: false,
  },
  reducers: {
    resetImageState: (state) => {
      state.image = null;
      state.uploading = false;
      state.error = '';
      state.success = false;
      state.downloadUrl = '';
      state.isRootFiles = false;
      state.deletedFiles = [] as Image[];
    },
    clearSearch: (state) => {
      state.isSearch=false;
    }
  },
  extraReducers: (builder) => {
    builder
      // upload image
      .addCase(uploadImage.pending, (state) => {
        state.uploading = true;
        state.error = '';
        state.success = false;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.uploading = false;
        state.image = action.payload;
        state.files.push(action.payload);
        state.success = true;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploading = false;
        console.log(action);
        state.error = action.payload as string;
        state.success = false;
      })

      // get all files
      .addCase(getFilesByUser.pending, (state) => {
        state.pending = true;
        state.error = '';
      })
      .addCase(getFilesByUser.fulfilled, (state, action) => {
        state.pending = false;
        state.files = action.payload;
        state.isSearch = false;
      })
      .addCase(getFilesByUser.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload as string;
      })

      // Add File To Album
      .addCase(addFileToAlbum.pending, (state) => {
        state.pending = true;
        state.error = '';
      })
      .addCase(addFileToAlbum.fulfilled, (state, action) => {
        if (state.isRootFiles) {
          state.files = state.files.filter(file => file.id != action.payload.data.id)
        }
        state.pending = false;
        state.error = '';
      })
      .addCase(addFileToAlbum.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload as string;
      })

      // Get Files By Album
      .addCase(getFilesByAlbum.pending, (state) => {
        state.pending = true;
        state.error = '';
      })
      .addCase(getFilesByAlbum.fulfilled, (state, action) => {
        state.pending = false;
        state.files = action.payload;
        state.isRootFiles = false;
        state.success = true;
        state.isSearch = false;
      })
      .addCase(getFilesByAlbum.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload as string;
      })

      //get root files
      .addCase(getRootFilesByUser.pending, (state) => {
        state.pending = true;
        state.error = '';
      })
      .addCase(getRootFilesByUser.fulfilled, (state, action) => {
        state.pending = false;
        state.files = action.payload;
        state.isRootFiles = true;
        state.isSearch = false;
      })
      .addCase(getRootFilesByUser.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload as string;
      })

      //reset files
      .addCase(resetFiles, (state) => {
        state.files = [];
        state.isRootFiles = false;
        state.isSearch = false;
      })

      //get download url
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

      //update file name
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
      })

      //delete file
      .addCase(removeFileFromAlbum.pending, (state) => {
        state.pending = true;
        state.error = '';
      })
      .addCase(removeFileFromAlbum.fulfilled, (state, action) => {
        state.error = '';
        state.pending = false;
        const fileId = action.payload.fileId;
        state.files = state.files.filter(f => f.id != fileId);
      })
      .addCase(removeFileFromAlbum.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload as string;
      })

      //get deleted files
      .addCase(fetchDeletedFiles.pending, (state) => {
        state.pending = true;
        state.error = '';
      })
      .addCase(fetchDeletedFiles.fulfilled, (state, action) => {
        state.pending = false;
        state.deletedFiles = action.payload;
      })
      .addCase(fetchDeletedFiles.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload as string;
      })

      //recycle file
      .addCase(recycleFile.fulfilled, (state, action) => {
        if(state.isRootFiles){
          const item=state.deletedFiles.find(item => item.id === action.payload)
          state.files.push(item!)
        }
        state.deletedFiles = state.deletedFiles.filter(file => file.id !== action.payload);
      })
      .addCase(recycleFile.pending, (state) => {
        state.pending = true;
        state.error = ''
      })
      .addCase(recycleFile.rejected, (state, action) => {
        state.error = action.payload as string;
        state.pending = false;
      })

      //delete file permanently
      .addCase(deleteFile.pending, (state) => {
        state.pending = true;
        state.error = '';
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        if(action.payload)
          state.deletedFiles = state.deletedFiles.filter(file => file.id !== action.payload);
        state.pending = false;
        state.error = '';
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload as string;
      })
      .addCase(searchFiles.pending, (state) => {
        state.pending = true;
        state.error = '';
      })
      .addCase(searchFiles.fulfilled, (state, action) => {
        state.pending = false;
        state.files = action.payload;
        state.isSearch = true;
        state.error = ''
      })
      .addCase(searchFiles.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload as string;
      })
      .addCase(getFilesByTagAndUser.pending, (state) => {
        state.pending = true;
        state.error = '';
      })
      .addCase(getFilesByTagAndUser.fulfilled, (state, action) => {
        state.pending = false;
        state.isSearch = true;
        state.files = action.payload;
        state.error = ''
      })
      .addCase(getFilesByTagAndUser.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload as string;
      })
      .addCase(getFilesByDateAndUser.pending, (state) => {
        state.pending = true;
        state.error = '';
      })
      .addCase(getFilesByDateAndUser.fulfilled, (state, action) => {
        state.pending = false;
        state.files = action.payload;
        state.isSearch = true;
        state.error = ''
      })
      .addCase(getFilesByDateAndUser.rejected, (state, action) => {
        state.pending = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetImageState,clearSearch } = imageSlice.actions;

export default imageSlice;

