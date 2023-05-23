import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosApi from '../../axiosApi';
import { Chat, Message } from '../../../types';

export const fetchMessages = createAsyncThunk<Message, Chat>('chats/fetchAll', async (chat) => {
  const messageResponse = await axiosApi.get<Message>(
    `/waInstance${chat.idInstance}/receiveNotification/${chat.apiTokenInstance}`,
  );
  await axiosApi.delete(
    `/waInstance${chat.idInstance}/deleteNotification/${chat.apiTokenInstance}/${messageResponse.data.receiptId}`,
  );
  return messageResponse.data;
});

export const addMessage = createAsyncThunk<void, Chat>('chats/addChat', async (chat) => {
  await axiosApi.post<Chat>(`/waInstance${chat.idInstance}/sendMessage/${chat.apiTokenInstance}`, {
    chatId: chat.phoneNumber + '@c.us',
    message: chat.message,
  });
});
