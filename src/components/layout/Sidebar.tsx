import React from 'react';
import {
  LayoutDashboard,
  PenTool,
  CalendarDays,
  Inbox,
  BarChart3,
  Bot,
  MessageSquareText,
  Radio,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export type NavItemKey =
  | 'overview'
  | 'content-studio'
  | 'calendar'
  | 'inbox'
  | 'analytics'
  | 'automation'
  | 'templates'
  | 'accounts'
  | 'activity-logs'
  | 'settings';

interface SidebarProps {
  currentView: NavItemKey;
  onSelectView: (view: NavItemKey) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  pendingInboxCount?: number;
  scheduledCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  collapsed,
  onToggleCollapse,
  pendingInboxCount = 2,
  scheduledCount = 3,
}) => {
  const navItems: {
    key: NavItemKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
    countColor?: string;
  }[] = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'content-studio', label: 'Content Studio', icon: PenTool },
    { key: 'calendar', label: 'Publishing Calendar', icon: CalendarDays, count: scheduledCount },
    { key: 'inbox', label: 'Engagement Inbox', icon: Inbox, count: pendingInboxCount, countColor: 'text-indigo-600 bg-indigo-50 font-semibold' },
    { key: 'analytics', label: 'Analytics', icon: BarChart3 },
    { key: 'automation', label: 'Automation Rules', icon: Bot },
    { key: 'templates', label: 'Response Templates', icon: MessageSquareText },
    { key: 'accounts', label: 'Connected Accounts', icon: Radio },
    { key: 'activity-logs', label: 'Activity Logs', icon: ScrollText },
    { key: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-slate-200 transition-all duration-200 z-30 select-none ${
        collapsed ? 'w-18' : 'w-64'
      } shrink-0 min-h-screen`}
    >
      {/* Brand header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Logo icon with subtle signature gradient */}
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#635BFF] via-[#45A6F5] to-[#A78BFA] flex items-center justify-center text-white shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 tracking-tight leading-tight truncate">
                SocialFlow Studio
              </span>
              <span className="text-[11px] text-slate-400 font-medium truncate">
                Multi-Platform Suite
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation list */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectView(item.key)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50/80 text-indigo-700 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              />
              {!collapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}
              {!collapsed && item.count !== undefined && item.count > 0 && (
                <span
                  className={`text-[10px] tabular-nums px-1.5 py-0.5 rounded ${
                    item.countColor || 'text-slate-500 bg-slate-100'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Demo status & Collapse footer */}
      <div className="p-3 border-t border-slate-100 flex flex-col gap-2">
        {!collapsed && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-[11px] text-slate-500 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Automation Engine</span>
              <span className="text-emerald-600 font-medium">Active</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              TikTok & FB schedulers running in background.
            </p>
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-1.5 text-xs text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && <span className="text-[11px]">Collapse sidebar</span>}
        </button>
      </div>
    </aside>
  );
};
