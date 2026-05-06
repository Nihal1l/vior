import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (token && user) {
      const socket = new WebSocket(`ws://localhost:8000/api/v1/chat/ws/${token}`);
      
      socket.onopen = () => {
        console.log('Connected to WebSocket');
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          setMessages((prev) => [...prev, data.data]);
        }
      };

      socket.onclose = () => {
        console.log('Disconnected from WebSocket');
      };

      socketRef.current = socket;

      return () => {
        socket.close();
      };
    }
  }, [token, user]);

  const sendMessage = (conversationId, content, recipientId) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'chat',
        conversation_id: conversationId,
        content: content,
        recipient_id: recipientId
      }));
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, onlineUsers }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);
