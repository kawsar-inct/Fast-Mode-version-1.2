import React, { useState } from 'react';
import {
  Activity,
  Zap,
  Globe,
  Radio,
  History,
  Wifi,
  HelpCircle,
  Sun,
  Moon,
  Menu,
  X,
  Server,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  toggleTheme: () => void;
  isOnline: boolean;
  serverName: string;
  onOpenServerModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isDark,
  toggleTheme,
  isOnline,
  serverName,
  onOpenServerModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'speed', label: 'Speed Test', icon: Activity },
    { id: 'dns', label: 'DNS Benchmark', icon: Globe },
    { id: 'diagnostics', label: 'Diagnostics', icon: Radio },
    { id: 'history', label: 'History & Reports', icon: History },
    { id: 'wifi', label: 'Wi-Fi Toolkit', icon: Wifi },
    { id: 'education', label: 'Guides & FAQ', icon: HelpCircle }
  ];

  return (
    <nav className={`sticky top-0 z-40 transition-colors duration-200 border-b ${
      isDark
        ? 'bg-slate-950/85 backdrop-blur-md border-slate-800/80 text-white'
        : 'bg-white/90 backdrop-blur-md border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('speed')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight flex items-center gap-1">
                Fast<span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Mode</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono font-semibold border border-cyan-500/20 ml-1">
                  PRO
                </span>
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? isDark
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                        : 'bg-blue-50 text-blue-600 border border-blue-200 font-semibold'
                      : isDark
                      ? 'text-slate-400 hover:text-white hover:bg-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Right Action Tools: Server badge, Online status, Theme toggle */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Server Selector Trigger */}
            <button
              onClick={onOpenServerModal}
              title="Change Test Server"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border ${
                isDark
                  ? 'bg-slate-900 border-slate-700/80 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              <span className="max-w-[140px] truncate">{serverName}</span>
            </button>

            {/* Online Indicator */}
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                isOnline
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
              title={isOnline ? 'Network Online' : 'No Internet Connection'}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
              <span className="hidden md:inline">{isOnline ? 'Live' : 'Offline'}</span>
            </div>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark/Light Mode"
              className={`p-2 rounded-lg transition-colors border ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-amber-400'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg border ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-slate-300'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden px-4 pt-2 pb-4 space-y-1 border-t ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? isDark
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                    : isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-800/50 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenServerModal();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-mono text-cyan-400 flex items-center gap-1.5"
            >
              <Server className="w-3.5 h-3.5" />
              <span>Server: {serverName}</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TLS Secured</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
