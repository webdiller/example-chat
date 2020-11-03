import { Avatar, IconButton } from '@material-ui/core';
import {
  AttachFile,
  InsertEmoticon,
  MoreVert,
  SearchOutlined,
  Mic
} from '@material-ui/icons';
import React, { useState } from 'react';
import axios from './axios';
import openSocket from 'socket.io-client';

import './css/Chat.css';
import Axios from 'axios';

const socket = openSocket(
  process.env.REACT_APP_SOCKET_ENDPOINT || 'http://localhost:5000'
);

function Chat({ messages }) {
  const [input, setInput] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    debugger
    // const { data: chatMsg } = await axios.post(`/api/chat/create${window.location.pathname}`, {
    //   textMessage: input,
    // });

    Axios({
      method: 'POST',
      url: `http://localhost:5000/api/chat/create${window.location.pathname}`,
      data: {
        textMessage: input
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.token
      }
    })
      .then((data) => {
          console.log(data.data);
          console.log('Успешно отправлено сообщение');
          socket.emit('broadcast-message', data.data);
          updateScroll();
          setInput('');
      })
      .catch((err) => {
        if (err.response) {
          alert('Ошибка, попробуйте позже');
        }
      });
  };

  function updateScroll() {
    const chatbox = document.getElementById('chatbox');
    if (chatbox) chatbox.scrollTop = chatbox.scrollHeight;
  }

  return (
    <div className='chat'>
      <div className='chat__header'>
        <Avatar />

        <div className='chat__headerInfo'>
          <h3>Room name</h3>
          <p>Last seen at...</p>
        </div>

        <div className='chat__headerRight'>
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div id='chatbox' className='chat__body'>
        {messages.map((message) => (
          <p
            key={message._id}
            className={`chat__message ${message.received && 'chat__reciever'}`}
          >
            <span className='chat__name'>{message.name}</span>
            {message.message}
            <span className='chat__timestamp'>{message.timestamp}</span>
          </p>
        ))}
      </div>

      <div className='chat__footer'>
        <InsertEmoticon />
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Type a message'
            type='text'
          />
          <button onClick={sendMessage} type='submit'>
            Send a message
          </button>
        </form>
        <Mic />
      </div>
    </div>
  );
}

export default Chat;
