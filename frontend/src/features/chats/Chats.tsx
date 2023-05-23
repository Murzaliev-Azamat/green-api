import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectMessage } from './chatsSlice';
import { Chat, Message } from '../../../types';
import { addMessage, fetchMessages } from './chatsThunks';
import { Button, Grid, TextField } from '@mui/material';

const Chats = () => {
  const dispatch = useAppDispatch();
  const newMessage = useAppSelector(selectMessage);

  const [lastReceivedMessage, setLastReceivedMessage] = useState<Message | null>(null);
  const [newMessages, setNewMessages] = useState<string[]>([]);
  const [allMessages, setAllMessages] = useState<string[]>([]);
  const [showInput, setShowInput] = useState<boolean>(false);

  const [state, setState] = useState<Chat>({
    idInstance: '',
    apiTokenInstance: '',
    phoneNumber: '',
    message: '',
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      dispatch(
        fetchMessages({
          idInstance: state.idInstance,
          apiTokenInstance: state.apiTokenInstance,
          phoneNumber: state.phoneNumber,
          message: state.message,
        }),
      );
    }, 7000);
    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch, state.idInstance, state.apiTokenInstance, state.phoneNumber, state.message]);

  useEffect(() => {
    if (newMessage && newMessage !== lastReceivedMessage) {
      setNewMessages((prev) => [...prev, newMessage.body.messageData.textMessageData?.textMessage]);
      setAllMessages((prev) => [...prev, newMessage.body.messageData.textMessageData?.textMessage]);
      setLastReceivedMessage(newMessage);
    }
  }, [newMessage, lastReceivedMessage]);

  const submitFormHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(
      addMessage({
        idInstance: state.idInstance,
        apiTokenInstance: state.apiTokenInstance,
        phoneNumber: state.phoneNumber,
        message: state.message,
      }),
    );
    setAllMessages((prev) => [...prev, state.message]);
    setShowInput(true);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  return (
    <div className="main-container">
      <div className="form-container">
        <form autoComplete="off" onSubmit={submitFormHandler}>
          <Grid container direction="column" spacing={2} sx={{ mb: 2 }}>
            <Grid item xs>
              <TextField
                sx={{ backgroundColor: 'white' }}
                id="idInstance"
                label="idInstance"
                value={state.idInstance}
                onChange={inputChangeHandler}
                name="idInstance"
                required
                disabled={showInput}
              />
            </Grid>
            <Grid item xs>
              <TextField
                sx={{ backgroundColor: 'white' }}
                id="apiTokenInstance"
                label="apiTokenInstance"
                value={state.apiTokenInstance}
                onChange={inputChangeHandler}
                name="apiTokenInstance"
                required
                disabled={showInput}
              />
            </Grid>
            <Grid item xs>
              <TextField
                sx={{ backgroundColor: 'white' }}
                id="phoneNumber"
                label="phoneNumber"
                value={state.phoneNumber}
                onChange={inputChangeHandler}
                name="phoneNumber"
                required
                disabled={showInput}
              />
            </Grid>

            <Grid item xs>
              <TextField
                sx={{ backgroundColor: 'white' }}
                id="message"
                label="message"
                value={state.message}
                onChange={inputChangeHandler}
                name="message"
                required
              />
            </Grid>
          </Grid>

          <Button type="submit" color="primary" variant="contained">
            Send message
          </Button>
        </form>
      </div>
      <div className="desk">
        {allMessages.map((message, index) => (
          <p style={newMessages.includes(message) ? {} : { textAlign: 'right' }} key={index}>
            {message}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Chats;
