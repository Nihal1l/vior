import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { LayoutDashboard, Users, MessageSquare, Plus, CheckCircle, Clock, Heart, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = 'http://localhost:8000/api/v1';

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (user?.role === 'client') {
        const res = await axios.get(`${API_URL}/requests/my`);
        setRequests(res.data);
      } else if (user?.role === 'volunteer') {
        const resMy = await axios.get(`${API_URL}/requests/my`);
        const resPending = await axios.get(`${API_URL}/requests/pending`);
        setRequests(resMy.data);
        setPendingRequests(resPending.data);
      } else if (user?.role === 'admin') {
        // Admin data
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const createRequest = async () => {
    const title = prompt("What do you need help with?");
    const description = prompt("Describe your request:");
    if (title) {
      try {
        await axios.post(`${API_URL}/requests/`, { title, description });
        fetchData();
      } catch (err) {
        alert("Failed to create request");
      }
    }
  };

  const acceptRequest = async (id) => {
    try {
      await axios.post(`${API_URL}/requests/${id}/accept`);
      fetchData();
    } catch (err) {
      alert("Failed to accept request");
    }
  };

  const startChat = (requestId) => {
     // Find the conversation for this request
     // For simplicity, we navigate to a path that will handle fetching conversation
     navigate(`/chat/${requestId}`);
  };

  return (
    <div className="min-h-screen p-6">
      <nav className="flex justify-between items-center mb-12 glass-card px-8 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 p-2 rounded-xl">
            <Heart className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight">HelpSync</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="font-semibold">{user?.full_name || 'User'}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
          <button onClick={logout} className="text-sm text-slate-400 hover:text-white transition-colors">Sign Out</button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              {user?.role === 'client' ? 'My Help Requests' : 'Volunteer Dashboard'}
            </h1>
            <p className="text-slate-400">Manage your interactions and requests</p>
          </div>
          {user?.role === 'client' && (
            <button onClick={createRequest} className="btn btn-primary">
              <Plus size={20} /> New Request
            </button>
          )}
        </header>

        {user?.role === 'volunteer' && (
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="text-warning" size={20} /> Pending Requests
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingRequests.length === 0 && <p className="text-slate-500 col-span-full py-10 glass-card text-center">No pending requests available.</p>}
              {pendingRequests.map(req => (
                <div key={req.id} className="glass-card p-6 animate-fade-in hover:border-indigo-500/50 transition-all">
                  <h3 className="text-xl font-bold mb-2">{req.title}</h3>
                  <p className="text-slate-400 text-sm mb-6 line-clamp-2">{req.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{new Date(req.created_at).toLocaleDateString()}</span>
                    <button onClick={() => acceptRequest(req.id)} className="btn btn-primary py-2 text-sm">Accept</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle className="text-success" size={20} /> {user?.role === 'volunteer' ? 'Active Assignments' : 'Request History'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.length === 0 && <p className="text-slate-500 col-span-full py-10 glass-card text-center">No requests found.</p>}
            {requests.map(req => (
              <div key={req.id} className="glass-card p-6 animate-fade-in">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold">{req.title}</h3>
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${req.status === 'accepted' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-500/20 text-slate-400'}`}>
                    {req.status}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-6 line-clamp-2">{req.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                        {(user?.role === 'client' ? req.volunteer?.full_name : req.client?.full_name)?.[0] || '?'}
                     </div>
                     <span className="text-xs text-slate-400">{user?.role === 'client' ? (req.volunteer?.full_name || 'Waiting...') : req.client.full_name}</span>
                  </div>
                  {req.status === 'accepted' && (
                    <button onClick={() => startChat(req.id)} className="btn bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 py-2 text-sm">
                      <MessageSquare size={16} /> Chat
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
