import React, { useState } from 'react';
import {
  ContentPost,
  Conversation,
  ConnectedAccount,
  AnalyticsSnapshot,
  ActivityLog,
} from '../../types';
import {
  Users,
  Eye,
  TrendingUp,
  FileCheck2,
  Inbox,
  Share2,
  Calendar,
  PenTool,
  Clock,
  ArrowUpRight,
  Sparkles,
  Bot,
  AlertTriangle,
  PlayCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from 'recharts';
import { NavItemKey } from '../layout/Sidebar';

interface OverviewViewProps {
  posts: ContentPost[];
  conversations: Conversation[];
  accounts: ConnectedAccount[];
  analytics: AnalyticsSnapshot[];
  logs: ActivityLog[];
  onNavigate: (view: NavItemKey) => void;
  onOpenCreatePost: () => void;
  onSimulatePublish: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  posts,
  conversations,
  accounts,
  analytics,
  logs,
  onNavigate,
  onOpenCreatePost,
  onSimulatePublish,
}) => {
  const [dateFilter, setDateFilter] = useState<'7d' | '30d' | '90d'>('30d');

  // Compute live KPIs from actual data
  const publishedPosts = posts.filter((p) => p.status === 'published');
  const scheduledPosts = posts.filter((p) => p.status === 'scheduled');
  const pendingConversations = conversations.filter(
    (c) => c.status === 'unread' || c.status === 'needs_review'
  );

  const totalFollowers = accounts.reduce((acc, a) => acc + (a.followersCount || 0), 0);

  // Filter analytics snapshots by range
  const daysCount = dateFilter === '7d' ? 7 : dateFilter === '30d' ? 30 : 90;
  const filteredSnapshots = analytics.slice(-daysCount * 2); // 2 platforms

  // Aggregate reach & impressions per day for charts
  const chartDataMap = new Map<
    string,
    { date: string; tiktokReach: number; fbReach: number; impressions: number; totalReach: number }
  >();

  filteredSnapshots.forEach((snap) => {
    const existing = chartDataMap.get(snap.date) || {
      date: snap.date.slice(5), // MM-DD
      tiktokReach: 0,
      fbReach: 0,
      impressions: 0,
      totalReach: 0,
    };
    if (snap.platform === 'tiktok') {
      existing.tiktokReach = snap.reach;
    } else if (snap.platform === 'facebook') {
      existing.fbReach = snap.reach;
    }
    existing.impressions += snap.impressions;
    existing.totalReach += snap.reach;
    chartDataMap.set(snap.date, existing);
  });

  const chartData = Array.from(chartDataMap.values());

  const totalReachSum = chartData.reduce((acc, d) => acc + d.totalReach, 0);
  const totalImpressionsSum = chartData.reduce((acc, d) => acc + d.impressions, 0);
  const avgEngagementRate = 5.84; // Realistic healthy aggregate

  // Warning logs
  const failureLogs = logs.filter((l) => l.status === 'failed' || l.status === 'warning').slice(0, 3);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header section with primary actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Your social presence, on autopilot.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Plan content, nurture conversations, and understand performance from one workspace.
          </p>
        </div>

        {/* Action button cluster */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenCreatePost}
            className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-[#635BFF] via-[#45A6F5] to-[#A78BFA] text-white rounded-lg text-xs font-semibold hover:opacity-95 transition-opacity shadow-xs"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Create Post</span>
          </button>
          <button
            onClick={() => onNavigate('calendar')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Schedule Content</span>
          </button>
          <button
            onClick={() => onNavigate('inbox')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-semibold transition-colors"
          >
            <Inbox className="w-3.5 h-3.5 text-slate-500" />
            <span>View Inbox ({pendingConversations.length})</span>
          </button>
        </div>
      </div>

      {/* Date filter pill & Demo Mode Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Metrics Window:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateFilter(range)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  dateFilter === range
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <span>Connected Accounts: TikTok & Facebook</span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
            Demonstration Mode Active
          </span>
        </div>
      </div>

      {/* 6 Prominent KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Total Reach */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Total Reach</span>
            <Share2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">
            {totalReachSum.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+14.8%</span>
            <span className="text-[10px] text-slate-400 font-normal">vs prev</span>
          </div>
        </div>

        {/* Total Impressions */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Impressions</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">
            {totalImpressionsSum.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+18.2%</span>
            <span className="text-[10px] text-slate-400 font-normal">vs prev</span>
          </div>
        </div>

        {/* Total Followers */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Followers</span>
            <Users className="w-4 h-4 text-violet-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">
            {totalFollowers.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+2,840</span>
            <span className="text-[10px] text-slate-400 font-normal">new</span>
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Engagement</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">
            {avgEngagementRate}%
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-1">
            <ArrowUpRight className="w-3 h-3" />
            <span>+0.8%</span>
            <span className="text-[10px] text-slate-400 font-normal">vs avg</span>
          </div>
        </div>

        {/* Posts Published */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Published</span>
            <FileCheck2 className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">
            {publishedPosts.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {scheduledPosts.length} queued
          </div>
        </div>

        {/* Pending Conversations */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-500">Pending DMs</span>
            <Inbox className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">
            {pendingConversations.length}
          </div>
          <div className="text-[11px] text-indigo-600 font-semibold mt-1">
            Needs review
          </div>
        </div>
      </div>

      {/* Main Charts Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reach & Impressions Trend */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Reach & Impressions Trends</h3>
              <p className="text-xs text-slate-400 mt-0.5">Aggregated multi-channel performance</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-indigo-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
                TikTok
              </span>
              <span className="flex items-center gap-1.5 text-blue-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                Facebook
              </span>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTikTok" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#635BFF" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#635BFF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorFB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#45A6F5" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#45A6F5" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#e2e8f0" />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} stroke="#e2e8f0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tiktokReach"
                  name="TikTok Reach"
                  stroke="#635BFF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTikTok)"
                />
                <Area
                  type="monotone"
                  dataKey="fbReach"
                  name="Facebook Reach"
                  stroke="#45A6F5"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorFB)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Comparison Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Platform Split</h3>
              <span className="text-[11px] text-slate-400">Past 30 Days</span>
            </div>

            <div className="space-y-4">
              {/* TikTok */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">
                      TT
                    </div>
                    <span className="font-semibold text-slate-900">TikTok Creator</span>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">48,250 followers</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
                  <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '62%' }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>62% of total reach</span>
                  <span className="text-indigo-600 font-semibold">6.4% eng rate</span>
                </div>
              </div>

              {/* Facebook */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                      FB
                    </div>
                    <span className="font-semibold text-slate-900">Facebook Page</span>
                  </div>
                  <span className="font-bold text-slate-900 tabular-nums">32,680 followers</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '38%' }} />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>38% of total reach</span>
                  <span className="text-blue-600 font-semibold">4.9% eng rate</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick automation status */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-600" />
              <span className="font-medium text-slate-700">Daily Queue Daemon</span>
            </div>
            <button
              onClick={onSimulatePublish}
              className="text-[11px] text-indigo-600 font-semibold hover:underline flex items-center gap-1"
            >
              <PlayCircle className="w-3.5 h-3.5" />
              <span>Simulate Run</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two-Column Activity & Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Scheduled Posts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upcoming Scheduled Posts</h3>
              <p className="text-xs text-slate-400 mt-0.5">Next posts in the distribution queue</p>
            </div>
            <button
              onClick={() => onNavigate('content-studio')}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              Open Studio →
            </button>
          </div>

          <div className="space-y-3">
            {scheduledPosts.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                No scheduled posts found in queue. Click "Create Post" to schedule your next update.
              </div>
            ) : (
              scheduledPosts.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-lg flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {post.mediaUrl ? (
                      <img
                        src={post.mediaUrl}
                        alt=""
                        className="w-11 h-11 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <PenTool className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{post.title}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(post.scheduledFor).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                        <span>·</span>
                        <span className="capitalize">{post.targets.map(t => t.platform).join(', ')}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded shrink-0">
                    Scheduled
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Conversations & DMs */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Conversations</h3>
              <p className="text-xs text-slate-400 mt-0.5">Incoming comments and messages requiring attention</p>
            </div>
            <button
              onClick={() => onNavigate('inbox')}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              Open Inbox →
            </button>
          </div>

          <div className="space-y-3">
            {conversations.slice(0, 3).map((conv) => (
              <div
                key={conv.id}
                onClick={() => onNavigate('inbox')}
                className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-lg flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={conv.senderAvatar}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-900 truncate">
                        {conv.senderName}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono">
                        {conv.platform}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      conv.status === 'needs_review'
                        ? 'text-amber-700 bg-amber-50 border border-amber-200'
                        : conv.status === 'unread'
                        ? 'text-indigo-700 bg-indigo-50 border border-indigo-200'
                        : 'text-slate-600 bg-slate-100'
                    }`}
                  >
                    {conv.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Warnings & Failure Logs Banner if any */}
      {failureLogs.length > 0 && (
        <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-900">Recent Warnings & Diagnostics</span>
            </div>
            <button
              onClick={() => onNavigate('activity-logs')}
              className="text-[11px] text-amber-800 font-semibold hover:underline"
            >
              View Full Logs →
            </button>
          </div>
          <div className="space-y-1.5">
            {failureLogs.map((log) => (
              <p key={log.id} className="text-[11px] text-amber-800/90 leading-normal">
                • [{new Date(log.timestamp).toLocaleTimeString()}] <strong>{log.action}:</strong> {log.details}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
