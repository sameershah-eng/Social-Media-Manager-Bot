export type Platform = 'tiktok' | 'facebook' | 'both';
export type SinglePlatform = 'tiktok' | 'facebook';

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed' | 'needs_review';

export type PostCategory =
  | 'Product Demo'
  | 'Behind the Scenes'
  | 'Educational'
  | 'Promotion'
  | 'Community'
  | 'Announcement';

export interface PostTarget {
  platform: SinglePlatform;
  status: PostStatus;
  platformPostId?: string;
  platformPostUrl?: string;
  scheduledFor: string;
  publishedAt?: string;
  errorMessage?: string;
  reach?: number;
  impressions?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  videoViews?: number;
}

export interface ContentPost {
  id: string;
  title: string;
  defaultCaption: string;
  hashtags: string[];
  category: PostCategory;
  mediaUrl: string;
  mediaType: 'video' | 'image';
  tiktokCaption?: string;
  facebookCaption?: string;
  status: PostStatus;
  scheduledFor: string; // ISO date-time string
  publishedAt?: string;
  targets: PostTarget[];
  createdAt: string;
  updatedAt: string;
}

export interface ConnectedAccount {
  id: string;
  platform: SinglePlatform;
  accountName: string;
  username: string;
  avatarUrl: string;
  isConnected: boolean;
  isDemo: boolean;
  lastSyncAt: string;
  lastPublishAt?: string;
  permissions: string[];
  tokenExpiresAt?: string;
  accountType?: string;
  followersCount: number;
}

export type ConversationType = 'comment' | 'dm';
export type ConversationStatus = 'unread' | 'needs_review' | 'replied' | 'resolved' | 'archived';
export type HandlingMode = 'auto_replied' | 'human_review' | 'pending';
export type Priority = 'normal' | 'high' | 'urgent';

export interface EngagementMessage {
  id: string;
  conversationId: string;
  sender: {
    name: string;
    username: string;
    avatarUrl: string;
    isSelf: boolean;
  };
  text: string;
  timestamp: string;
  platform: SinglePlatform;
  matchedRuleId?: string;
  isAiSuggested?: boolean;
}

export interface Conversation {
  id: string;
  platform: SinglePlatform;
  type: ConversationType;
  postTitle?: string;
  postUrl?: string;
  senderName: string;
  senderUsername: string;
  senderAvatar: string;
  lastMessage: string;
  lastTimestamp: string;
  status: ConversationStatus;
  handlingMode: HandlingMode;
  priority: Priority;
  tags: string[];
  internalNotes?: string;
  messages: EngagementMessage[];
}

export interface ReplyRule {
  id: string;
  name: string;
  keywords: string[];
  matchType: 'exact' | 'case_insensitive' | 'phrase';
  action: 'auto_reply' | 'flag_review' | 'suggest_ai';
  templateId?: string;
  responseText?: string;
  enabled: boolean;
  priority: number;
  appliesTo: 'all' | 'tiktok' | 'facebook';
}

export interface ReplyTemplate {
  id: string;
  name: string;
  body: string;
  keywords: string[];
  platform: 'all' | 'tiktok' | 'facebook';
  mode: 'auto' | 'approval_required';
  enabled: boolean;
  updatedAt: string;
}

export interface AnalyticsSnapshot {
  date: string;
  platform: 'tiktok' | 'facebook' | 'all';
  reach: number;
  impressions: number;
  followers: number;
  followerGrowth: number;
  likes: number;
  comments: number;
  shares: number;
  videoViews: number;
  engagementRate: number;
}

export interface AutomationSettings {
  dailyPublishingEnabled: boolean;
  tiktokSchedule: Record<string, string[]>; // e.g. "Monday": ["10:00", "15:00", "19:00"]
  facebookSchedule: Record<string, string[]>;
  timeZone: string;
  queueBehavior: 'strict' | 'asap' | 'requeue';
  retryLimit: number;
  retryBackoffMinutes: number;
  pollingFrequencyMinutes: number;
  autoReplyPolicy: 'suggestions_only' | 'auto_approved' | 'human_approval_all';
  analyticsSyncHours: number;
  exportSchedule: 'off' | 'daily' | 'weekly';
  failureNotifications: boolean;
  safeKeywordsProtection: boolean;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  platform: SinglePlatform | 'system' | 'google_sheets';
  action: string;
  status: 'success' | 'failed' | 'warning' | 'pending';
  details: string;
  metadata?: Record<string, unknown>;
  retryable?: boolean;
}

export interface Workspace {
  id: string;
  name: string;
  industry: string;
  timeZone: string;
  email: string;
  role: string;
  createdDate: string;
}
