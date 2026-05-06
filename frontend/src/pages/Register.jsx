import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User as UserIcon, Shield } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'client'
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await register(formData);
    if (success) {
      navigate('/login');
    } else {
      setError('Registration failed. Email might already be taken.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="glass-card p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-pink-500/20 rounded-2xl mb-4">
            <UserPlus className="text-pink-400" size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Join HelpSync</h1>
          <p className="text-slate-400">Create an account to get started</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><UserIcon size={18} /></span>
              <input 
                type="text" 
                placeholder="John Doe" 
                style={{ paddingLeft: '3rem' }}
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Email Address</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Mail size={18} /></span>
              <input 
                type="email" 
                placeholder="you@example.com" 
                style={{ paddingLeft: '3rem' }}
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Role</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Shield size={18} /></span>
              <select 
                style={{ paddingLeft: '3rem' }}
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                <option value="client">Client (Needs Help)</option>
                <option value="volunteer">Volunteer (Wants to Help)</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><Lock size={18} /></span>
              <input 
                type="password" 
                placeholder="••••••••" 
                style={{ paddingLeft: '3rem' }}
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full justify-center text-lg py-3 mt-4" style={{ background: 'var(--secondary)' }}>
            Create Account
          </button>
        </form>

        <p className="text-center mt-8 text-slate-400">
          Already have an account? <Link to="/login" className="text-indigo-400 font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
