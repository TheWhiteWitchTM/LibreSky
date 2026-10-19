import React from 'react';
import {
  Home,
  Flame,
  Bell,
  Bookmark,
  Search,
  User,
  Sparkles,
  PenSquare,
  LogOut,
  LogIn,
  Sliders,
  Cpu,
} from 'lucide-react';
import { atproto } from '../../services/atproto';
import { SessionData } from '../../types/bsky';
import { AIDetectionStatus } from '../../types/ai';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  session: SessionData | null;
  unreadCount: number;
  aiStatus: AIDetectionStatus;
  activeModelName: string;
  onOpenAISettings: () => void;
  onOpenComposer: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  session,
  unreadCount,
  aiStatus,
  activeModelName,
  onOpenAISettings,
  onOpenComposer,
  onOpenLogin,
  onLogout,
}) => {
  const navItems = [
    { id: 'timeline', label: 'Timeline', icon: Home },
    { id: 'discover', label: "What's Hot", icon: Flame },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'ai-copilot', label: 'LibreAI', icon: Sparkles, highlight: true },
  ];

  return (
    <aside className="w-16 xl:w-64 h-screen sticky top-0 flex flex-col justify-between p-3 xl:p-4 bg-black border-r border-[#16161c] select-none z-30">
      {/* Top Section */}
      <div className="space-y-4">
        {/* LibreSky Logo */}
        <div
          onClick={() => setActiveTab('timeline')}
          className="flex items-center gap-3 px-2 py-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition duration-300">
            <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center">
              <span className="text-xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                L
              </span>
            </div>
          </div>
          <div className="hidden xl:block">
            <h1 className="text-lg font-extrabold text-white tracking-tight leading-none">
              Libre<span className="text-cyan-400">Sky</span>
            </h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider">ATPROTO + LOCAL AI</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-2xl text-sm font-semibold transition-all group relative ${
                  isActive
                    ? 'bg-[#141418] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#0d0d10]'
                }`}
              >
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${
                      isActive
                        ? item.highlight
                          ? 'text-cyan-400'
                          : 'text-cyan-400'
                        : item.highlight
                        ? 'text-purple-400'
                        : 'text-zinc-400'
                    }`}
                  />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-cyan-500 text-black">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="hidden xl:inline truncate">{item.label}</span>

                {item.highlight && (
                  <span className="hidden xl:inline-block ml-auto text-[9px] uppercase font-mono px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Floating Post Button */}
        <button
          onClick={onOpenComposer}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold shadow-lg shadow-cyan-500/25 transition duration-200 active:scale-98"
        >
          <PenSquare className="w-5 h-5" />
          <span className="hidden xl:inline">Publish</span>
        </button>
      </div>

      {/* Bottom Section: Local AI Widget & User Session */}
      <div className="space-y-3 pt-4 border-t border-[#16161c]">
        {/* Local AI Status Card */}
        <div
          onClick={onOpenAISettings}
          title="Click to configure Local AI"
          className="p-2 xl:p-2.5 rounded-2xl bg-[#0a0a0d] border border-[#1e1e26] hover:border-cyan-500/50 cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  aiStatus === 'connected'
                    ? 'bg-emerald-400 ai-pulse'
                    : aiStatus === 'checking'
                    ? 'bg-amber-400 animate-pulse'
                    : 'bg-zinc-600'
                }`}
              />
              <div className="hidden xl:block">
                <div className="text-[11px] font-bold text-zinc-200 group-hover:text-cyan-300 transition truncate max-w-[130px]">
                  {aiStatus === 'connected' ? activeModelName || 'Local AI Online' : 'Local AI Offline'}
                </div>
                <div className="text-[9px] text-zinc-500 font-mono">
                  {aiStatus === 'connected' ? '127.0.0.1 Ready' : 'Click to scan'}
                </div>
              </div>
            </div>
            <Sliders className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 hidden xl:block" />
          </div>
        </div>

        {/* User Account / Login */}
        {session ? (
          <div className="flex items-center justify-between p-1.5 xl:p-2 rounded-2xl bg-[#09090b] border border-[#1a1a20]">
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2.5 truncate cursor-pointer flex-1"
            >
              {session.avatar ? (
                <img
                  src={session.avatar}
                  alt={session.handle}
                  className="w-8 h-8 rounded-full object-cover border border-zinc-700 shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-xs font-bold text-cyan-400 shrink-0">
                  {session.handle[0].toUpperCase()}
                </div>
              )}
              <div className="hidden xl:block truncate">
                <div className="text-xs font-bold text-white truncate">
                  {session.displayName || session.handle}
                </div>
                <div className="text-[11px] text-zinc-500 truncate">@{session.handle}</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg hover:bg-zinc-800 transition hidden xl:block"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenLogin}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-white transition"
          >
            <LogIn className="w-4 h-4 text-cyan-400" />
            <span className="hidden xl:inline">Sign In</span>
          </button>
        )}
      </div>
    </aside>
  );
};
