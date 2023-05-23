import { createSlice } from '@reduxjs/toolkit';
import { Message } from '../../../types';
import { RootState } from '../../app/store';
import { fetchMessages } from './chatsThunks';

interface ChatState {
  message: Message | null;
  fetchMessageLoading: boolean;
}

const initialState: ChatState = {
  message: null,
  fetchMessageLoading: false,
};

export const ChatsSlice = createSlice({
  name: 'chats',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.pending, (state) => {
      state.fetchMessageLoading = true;
    });
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.fetchMessageLoading = false;
      state.message = action.payload;
    });
    builder.addCase(fetchMessages.rejected, (state) => {
      state.fetchMessageLoading = false;
    });
  },
});

export const chatsReducer = ChatsSlice.reducer;
export const selectMessage = (state: RootState) => state.chats.message;

export const selectFetchMessageLoading = (state: RootState) => state.chats.fetchMessageLoading;
