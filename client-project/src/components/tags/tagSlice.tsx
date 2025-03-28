import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Tag } from '../../types/Tag';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// fetch all tags
export const fetchTags = createAsyncThunk(
    'tags/fetchTags',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// fetch tag by id
export const fetchTagById = createAsyncThunk(
    'tags/fetchTagById',
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${id}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// add tag
export const addTag = createAsyncThunk(
    'tags/addTag',
    async (tagName: string, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}`, { name: tagName });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// rename tag
export const updateTag = createAsyncThunk(
    'tags/updateTag',
    async ({ id, newName }: { id: number; newName: string }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/${id}`, newName, {
                headers: { 'Content-Type': 'application/json' },
            });
            return { id, name: newName };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ferch all tags of album
export const fetchTagsByFile = createAsyncThunk(
    'fileTags/fetchTagsByFile',
    async (fileId: number, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/${fileId}/tags`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// add tag to file
export const addTagToFile = createAsyncThunk(
    'fileTags/addTagToFile',
    async ({ fileId, tagId }: { fileId: number; tagId: number }, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/${fileId}/tags/${tagId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// delete tag from file
export const removeTagFromFile = createAsyncThunk(
    'fileTags/removeTagFromFile',
    async ({ fileId, tagId }: { fileId: number; tagId: number }, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_BASE_URL}/${fileId}/tags/${tagId}`);
            return { fileId, tagId };
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

//fetch tags which not belong to this file
export const fetchUnassignedTags = createAsyncThunk(
    "tags/fetchUnassignedTags",
    async (fileId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/files/${fileId}/unassigned-tags`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const tagSlice = createSlice({
    name: 'tags',
    initialState: {
        tags: [] as Tag[],
        pending: false,
        error: '',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // שליפת כל התיוגים
            .addCase(fetchTags.pending, (state) => {
                state.pending = true;
                state.error = '';
            })
            .addCase(fetchTags.fulfilled, (state, action) => {
                state.pending = false;
                state.tags = action.payload;
            })
            .addCase(fetchTags.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload as string;
            })

            // שליפת תיוג לפי מזהה
            .addCase(fetchTagById.fulfilled, (state, action) => {
                if (!state.tags.find((tag) => tag.id === action.payload.id)) {
                    state.tags.push(action.payload);
                }
            })

            // הוספת תיוג
            .addCase(addTag.pending, (state) => {
                state.pending = true;
                state.error = '';
            })
            .addCase(addTag.fulfilled, (state, action) => {
                state.pending = false;
                state.tags.push(action.payload);
            })
            .addCase(addTag.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload as string;
            })

            // עדכון תיוג
            .addCase(updateTag.pending, (state) => {
                state.pending = true;
                state.error = '';
            })
            .addCase(updateTag.fulfilled, (state, action) => {
                state.pending = false;
                const tagIndex = state.tags.findIndex((tag) => tag.id === action.payload.id);
                if (tagIndex !== -1) {
                    state.tags[tagIndex].tagName = action.payload.name;
                }
            })
            .addCase(updateTag.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload as string;
            })
            // Fetch tags by file
            .addCase(fetchTagsByFile.pending, (state) => {
                state.pending = true;
                state.error = '';
            })
            .addCase(fetchTagsByFile.fulfilled, (state, action) => {
                state.pending = false;
                state.tags = action.payload;
            })
            .addCase(fetchTagsByFile.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload as string;
            })

            // Add tag to file
            .addCase(addTagToFile.pending, (state) => {
                state.pending = true;
                state.error = '';
            })
            .addCase(addTagToFile.fulfilled, (state, action) => {
                state.pending = false;
                state.tags.push(action.payload);
            })
            .addCase(addTagToFile.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload as string;
            })

            // Remove tag from file
            .addCase(removeTagFromFile.pending, (state) => {
                state.pending = true;
                state.error = '';
            })
            .addCase(removeTagFromFile.fulfilled, (state, action) => {
                state.pending = false;
                if (state.tags[action.payload.fileId]) {
                    state.tags = state.tags.filter(
                        (tag) => tag.id !== action.payload.tagId
                    );
                }
            })
            .addCase(removeTagFromFile.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload as string;
            })
            .addCase(fetchUnassignedTags.pending, (state) => {
                state.pending = true;
                state.error = '';
            })
            .addCase(fetchUnassignedTags.fulfilled, (state, action) => {
                state.pending = false;
                state.tags = action.payload; 
            })
            .addCase(fetchUnassignedTags.rejected, (state, action) => {
                state.pending = false;
                state.error = action.payload as string;
            });
    },
});

export default tagSlice.reducer;
