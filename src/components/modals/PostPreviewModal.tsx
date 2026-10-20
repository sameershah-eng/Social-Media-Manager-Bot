import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ContentPost } from '../../types';
import { Heart, MessageCircle, Share2, Bookmark, Music, MoreHorizontal, ThumbsUp, Send } from 'lucide-react';

interface PostPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: ContentPost | null;
}

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({ isOpen, onClose, post }) => {
  const [activeTab, setActiveTab] = useState<'tiktok' | 'facebook'>('tiktok');

  if (!post) return null;

  const tiktokCaption = post.tiktokCaption || post.defaultCaption;
  const facebookCaption = post.facebookCaption || post.defaultCaption;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Platform Preview"
      subtitle={`Previewing "${post.title}" before distribution`}
      maxWidth="3xl"
    >
      <div className="flex flex-col gap-5">
        {/* Platform switcher tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('tiktok')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'tiktok'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            TikTok Preview
          </button>
          <button
            onClick={() => setActiveTab('facebook')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'facebook'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Facebook Page Preview
          </button>
        </div>

        {/* Preview viewport */}
        <div className="flex justify-center p-4 bg-slate-50 border border-slate-200/80 rounded-xl min-h-[460px]">
          {activeTab === 'tiktok' ? (
            /* TikTok 9:16 mobile mock */
            <div className="w-[300px] h-[520px] bg-black rounded-3xl overflow-hidden relative shadow-2xl flex flex-col justify-between text-white border-4 border-slate-800">
              {/* Media background */}
              {post.mediaUrl ? (
                <img
                  src={post.mediaUrl}
                  alt={post.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-85"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 to-slate-900 flex items-center justify-center p-4 text-center text-xs text-slate-400">
                  No video asset attached
                </div>
              )}

              {/* Gradient Scrim for readable text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30 pointer-events-none" />

              {/* Top bar */}
              <div className="relative z-10 flex items-center justify-between p-4 text-xs font-semibold">
                <span className="text-white/70">Following</span>
                <span className="text-white border-b-2 border-white pb-0.5">For You</span>
                <MoreHorizontal className="w-4 h-4 text-white" />
              </div>

              {/* Right interaction column */}
              <div className="relative z-10 flex flex-col items-center gap-4 self-end pr-3 pb-6">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-slate-800">
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80"
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                    <Heart className="w-6 h-6 fill-rose-500 text-rose-500" />
                  </div>
                  <span className="text-[10px] mt-0.5">14.2K</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] mt-0.5">186</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                    <Bookmark className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] mt-0.5">840</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
                    <Share2 className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] mt-0.5">312</span>
                </div>
              </div>

              {/* Bottom text info */}
              <div className="relative z-10 p-4 pb-5 flex flex-col gap-1.5">
                <p className="text-xs font-bold text-white">@socialflow_studio</p>
                <p className="text-xs text-white/95 line-clamp-3 leading-snug">
                  {tiktokCaption} {post.hashtags.join(' ')}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-white/80 mt-1">
                  <Music className="w-3.5 h-3.5 animate-spin duration-3000" />
                  <span className="truncate">Original Sound - SocialFlow Studio Audio</span>
                </div>
              </div>
            </div>
          ) : (
            /* Facebook Feed Post Card */
            <div className="w-full max-w-md bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden self-center">
              {/* Header */}
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=80&auto=format&fit=crop&q=80"
                    alt="Facebook page"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">
                        SocialFlow Studio Official
                      </span>
                      <span className="w-3.5 h-3.5 bg-blue-600 rounded-full text-white text-[9px] flex items-center justify-center font-bold">
                        ✓
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">Published · 1h ago · 🌐</span>
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-400" />
              </div>

              {/* Caption */}
              <div className="px-4 pb-3">
                <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                  {facebookCaption}
                </p>
                {post.hashtags.length > 0 && (
                  <p className="text-xs text-indigo-600 mt-1.5 font-medium">
                    {post.hashtags.join(' ')}
                  </p>
                )}
              </div>

              {/* Media image */}
              {post.mediaUrl ? (
                <div className="w-full h-64 bg-slate-100 overflow-hidden">
                  <img
                    src={post.mediaUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}

              {/* Engagement counts */}
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[9px]">
                    👍
                  </span>
                  <span>412</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>31 comments</span>
                  <span>64 shares</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-2 py-1 flex items-center justify-around text-xs font-semibold text-slate-600">
                <button className="flex items-center gap-1.5 py-2 px-4 hover:bg-slate-50 rounded-lg transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span>Like</span>
                </button>
                <button className="flex items-center gap-1.5 py-2 px-4 hover:bg-slate-50 rounded-lg transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>Comment</span>
                </button>
                <button className="flex items-center gap-1.5 py-2 px-4 hover:bg-slate-50 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
