import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Sparkles, Send, ShieldCheck, ArrowRight, Copy, Check } from 'lucide-react';
import { HeartBackground } from '../components/HeartBackground';
import { LoveButton } from '../components/LoveButton';
import { generateInviteCode } from '../utils/generateInviteCode';
import { supabase } from '../lib/supabase';

export const Home = () => {
  const navigate = useNavigate();
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [createdUrl, setCreatedUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateLink = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    const code = generateInviteCode(recipientName || 'love');
    
    await supabase.createInvitation({
      inviteCode: code,
      recipientName: recipientName || 'My Love',
      senderName: senderName || 'Suraj',
    });

    const fullUrl = `${window.location.origin}/date/${code}`;
    setCreatedUrl(fullUrl);
    setIsCreating(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      <HeartBackground />

      <main className="relative z-10 w-full max-w-xl my-auto">
        <div className="glass-card-dark rounded-3xl p-6 sm:p-10 border border-rose-500/30 text-center space-y-8 shadow-2xl backdrop-blur-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 font-semibold text-xs sm:text-sm">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
            <span>Romantic Private Date Invitation Generator</span>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-rose-100 to-pink-200 tracking-tight leading-tight">
              Create Your Romantic Date Invitation ❤️
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Send a personalized interactive link to your girlfriend with a moving NO button, funny confirmation, date planner, and live countdown.
            </p>
          </div>

          {/* Create Form */}
          <form onSubmit={handleCreateLink} className="space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-rose-500/20 text-left">
            <h3 className="text-sm font-bold text-rose-200 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rose-400" /> Quick Link Builder
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suraj"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full bg-slate-800 text-white text-sm px-3.5 py-2.5 rounded-xl border border-rose-500/20 focus:outline-none focus:border-rose-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Her Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Love"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-slate-800 text-white text-sm px-3.5 py-2.5 rounded-xl border border-rose-500/20 focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <LoveButton fullWidth type="submit" className="py-3 text-base">
              {isCreating ? 'Creating Link...' : 'Generate Unique Invitation Link 💌'}
            </LoveButton>
          </form>

          {/* Generated Link Result */}
          {createdUrl && (
            <div className="p-4 bg-rose-950/70 border border-rose-400/50 rounded-2xl space-y-3 animate-fade-in text-left">
              <span className="text-xs font-bold text-rose-300 uppercase tracking-wider block">
                Your Invitation Link Ready!
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={createdUrl}
                  className="w-full bg-slate-900 text-rose-200 text-xs px-3 py-2.5 rounded-xl border border-rose-500/30 font-mono truncate"
                />
                <button
                  type="button"
                  onClick={copyToClipboard}
                  className="px-3 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="pt-1 flex gap-2">
                <button
                  onClick={() => navigate(`/date/${createdUrl.split('/date/')[1]}`)}
                  className="text-xs font-semibold text-rose-300 hover:text-white underline flex items-center gap-1"
                >
                  Open Preview <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Demo Quick Navigation */}
          <div className="pt-2 border-t border-rose-500/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <Link
              to="/date/demo-love-2026"
              className="text-rose-300 hover:text-white font-semibold flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Try Demo Invitation Link
            </Link>

            <Link
              to="/admin"
              className="text-slate-400 hover:text-rose-300 font-medium flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Go to Admin Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};
