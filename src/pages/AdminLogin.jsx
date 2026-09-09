import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, KeyRound, AlertCircle, Sparkles, Eye, EyeOff } from 'lucide-react';
import { HeartBackground } from '../components/HeartBackground';
import { LoveButton } from '../components/LoveButton';
import { useAuth } from '../context/AuthContext';

export const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginWithSupabase, loginAsDemoAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await loginWithSupabase(email, password);
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    loginAsDemoAdmin();
    navigate('/admin');
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      <HeartBackground />

      <main className="relative z-10 w-full max-w-md my-auto">
        <div className="glass-card-dark rounded-3xl p-6 sm:p-8 border border-rose-500/30 text-center space-y-6 shadow-2xl backdrop-blur-2xl">
          {/* Header */}
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-pink-200">
              Admin Login ❤️
            </h1>
            <p className="text-xs text-slate-400">
              Private Dashboard to view your date responses
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-xl text-xs text-rose-200 flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@love.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/90 text-white text-sm pl-10 pr-4 py-2.5 rounded-xl border border-rose-500/30 focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/90 text-white text-sm pl-10 pr-10 py-2.5 rounded-xl border border-rose-500/30 focus:outline-none focus:border-rose-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-2.5 p-1 rounded-md text-slate-400 hover:text-rose-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <LoveButton fullWidth type="submit" className="py-3 text-base">
              {loading ? 'Authenticating...' : 'Log In to Dashboard'}
            </LoveButton>
          </form>

          {/* Divider */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-950 px-2 text-slate-500 font-semibold">Or</span>
            </div>
          </div>

          {/* Quick Demo Login Option */}
          <button
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-rose-400" /> Quick Demo Admin Login
          </button>

          <div className="pt-2 text-xs">
            <Link to="/" className="text-slate-400 hover:text-rose-300">
              ← Return to Main Page
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
