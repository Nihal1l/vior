import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import axios from 'axios';
import { Send, ArrowLeft, MoreVertical, Heart } from 'lucide-react';

const ChatRoom = () => {
  const { id } = useParams(); // This is the help_request_id
  const { user } = useAuth();
  const { messages, sendMessage } = useChat();
  const [request, setRequest] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [inputText, setInputText] = useState('');
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchConversation();
  }, [id]);

  const fetchConversation = async () => {
    try {
      // 1. Get conversation ID for this request
      const convRes = await axios.get(`${API_URL}/chat/history-by-request/${id}`); // We need to add this endpoint or similar
      setConversation(convRes.data);
      
      // 2. Get history
      const histRes = await axios.get(`${API_URL}/chat/history/${convRes.data.id}`);
      setHistory(histRes.data);
      
      // 3. Get request details
      const reqRes = await axios.get(`${API_URL}/requests/my`); // Filter locally for now or add endpoint
      const currentReq = reqRes.data.find(r => r.id === parseInt(id));
      setRequest(currentReq);
    } catch (err) {
      console.error("Failed to fetch chat details", err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !conversation) return;
    
    const recipientId = user.role === 'client' ? request.volunteer_id : request.client_id;
    sendMessage(conversation.id, inputText, recipientId);
    setInputText('');
  };

  // Combine history and real-time messages
  const allMessages = [...history, ...messages.filter(m => m.conversation_id === conversation?.id)];

  const partnerName = user.role === 'client' ? request?.volunteer?.full_name : request?.client?.full_name;

  return (
    <div className="h-screen flex flex-col p-6">
      <header className="glass-card px-6 py-4 flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold">
              {partnerName?.[0] || '?'}
            </div>
            <div>
              <h2 className="font-bold">{partnerName || 'Chat'}</h2>
              <p className="text-xs text-indigo-400">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 bg-slate-800 px-3 py-1 rounded-full">{request?.title}</span>
          <button className="p-2 hover:bg-slate-700 rounded-xl transition-colors">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      <div className="flex-1 glass-card overflow-hidden flex flex-col mb-6">
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scroll-hide">
          {allMessages.map((msg, i) => {
            const isMe = msg.sender_id === user.id;
            return (
              <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[70%] p-4 rounded-2xl ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-100 rounded-tl-none'}`}>
                  <p className="text-sm">{msg.content}</p>
                  <span className="text-[10px] opacity-50 mt-2 block text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-white/5 bg-slate-900/50">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="w-full bg-slate-800 border-none rounded-2xl py-4 pl-6 pr-14 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-indigo-500 rounded-xl hover:bg-indigo-600 transition-colors">
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
