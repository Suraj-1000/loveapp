import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Heart,
  Calendar,
  Clock,
  Sparkles,
  LogOut,
  RefreshCw,
  Copy,
  Check,
  Plus,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Hourglass,
  Trash2
} from 'lucide-react';
import { HeartBackground } from '../components/HeartBackground';
import { LoveButton } from '../components/LoveButton';
import { Countdown } from '../components/Countdown';
import { StepModal } from '../components/StepModal';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { calculatePrepTime } from '../utils/dateUtils';
import { generateInviteCode } from '../utils/generateInviteCode';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  const [deletingCode, setDeletingCode] = useState(null);

  // New Invite Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRecipient, setNewRecipient] = useState('');
  const [newSender, setNewSender] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase.getAllInvitations();
      setInvitations(data || []);
    } catch (e) {
      console.error('Error fetching admin dashboard data:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleCreateNewInvite = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    const code = generateInviteCode(newRecipient);
    const { data } = await supabase.createInvitation({
      inviteCode: code,
      recipientName: newRecipient || 'My Love',
      senderName: newSender || 'Suraj',
    });

    if (data) {
      setInvitations((prev) => [data, ...prev]);
    }

    setIsCreating(false);
    setIsModalOpen(false);
    setNewRecipient('');
    setNewSender('');
  };

  const handleDeleteInvitation = async (code) => {
    if (!window.confirm('Are you sure you want to delete this date invitation?')) {
      return;
    }
    setDeletingCode(code);
    await supabase.deleteInvitation(code);
    setInvitations((prev) => prev.filter((item) => item.invite_code !== code));
    setDeletingCode(null);
  };

  const copyInviteLink = (code) => {
    const link = `${window.location.origin}/date/${code}`;
    navigator.clipboard.writeText(link);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen relative flex flex-col p-4 sm:p-8 overflow-x-hidden">
      <HeartBackground />

      {/* Admin Navbar */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-rose-500/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-600/30 border border-rose-500/40 rounded-xl text-rose-400">
            <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-rose-200">
              ❤️ Date Dashboard
            </h1>
            <p className="text-xs text-slate-400 font-medium">Logged in as {user?.email || 'Admin'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-rose-500/20 transition-all cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Link
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-slate-900/80 text-rose-400 hover:bg-rose-950/60 border border-rose-500/20 transition-all cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-5xl mx-auto space-y-6 flex-1">
        {/* Invites List Grid */}
        {invitations.length === 0 ? (
          <div className="glass-card-dark rounded-3xl p-10 text-center space-y-4 border border-rose-500/30 max-w-md mx-auto my-12">
            <Heart className="w-12 h-12 text-rose-500/50 mx-auto" />
            <h3 className="text-xl font-bold text-rose-200">No Invitations Yet</h3>
            <p className="text-slate-400 text-xs">Create your first invitation link to send to your girlfriend!</p>
            <LoveButton onClick={() => setIsModalOpen(true)}>Create Invitation 💌</LoveButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {invitations.map((inv) => {
              const isAnswered = inv.status === 'confirmed' || inv.response === 'YES';
              const prep = isAnswered && inv.selected_date && inv.selected_time
                ? calculatePrepTime(inv.selected_date, inv.selected_time)
                : null;
              const isDeleting = deletingCode === inv.invite_code;

              return (
                <div
                  key={inv.id || inv.invite_code}
                  className={`glass-card-dark rounded-3xl p-6 border border-rose-500/30 space-y-5 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-opacity ${
                    isDeleting ? 'opacity-40 pointer-events-none' : ''
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-rose-400 font-bold uppercase tracking-wider block">
                        Recipient: {inv.recipient_name}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">/date/{inv.invite_code}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                          isAnswered
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {isAnswered ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-rose-400" /> YES 🥹
                          </>
                        ) : (
                          <>
                            <Hourglass className="w-3.5 h-3.5 text-amber-400" /> Pending...
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Main Response Box */}
                  {isAnswered ? (
                    <div className="bg-slate-900/90 rounded-2xl p-5 border border-rose-500/30 space-y-4 shadow-inner">
                      <div className="text-center pb-2 border-b border-rose-500/20">
                        <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-100 to-rose-300">
                          IT'S A DATE! ❤️
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Response recorded on{' '}
                          <span className="text-rose-300 font-semibold">
                            {new Date(inv.updated_at || Date.now()).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </p>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-800/60 p-3 rounded-xl border border-rose-500/10">
                          <span className="text-[10px] text-rose-300 font-bold uppercase tracking-wider block">
                            Date
                          </span>
                          <span className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                            <Calendar className="w-4 h-4 text-rose-400" />
                            {prep?.formattedSelectedDate || inv.selected_date}
                          </span>
                        </div>

                        <div className="bg-slate-800/60 p-3 rounded-xl border border-rose-500/10">
                          <span className="text-[10px] text-pink-300 font-bold uppercase tracking-wider block">
                            Time
                          </span>
                          <span className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-4 h-4 text-pink-400" />
                            {prep?.formattedSelectedTime || inv.selected_time}
                          </span>
                        </div>
                      </div>

                      {/* Vibe */}
                      {inv.vibe && (
                        <div className="bg-slate-800/60 p-3 rounded-xl border border-rose-500/10 flex items-center justify-between">
                          <span className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">
                            Date Vibe
                          </span>
                          <span className="text-xs font-bold text-purple-200 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> {inv.vibe}
                          </span>
                        </div>
                      )}

                      {/* 30-Min Preparation Notice */}
                      {prep?.prepTimeString && (
                        <div className="bg-rose-950/60 p-3 rounded-xl border border-rose-500/30 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0" />
                          <span className="text-xs font-bold text-rose-200">
                            Get ready by <span className="underline decoration-rose-400">{prep.prepTimeString}</span> 😌❤️
                          </span>
                        </div>
                      )}

                      {/* Live Ticking Countdown */}
                      {prep?.targetDateObj && (
                        <div className="pt-2">
                          <Countdown targetDate={prep.targetDateObj} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-800 text-center space-y-2">
                      <p className="text-sm text-slate-300 font-medium">Waiting for her to open the link and answer... ⏳</p>
                      <p className="text-xs text-slate-500">Share the link below via WhatsApp / Instagram</p>
                    </div>
                  )}

                  {/* Actions Footer */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => copyInviteLink(inv.invite_code)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-200 border border-rose-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {copiedCode === inv.invite_code ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-rose-400" />}
                      {copiedCode === inv.invite_code ? 'Copied Link!' : 'Copy Link'}
                    </button>

                    <Link
                      to={`/date/${inv.invite_code}`}
                      target="_blank"
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold transition-all cursor-pointer"
                      title="Open Link Preview"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDeleteInvitation(inv.invite_code)}
                      className="p-2.5 rounded-xl bg-slate-900 hover:bg-rose-950/80 text-slate-400 hover:text-rose-400 border border-slate-700 hover:border-rose-500/40 text-xs font-bold transition-all cursor-pointer"
                      title="Delete Invitation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal: Create New Invitation Link */}
      <StepModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Invitation 💌"
      >
        <form onSubmit={handleCreateNewInvite} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name (Sender)</label>
            <input
              type="text"
              required
              placeholder="Suraj"
              value={newSender}
              onChange={(e) => setNewSender(e.target.value)}
              className="w-full bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl border border-rose-500/30 focus:outline-none focus:border-rose-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Her Name (Recipient)</label>
            <input
              type="text"
              required
              placeholder="My Love"
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
              className="w-full bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl border border-rose-500/30 focus:outline-none focus:border-rose-400"
            />
          </div>

          <LoveButton fullWidth type="submit">
            {isCreating ? 'Generating...' : 'Create Invitation Link ❤️'}
          </LoveButton>
        </form>
      </StepModal>

      {/* Footer */}
      <footer className="relative z-10 mt-12 text-center text-xs text-slate-500">
        <p className="flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> Protected Private Date Invitation Admin Dashboard
        </p>
      </footer>
    </div>
  );
};
