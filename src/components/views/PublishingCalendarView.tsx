import React, { useState } from 'react';
import { ContentPost, PostStatus, SinglePlatform } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Eye,
  Trash2,
  Send,
  Calendar as CalendarIcon,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Drawer } from '../common/Drawer';
import { useToast } from '../common/Toast';

interface PublishingCalendarViewProps {
  posts: ContentPost[];
  onAddPost: (post: ContentPost) => void;
  onUpdatePost: (post: ContentPost) => void;
  onDeletePost: (id: string) => void;
}

export const PublishingCalendarView: React.FC<PublishingCalendarViewProps> = ({
  posts,
  onAddPost,
  onUpdatePost,
  onDeletePost,
}) => {
  const { success, info } = useToast();

  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [platformFilter, setPlatformFilter] = useState<'all' | SinglePlatform>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | PostStatus>('all');

  // Drawer detail state
  const [selectedPost, setSelectedPost] = useState<ContentPost | null>(null);

  // Quick Reschedule state inside drawer
  const [rescheduleDate, setRescheduleDate] = useState('');

  // Month navigation calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() - 1);
      setCurrentDate(d);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month + 1, 1));
    } else if (viewMode === 'week') {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 7);
      setCurrentDate(d);
    } else {
      const d = new Date(currentDate);
      d.setDate(d.getDate() + 1);
      setCurrentDate(d);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    const matchesPlatform =
      platformFilter === 'all' || p.targets.some((t) => t.platform === platformFilter);
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesPlatform && matchesStatus;
  });

  const getPostsForDate = (dateStr: string) => {
    return filteredPosts.filter((p) => {
      const postDate = new Date(p.scheduledFor).toISOString().split('T')[0];
      return postDate === dateStr;
    });
  };

  // Quick Post Creator on a specific date
  const handleQuickCreateOnDate = (dayNum: number) => {
    const targetDate = new Date(year, month, dayNum, 14, 0);
    const newPost: ContentPost = {
      id: `post_${Date.now()}`,
      title: `Scheduled Post for ${targetDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}`,
      defaultCaption: 'Quick drafted campaign post from calendar view.',
      hashtags: ['#socialflow', '#contentstrategy'],
      category: 'Promotion',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      mediaType: 'video',
      status: 'scheduled',
      scheduledFor: targetDate.toISOString(),
      targets: [
        { platform: 'tiktok', status: 'scheduled', scheduledFor: targetDate.toISOString() },
        { platform: 'facebook', status: 'scheduled', scheduledFor: targetDate.toISOString() },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onAddPost(newPost);
    setSelectedPost(newPost);
    success('Post Created on Calendar', `Scheduled for ${targetDate.toLocaleDateString()}`);
  };

  const handleApplyReschedule = () => {
    if (!selectedPost || !rescheduleDate) return;
    const updated: ContentPost = {
      ...selectedPost,
      scheduledFor: new Date(rescheduleDate).toISOString(),
      status: 'scheduled',
      targets: selectedPost.targets.map((t) => ({
        ...t,
        scheduledFor: new Date(rescheduleDate).toISOString(),
        status: 'scheduled',
      })),
      updatedAt: new Date().toISOString(),
    };
    onUpdatePost(updated);
    setSelectedPost(updated);
    success('Post Rescheduled', `New publishing time: ${new Date(rescheduleDate).toLocaleString()}`);
  };

  const handleInstantPublishFromDrawer = () => {
    if (!selectedPost) return;
    const updated: ContentPost = {
      ...selectedPost,
      status: 'published',
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targets: selectedPost.targets.map((t) => ({
        ...t,
        status: 'published',
        publishedAt: new Date().toISOString(),
        platformPostId: `${t.platform}_${Date.now()}`,
        platformPostUrl:
          t.platform === 'tiktok'
            ? `https://tiktok.com/@socialflow_studio/video/${Date.now()}`
            : `https://facebook.com/SocialFlowStudioApp/posts/${Date.now()}`,
      })),
    };
    onUpdatePost(updated);
    setSelectedPost(updated);
    success('Post Published Instantly', 'Dispatched to connected accounts.');
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Publishing Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Visual schedule of multi-channel publishing timelines and scheduled drops.
          </p>
        </div>

        {/* View mode switcher & Date navigation */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Month / Week / Day tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md capitalize transition-all ${
                  viewMode === mode
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode} View
              </button>
            ))}
          </div>

          {/* Period Navigator */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg p-1">
            <button
              onClick={handlePrev}
              className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
              aria-label="Previous period"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-900 px-2 min-w-[120px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNext}
              className="p-1 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors"
              aria-label="Next period"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 transition-colors"
          >
            Today
          </button>
        </div>
      </div>

      {/* Filter strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Platform:</span>
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value as any)}
              className="px-2 py-1 text-xs border border-slate-200 rounded-md bg-white text-slate-700 outline-none"
            >
              <option value="all">All Platforms</option>
              <option value="tiktok">TikTok Only</option>
              <option value="facebook">Facebook Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-2 py-1 text-xs border border-slate-200 rounded-md bg-white text-slate-700 outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="needs_review">Needs Review</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
            TikTok
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
            Facebook
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            Published
          </span>
        </div>
      </div>

      {/* Month View Grid */}
      {viewMode === 'month' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          {/* Days of week header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/70 text-center py-2.5 text-xs font-bold text-slate-600">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Calendar cell matrix */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 min-h-[580px]">
            {/* Blank leading slots */}
            {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
              <div key={`blank_${idx}`} className="bg-slate-50/30 p-2 min-h-[105px]" />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
                dayNum
              ).padStart(2, '0')}`;
              const dayPosts = getPostsForDate(dateStr);
              const isToday =
                new Date().toDateString() === new Date(year, month, dayNum).toDateString();

              return (
                <div
                  key={dayNum}
                  className={`p-2 flex flex-col justify-between group min-h-[105px] transition-colors ${
                    isToday ? 'bg-indigo-50/20' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold tabular-nums ${
                        isToday
                          ? 'w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center'
                          : 'text-slate-700'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* Quick create action button */}
                    <button
                      onClick={() => handleQuickCreateOnDate(dayNum)}
                      title="Quick Schedule Post on this date"
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Day Posts List */}
                  <div className="space-y-1 flex-1 overflow-y-auto max-h-[90px]">
                    {dayPosts.map((post) => {
                      const isTT = post.targets.some((t) => t.platform === 'tiktok');
                      const isFB = post.targets.some((t) => t.platform === 'facebook');

                      return (
                        <div
                          key={post.id}
                          onClick={() => {
                            setSelectedPost(post);
                            setRescheduleDate(post.scheduledFor.slice(0, 16));
                          }}
                          className={`px-1.5 py-1 rounded text-[10px] font-medium truncate cursor-pointer transition-transform hover:scale-[1.02] flex items-center gap-1 ${
                            post.status === 'published'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : post.status === 'scheduled'
                              ? isTT && isFB
                                ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                                : isTT
                                ? 'bg-slate-900 text-white'
                                : 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                          title={`${post.title} (${post.status})`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-current" />
                          <span className="truncate">{post.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week / Day View simple message or cards */}
      {viewMode !== 'month' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 capitalize">
              {viewMode} View Timeline
            </h3>
            <span className="text-xs text-slate-400">
              Showing filtered schedule for current period
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => {
                  setSelectedPost(post);
                  setRescheduleDate(post.scheduledFor.slice(0, 16));
                }}
                className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {post.mediaUrl ? (
                    <img src={post.mediaUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                      <CalendarIcon className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{post.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{post.defaultCaption}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(post.scheduledFor).toLocaleString()}</span>
                      <span>·</span>
                      <span className="capitalize">{post.targets.map((t) => t.platform).join(', ')}</span>
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                    post.status === 'published'
                      ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                      : 'text-indigo-700 bg-indigo-50 border border-indigo-200'
                  }`}
                >
                  {post.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Side Drawer for Inspected Post */}
      <Drawer
        isOpen={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
        title="Scheduled Post Details"
        subtitle={selectedPost?.title}
        width="lg"
      >
        {selectedPost && (
          <div className="space-y-6 text-xs">
            {/* Media thumbnail */}
            {selectedPost.mediaUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200 bg-black max-h-56">
                <img
                  src={selectedPost.mediaUrl}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Core Info */}
            <div className="space-y-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Post Caption
                </span>
                <p className="text-xs text-slate-800 mt-1 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                  {selectedPost.defaultCaption}
                </p>
                {selectedPost.hashtags.length > 0 && (
                  <p className="text-xs text-indigo-600 font-semibold mt-1.5">
                    {selectedPost.hashtags.join(' ')}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <span className="text-slate-400 text-[11px]">Distribution Status</span>
                  <p className="text-xs font-bold text-slate-900 capitalize mt-0.5">
                    {selectedPost.status.replace('_', ' ')}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-lg">
                  <span className="text-slate-400 text-[11px]">Category</span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    {selectedPost.category}
                  </p>
                </div>
              </div>

              {/* Target Platforms */}
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Target Platform Endpoints
                </span>
                <div className="space-y-2 mt-1.5">
                  {selectedPost.targets.map((target, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] text-white ${
                            target.platform === 'tiktok' ? 'bg-black' : 'bg-blue-600'
                          }`}
                        >
                          {target.platform === 'tiktok' ? 'TT' : 'FB'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 capitalize">{target.platform}</p>
                          <p className="text-[10px] text-slate-400">
                            {target.platformPostId ? `ID: ${target.platformPostId}` : 'Awaiting publish worker'}
                          </p>
                        </div>
                      </div>
                      {target.platformPostUrl ? (
                        <a
                          href={target.platformPostUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-[11px] text-indigo-600 hover:underline font-semibold"
                        >
                          <span>View Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-slate-400">Queued</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Reschedule Control */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-[11px] font-semibold text-slate-700 block">
                  Reschedule Publishing Time
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="datetime-local"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleApplyReschedule}
                    className="px-3 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-200">
              <button
                onClick={() => {
                  onDeletePost(selectedPost.id);
                  setSelectedPost(null);
                  success('Post removed from calendar');
                }}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Post</span>
              </button>

              {selectedPost.status !== 'published' && (
                <button
                  onClick={handleInstantPublishFromDrawer}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Now</span>
                </button>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
