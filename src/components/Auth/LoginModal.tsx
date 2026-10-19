import React, { useState } from 'react';
import { X, KeyRound, ShieldCheck, Globe, Loader2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { atproto } from '../../services/atproto';
import { oauthService } from '../../services/oauth';
import { SessionData } from '../../types/bsky';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (session: SessionData) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'app_password' | 'oauth'>('app_password');
  const [handle, setHandle] = useState('');
  const [appPassword, setAppPassword] = useState('');
  const [serviceUrl, setServiceUrl] = useState('https://bsky.social');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAppPasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim() || !appPassword.trim()) {
      setError('Please provide your handle and app password.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const session = await atproto.login(handle, appPassword, serviceUrl);
      onLoginSuccess(session);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your handle and app password.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) {
      setError('Please provide your handle (e.g. alice.bsky.social).');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const authUrl = await oauthService.initiateAuth(handle);
      window.location.href = authUrl;
    } catch (err: any) {
      setError(`OAuth initiation error: ${err.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#09090c] border border-[#23232c] rounded-3xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0d0d12] border-b border-[#1c1c24]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold">
              ⚡
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">Sign In to LibreSky</h2>
              <p className="text-[11px] text-zinc-400">AT Protocol & Bluesky Network</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: App Password vs OAuth2 */}
        <div className="flex p-2 bg-[#060608] border-b border-[#191920]">
          <button
            type="button"
            onClick={() => setAuthMode('app_password')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
              authMode === 'app_password'
                ? 'bg-[#15151b] text-cyan-400 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            App Password (Instant)
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('oauth')}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition flex items-center justify-center gap-1.5 ${
              authMode === 'oauth'
                ? 'bg-[#15151b] text-cyan-400 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            OAuth2 Flow
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {authMode === 'app_password' ? (
            <form onSubmit={handleAppPasswordLogin} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Bluesky Handle or Email
                </label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="e.g. yourhandle.bsky.social"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121217] border border-[#252530] text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                    App Password
                  </label>
                  <a
                    href="https://bsky.app/settings/app-passwords"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-cyan-400 hover:underline"
                  >
                    Generate App Password ↗
                  </a>
                </div>
                <input
                  type="password"
                  value={appPassword}
                  onChange={(e) => setAppPassword(e.target.value)}
                  placeholder="xxxx-xxxx-xxxx-xxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121217] border border-[#252530] text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition font-mono"
                  required
                />
              </div>

              {/* Advanced PDS setting */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 transition"
                >
                  {showAdvanced ? '− Hide Custom PDS' : '+ Custom PDS / Hosting'}
                </button>
                {showAdvanced && (
                  <div className="mt-2">
                    <input
                      type="text"
                      value={serviceUrl}
                      onChange={(e) => setServiceUrl(e.target.value)}
                      placeholder="https://bsky.social"
                      className="w-full px-3 py-2 rounded-xl bg-[#121217] border border-[#252530] text-xs text-zinc-300"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleOAuthLogin} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                  Bluesky Handle
                </label>
                <input
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="e.g. handle.bsky.social"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#121217] border border-[#252530] text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 transition"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-[#121217] border border-[#22222a] text-[11px] text-zinc-400 leading-relaxed">
                OAuth2 securely delegates permissions without exposing your account password. You will be redirected to your PDS authentication portal.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Authorize with OAuth2
              </button>
            </form>
          )}

          {/* Guest / Public mode option */}
          <div className="pt-2 text-center border-t border-[#1a1a22]">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-zinc-500 hover:text-cyan-400 transition"
            >
              Continue in Guest Mode (Read-only Discover)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
