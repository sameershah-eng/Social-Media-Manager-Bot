import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  ChevronDown,
  Check,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  PlayCircle,
  HelpCircle,
} from 'lucide-react';
import { ConnectedAccount, Workspace } from '../../types';

interface TopBarProps {
  workspace: Workspace;
  onSwitchWorkspace: (wsName: string) => void;
  accounts: ConnectedAccount[];
  onOpenSearch: () => void;
  onOpenReadiness: () => void;
  onOpenOnboarding: () => void;
  onSimulatePublish: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  workspace,
  onSwitchWorkspace,
  accounts,
  onOpenSearch,
  onOpenReadiness,
  onOpenOnboarding,
  onSimulatePublish,
}) => {
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const wsRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const workspacesList = [
    'SocialFlow Media Labs',
    'Acme Brands Agency',
    'Horizon DTC Growth',
  ];

  const notifications = [
    {
      id: '1',
      title: 'Post Published to TikTok & Facebook',
      desc: '"5 Automation Hacks Every Social Manager Needs" is live.',
      time: '1h ago',
      type: 'success',
    },
    {
      id: '2',
      title: 'Human Review Required',
      desc: 'Sensitive refund keyword detected in Facebook DM from Marcus Vance.',
      time: '2h ago',
      type: 'warning',
    },
    {
      id: '3',
      title: 'Daily Auto-Publishing Queue Ready',
      desc: '3 scheduled posts lined up for afternoon deployment.',
      time: '4h ago',
      type: 'info',
    },
  ];

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wsRef.current && !wsRef.current.contains(e.target as Node)) {
        setWorkspaceMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-20">
      {/* Left: Workspace Selector & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="relative" ref={wsRef}>
          <button
            onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-900"
          >
            <div className="w-2 h-2 rounded-full bg-indigo-600" />
            <span className="truncate max-w-[160px] sm:max-w-[200px]">{workspace.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {workspaceMenuOpen && (
            <div className="absolute left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-40">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Switch Workspace
              </div>
              {workspacesList.map((ws) => (
                <button
                  key={ws}
                  onClick={() => {
                    onSwitchWorkspace(ws);
                    setWorkspaceMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left"
                >
                  <span className="truncate">{ws}</span>
                  {ws === workspace.name && <Check className="w-4 h-4 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Connected account summary pills */}
        <div className="hidden lg:flex items-center gap-2 border-l border-slate-200 pl-3">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="flex items-center gap-1.5 text-[11px] text-slate-600 bg-slate-100/70 px-2 py-1 rounded-md"
              title={`${acc.accountName} (${acc.isConnected ? 'Connected' : 'Disconnected'})`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  acc.isConnected ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              />
              <span className="font-medium capitalize">{acc.platform}</span>
              <span className="text-slate-400 text-[10px]">({acc.isDemo ? 'Demo' : 'Live'})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Center/Right: Search, Fast Actions, Notifications, Profile */}
      <div className="flex items-center gap-2.5">
        {/* Quick Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-slate-50 text-xs text-slate-400 hover:text-slate-600 transition-colors w-32 sm:w-56"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate flex-1 text-left">Search or jump to...</span>
          <kbd className="hidden sm:inline-block text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Handover Readiness check button */}
        <button
          onClick={onOpenReadiness}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 rounded-lg transition-colors"
          title="Verify account connection, publishing pipeline, and scheduler status"
        >
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Readiness Check</span>
        </button>

        {/* Fast Simulate Queue Trigger */}
        <button
          onClick={onSimulatePublish}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
          title="Simulate immediate background queue publish worker"
        >
          <PlayCircle className="w-3.5 h-3.5 text-indigo-600" />
          <span>Run Queue Now</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-40">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] text-indigo-600 font-medium">3 unread</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3 hover:bg-slate-50 transition-colors flex gap-2.5">
                    <div className="mt-0.5 shrink-0">
                      {n.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {n.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {n.type === 'info' && <PlayCircle className="w-4 h-4 text-indigo-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{n.title}</p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                        {n.desc}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-semibold text-xs flex items-center justify-center">
              S
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-40">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">Sameer</p>
                <p className="text-[11px] text-slate-500 truncate">{workspace.email}</p>
                <div className="mt-1 inline-block text-[10px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                  {workspace.role}
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onOpenOnboarding();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                  <span>Interactive Onboarding</span>
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    onOpenReadiness();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Handover Verification</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
