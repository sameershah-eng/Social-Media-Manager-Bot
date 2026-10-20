import React, { useState, useEffect } from 'react';
import { Search, LayoutDashboard, PenTool, Calendar, Inbox, BarChart, Bot, FileText, Radio, Settings, ShieldCheck, Download, Plus } from 'lucide-react';
import { NavItemKey } from './Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: NavItemKey) => void;
  onNewPost: () => void;
  onRunReadiness: () => void;
  onExportCsv: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onNewPost,
  onRunReadiness,
  onExportCsv,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { label: 'Create New Post', icon: Plus, action: onNewPost, category: 'Actions' },
    { label: 'Download Analytics CSV', icon: Download, action: onExportCsv, category: 'Actions' },
    { label: 'Run Handover Readiness Check', icon: ShieldCheck, action: onRunReadiness, category: 'Actions' },
    { label: 'Go to Overview', icon: LayoutDashboard, action: () => onNavigate('overview'), category: 'Navigation' },
    { label: 'Go to Content Studio', icon: PenTool, action: () => onNavigate('content-studio'), category: 'Navigation' },
    { label: 'Go to Publishing Calendar', icon: Calendar, action: () => onNavigate('calendar'), category: 'Navigation' },
    { label: 'Go to Engagement Inbox', icon: Inbox, action: () => onNavigate('inbox'), category: 'Navigation' },
    { label: 'Go to Analytics & Reports', icon: BarChart, action: () => onNavigate('analytics'), category: 'Navigation' },
    { label: 'Go to Automation Rules', icon: Bot, action: () => onNavigate('automation'), category: 'Navigation' },
    { label: 'Go to Response Templates', icon: FileText, action: () => onNavigate('templates'), category: 'Navigation' },
    { label: 'Go to Connected Accounts', icon: Radio, action: () => onNavigate('accounts'), category: 'Navigation' },
    { label: 'Go to Settings', icon: Settings, action: () => onNavigate('settings'), category: 'Navigation' },
  ];

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-10">
        <div className="flex items-center px-4 border-b border-slate-100">
          <Search className="w-4 h-4 text-slate-400 mr-3" />
          <input
            type="text"
            placeholder="Type a command or search views..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full py-3.5 text-sm outline-none text-slate-900 placeholder:text-slate-400 bg-transparent"
            autoFocus
          />
          <kbd className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-mono">
            ESC
          </kbd>
        </div>

        <div className="max-h-72 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">No matching commands found.</div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-slate-700 hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{item.category}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
