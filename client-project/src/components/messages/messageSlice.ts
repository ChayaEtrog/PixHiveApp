import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Message } from "../../types/Message";
import { MessagePostModel } from "../../types/MessagePostModel";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper function to get the auth headers
const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
  },
});

// 1️⃣ Fetch all messages
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}`, getAuthHeaders());
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data || "Failed to fetch messages");
    }
  }
);

// 2️⃣ Fetch messages for a specific user
export const fetchUserMessages = createAsyncThunk(
  "messages/fetchUserMessages",
  async (userId:number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Message/user/${userId}`, getAuthHeaders());
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data || "Failed to fetch user messages");
    }
  }
);

// 3️⃣ Mark a message as read
export const markMessageAsRead = createAsyncThunk(
  "messages/markMessageAsRead",
  async ({ userId, messageId }:{userId:number,messageId:number}, { rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE_URL}/Message/mark-as-read?userId=${userId}&messageId=${messageId}`, {}, getAuthHeaders());
      return messageId; 
    } catch (error:any) {
      return rejectWithValue(error.response?.data || "Failed to mark message as read");
    }
  }
);

export const postMessage = createAsyncThunk(
  'messages/postMessage',
  async (message: MessagePostModel, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/Message`, message,getAuthHeaders());
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || 'Unknown error');
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [] as Message[], // Stores all messages
    loading: false, // Loading state
    error: '', // Error state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetching all messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.error='';
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle fetching user-specific messages
      .addCase(fetchUserMessages.pending, (state) => {
        state.loading = true;
        state.error = '';
      })
      .addCase(fetchUserMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.error='';
        state.messages = action.payload;
      })
      .addCase(fetchUserMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        state.messages = state.messages.map((message) =>
          message.id === action.payload ? { ...message, isRead: true } : message
        );
      })
      .addCase(postMessage.pending, (state) => {
        state.loading = false;
        state.error = '';
      })
      .addCase(postMessage.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(postMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default messagesSlice;
