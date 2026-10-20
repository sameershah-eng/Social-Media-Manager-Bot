import React, { useState } from 'react';
import {
  ContentPost,
  Platform,
  PostCategory,
  PostStatus,
  SinglePlatform,
} from '../../types';
import {
  PenTool,
  Upload,
  Calendar,
  Clock,
  Eye,
  Trash2,
  Copy,
  Search,
  Filter,
  Check,
  AlertCircle,
  Plus,
  Video,
  Image as ImageIcon,
  MoreVertical,
  ArrowUpDown,
  Send,
  Save,
} from 'lucide-react';
import { PostPreviewModal } from '../modals/PostPreviewModal';
import { useToast } from '../common/Toast';

interface ContentStudioViewProps {
  posts: ContentPost[];
  onAddPost: (post: ContentPost) => void;
  onUpdatePost: (post: ContentPost) => void;
  onDeletePost: (id: string) => void;
}

export const ContentStudioView: React.FC<ContentStudioViewProps> = ({
  posts,
  onAddPost,
  onUpdatePost,
  onDeletePost,
}) => {
  const { success, warning, info } = useToast();

  // Composer Form State
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('both');
  const [title, setTitle] = useState('');
  const [defaultCaption, setDefaultCaption] = useState('');
  const [tiktokCaption, setTiktokCaption] = useState('');
  const [facebookCaption, setFacebookCaption] = useState('');
  const [customizePerPlatform, setCustomizePerPlatform] = useState(false);
  const [hashtags, setHashtags] = useState<string[]>(['#socialflow', '#digitalcreator']);
  const [newTagInput, setNewTagInput] = useState('');
  const [category, setCategory] = useState<PostCategory>('Educational');
  const [mediaUrl, setMediaUrl] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80');
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video');
  const [scheduledDate, setScheduledDate] = useState(() => {
    const d = new Date();
    d.setHours(d.getHours() + 2);
    return d.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
  });
  const [timeZone, setTimeZone] = useState('America/Los_Angeles (PST)');

  // Selected Post for Preview
  const [previewPost, setPreviewPost] = useState<ContentPost | null>(null);

  // Queue Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PostStatus>('all');
  const [platformFilter, setPlatformFilter] = useState<'all' | SinglePlatform>('all');
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);

  // Validation
  const tiktokLimit = 2200;
  const fbLimit = 63206;
  const currentTTCaption = customizePerPlatform ? tiktokCaption : defaultCaption;
  const isTTOverLimit = currentTTCaption.length > tiktokLimit;

  // Media sample presets
  const sampleMediaPresets = [
    { label: 'Studio Batching (Video)', url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80', type: 'video' as const },
    { label: 'Agency Growth (Image)', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80', type: 'image' as const },
    { label: 'Product Interface (Image)', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80', type: 'image' as const },
    { label: 'Creator Setup (Video)', url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80', type: 'video' as const },
  ];

  const handleAddTag = () => {
    if (!newTagInput.trim()) return;
    const clean = newTagInput.startsWith('#') ? newTagInput.trim() : `#${newTagInput.trim()}`;
    if (!hashtags.includes(clean)) {
      setHashtags([...hashtags, clean]);
    }
    setNewTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const createPostObject = (status: PostStatus): ContentPost => {
    const targets: SinglePlatform[] =
      selectedPlatform === 'both' ? ['tiktok', 'facebook'] : [selectedPlatform];

    const postTargets = targets.map((p) => ({
      platform: p,
      status: status,
      scheduledFor: new Date(scheduledDate).toISOString(),
      platformPostId: status === 'published' ? `${p}_${Date.now()}` : undefined,
      platformPostUrl:
        status === 'published'
          ? p === 'tiktok'
            ? `https://tiktok.com/@socialflow_studio/video/${Date.now()}`
            : `https://facebook.com/SocialFlowStudioApp/posts/${Date.now()}`
          : undefined,
      publishedAt: status === 'published' ? new Date().toISOString() : undefined,
      reach: status === 'published' ? (p === 'tiktok' ? 2400 : 1600) : undefined,
      impressions: status === 'published' ? (p === 'tiktok' ? 3200 : 2100) : undefined,
    }));

    return {
      id: `post_${Date.now()}`,
      title: title.trim() || 'Untitled Content Piece',
      defaultCaption: defaultCaption.trim(),
      tiktokCaption: customizePerPlatform ? tiktokCaption : undefined,
      facebookCaption: customizePerPlatform ? facebookCaption : undefined,
      hashtags,
      category,
      mediaUrl,
      mediaType,
      status,
      scheduledFor: new Date(scheduledDate).toISOString(),
      publishedAt: status === 'published' ? new Date().toISOString() : undefined,
      targets: postTargets,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };

  const handleSchedulePost = () => {
    if (!title.trim() && !defaultCaption.trim()) {
      warning('Please enter a post title or caption before scheduling.');
      return;
    }
    if ((selectedPlatform === 'tiktok' || selectedPlatform === 'both') && mediaType !== 'video') {
      warning('TikTok publishing requires video format. Adjust media type or target.');
    }
    const newPost = createPostObject('scheduled');
    onAddPost(newPost);
    success('Post Scheduled Successfully', `Queued for ${new Date(scheduledDate).toLocaleString()}`);
    resetComposer();
  };

  const handlePublishNow = () => {
    if (!title.trim() && !defaultCaption.trim()) {
      warning('Please enter a post title or caption before publishing.');
      return;
    }
    const newPost = createPostObject('published');
    onAddPost(newPost);
    success('Post Published Immediately', 'Dispatched to authorized platform endpoints.');
    resetComposer();
  };

  const handleSaveDraft = () => {
    const newPost = createPostObject('draft');
    onAddPost(newPost);
    info('Saved to Drafts', 'Post draft preserved in workspace.');
    resetComposer();
  };

  const resetComposer = () => {
    setTitle('');
    setDefaultCaption('');
    setTiktokCaption('');
    setFacebookCaption('');
    setCustomizePerPlatform(false);
  };

  // Duplicate a post
  const handleDuplicatePost = (p: ContentPost) => {
    const duplicated: ContentPost = {
      ...p,
      id: `post_${Date.now()}`,
      title: `${p.title} (Copy)`,
      status: 'draft',
      scheduledFor: new Date(Date.now() + 86400000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      targets: p.targets.map((t) => ({ ...t, status: 'draft', platformPostId: undefined, platformPostUrl: undefined })),
    };
    onAddPost(duplicated);
    success('Post Duplicated', 'Created draft copy in queue.');
  };

  // Bulk actions
  const handleBulkDelete = () => {
    selectedPostIds.forEach((id) => onDeletePost(id));
    setSelectedPostIds([]);
    success(`Deleted ${selectedPostIds.length} posts`);
  };

  // Filtered queue posts
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.defaultCaption.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesPlatform =
      platformFilter === 'all' || p.targets.some((t) => t.platform === platformFilter);
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
          Content Studio
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Create, customize, and orchestrate automated publishing across TikTok and Facebook.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Post Composer (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <PenTool className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">Compose New Content</h2>
            </div>

            {/* Platform Selector Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setSelectedPlatform('both')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  selectedPlatform === 'both'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Both Platforms
              </button>
              <button
                onClick={() => setSelectedPlatform('tiktok')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  selectedPlatform === 'tiktok'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                TikTok Only
              </button>
              <button
                onClick={() => setSelectedPlatform('facebook')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  selectedPlatform === 'facebook'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Facebook Only
              </button>
            </div>
          </div>

          {/* Internal Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-slate-700">Content Title / Name</label>
              <input
                type="text"
                placeholder="e.g. 5 Growth Hacks for Creative Agencies"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PostCategory)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-white"
              >
                <option value="Educational">Educational</option>
                <option value="Behind the Scenes">Behind the Scenes</option>
                <option value="Product Demo">Product Demo</option>
                <option value="Promotion">Promotion</option>
                <option value="Community">Community</option>
                <option value="Announcement">Announcement</option>
              </select>
            </div>
          </div>

          {/* Caption Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                {customizePerPlatform ? 'Universal Default Caption' : 'Caption'}
              </label>
              <span
                className={`text-[11px] tabular-nums ${
                  isTTOverLimit ? 'text-red-500 font-bold' : 'text-slate-400'
                }`}
              >
                {defaultCaption.length} / {selectedPlatform === 'tiktok' ? tiktokLimit : fbLimit} chars
              </span>
            </div>
            <textarea
              rows={4}
              placeholder="Write your primary message, story, or hook here..."
              value={defaultCaption}
              onChange={(e) => setDefaultCaption(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />

            {/* Custom per-platform switch */}
            {selectedPlatform === 'both' && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setCustomizePerPlatform(!customizePerPlatform)}
                  className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1.5"
                >
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <span>
                    {customizePerPlatform
                      ? 'Collapse platform-specific captions'
                      : 'Customize captions independently for TikTok & Facebook'}
                  </span>
                </button>
              </div>
            )}

            {customizePerPlatform && selectedPlatform === 'both' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-700">TikTok Custom Caption</span>
                  <textarea
                    rows={3}
                    placeholder="Short punchy caption with hook for TikTok (2,200 limit)..."
                    value={tiktokCaption}
                    onChange={(e) => setTiktokCaption(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-700">Facebook Custom Caption</span>
                  <textarea
                    rows={3}
                    placeholder="Long-form storytelling copy with links for Facebook Page..."
                    value={facebookCaption}
                    onChange={(e) => setFacebookCaption(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Hashtags input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">Hashtags</label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 border border-slate-200 rounded-lg min-h-[42px] bg-white">
              {hashtags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs transition-colors"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-400 hover:text-slate-600 text-[10px]"
                  >
                    ×
                  </button>
                </span>
              ))}
              <div className="flex items-center gap-1 flex-1 min-w-[120px]">
                <input
                  type="text"
                  placeholder="Add tag and press Enter..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="text-xs outline-none w-full text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* Media Asset Setup */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">Media Asset</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMediaType('video')}
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                    mediaType === 'video'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video (9:16)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMediaType('image')}
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors ${
                    mediaType === 'image'
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Image / Carousel</span>
                </button>
              </div>
            </div>

            {/* Media URL Input or Presets */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Paste media asset URL or choose preset below..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500 font-mono text-[11px]"
              />
            </div>

            {/* Preset asset quick picks */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[11px] text-slate-400 shrink-0">Studio Presets:</span>
              {sampleMediaPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMediaUrl(preset.url);
                    setMediaType(preset.type);
                  }}
                  className={`text-[11px] px-2 py-1 rounded-md border text-slate-600 shrink-0 hover:bg-slate-50 transition-colors ${
                    mediaUrl === preset.url
                      ? 'border-indigo-500 bg-indigo-50/50 font-semibold text-indigo-900'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scheduling & Timezone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Scheduled Date & Time</label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Publishing Timezone</label>
              <select
                value={timeZone}
                onChange={(e) => setTimeZone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500 bg-white"
              >
                <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                <option value="America/New_York (EST)">America/New_York (EST)</option>
                <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                <option value="Asia/Tokyo (JST)">Asia/Tokyo (JST)</option>
              </select>
            </div>
          </div>

          {/* Validation note */}
          {(selectedPlatform === 'tiktok' || selectedPlatform === 'both') && mediaType !== 'video' && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>TikTok Notice:</strong> TikTok API strictly requires MP4/MOV video files. Photos will be simulated in demo mode but require video conversion before live distribution.
              </span>
            </div>
          )}

          {/* Composer Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                const tempPost = createPostObject('scheduled');
                setPreviewPost(tempPost);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>Preview Mockup</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Save className="w-3.5 h-3.5 text-slate-400" />
                <span>Save Draft</span>
              </button>
              <button
                type="button"
                onClick={handleSchedulePost}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Post</span>
              </button>
              <button
                type="button"
                onClick={handlePublishNow}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish Now</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Queue & Content Management (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Publishing Queue</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {posts.length} total posts · {posts.filter(p => p.status === 'scheduled').length} queued
                </p>
              </div>

              {selectedPostIds.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete ({selectedPostIds.length})</span>
                </button>
              )}
            </div>

            {/* Filter and search bar */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Filter posts by title or caption..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-slate-600 bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                  <option value="needs_review">Needs Review</option>
                </select>
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value as any)}
                  className="flex-1 px-2 py-1.5 border border-slate-200 rounded-lg text-slate-600 bg-white"
                >
                  <option value="all">All Platforms</option>
                  <option value="tiktok">TikTok</option>
                  <option value="facebook">Facebook</option>
                </select>
              </div>
            </div>

            {/* Posts List */}
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredPosts.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
                  No posts matched your current search and filters.
                </div>
              ) : (
                filteredPosts.map((post) => {
                  const isSelected = selectedPostIds.includes(post.id);
                  return (
                    <div
                      key={post.id}
                      className="p-3 bg-slate-50/70 border border-slate-200/80 rounded-xl hover:bg-slate-50 transition-colors flex flex-col gap-2 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPostIds([...selectedPostIds, post.id]);
                              } else {
                                setSelectedPostIds(selectedPostIds.filter((id) => id !== post.id));
                              }
                            }}
                            className="mt-1 rounded text-indigo-600"
                          />
                          {post.mediaUrl ? (
                            <img
                              src={post.mediaUrl}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                              <PenTool className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {post.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {post.defaultCaption}
                            </p>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                              <span className="font-medium text-slate-600">{post.category}</span>
                              <span>·</span>
                              <span className="capitalize">{post.targets.map((t) => t.platform).join(', ')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                            post.status === 'published'
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                              : post.status === 'scheduled'
                              ? 'text-indigo-700 bg-indigo-50 border border-indigo-200'
                              : post.status === 'needs_review'
                              ? 'text-amber-700 bg-amber-50 border border-amber-200'
                              : 'text-slate-600 bg-slate-100'
                          }`}
                        >
                          {post.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Footer actions on card */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-400">
                        <div className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(post.scheduledFor).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setPreviewPost(post)}
                            title="Preview post"
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDuplicatePost(post)}
                            title="Duplicate post"
                            className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              onDeletePost(post.id);
                              success('Post deleted');
                            }}
                            title="Delete post"
                            className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Post Preview Modal */}
      <PostPreviewModal
        isOpen={previewPost !== null}
        onClose={() => setPreviewPost(null)}
        post={previewPost}
      />
    </div>
  );
};
