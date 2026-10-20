import {
  ConnectedAccount,
  ContentPost,
  Conversation,
  ReplyRule,
  ReplyTemplate,
  AnalyticsSnapshot,
  AutomationSettings,
  ActivityLog,
  Workspace,
} from '../types';

export const initialWorkspace: Workspace = {
  id: 'ws_default_01',
  name: 'SocialFlow Media Labs',
  industry: 'Digital Marketing & Content Agency',
  timeZone: 'America/Los_Angeles (PST)',
  email: 'sameerupwork25@gmail.com',
  role: 'Workspace Administrator',
  createdDate: '2026-01-15',
};

export const initialAccounts: ConnectedAccount[] = [
  {
    id: 'acc_tiktok_01',
    platform: 'tiktok',
    accountName: 'SocialFlow Studio',
    username: '@socialflow_studio',
    avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    isConnected: true,
    isDemo: true,
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
    lastPublishAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    accountType: 'TikTok Business & Creator Account',
    followersCount: 48250,
    permissions: [
      'user.info.basic',
      'user.info.stats',
      'video.upload',
      'video.publish',
      'comment.list',
      'comment.reply',
    ],
  },
  {
    id: 'acc_facebook_01',
    platform: 'facebook',
    accountName: 'SocialFlow Studio Official',
    username: 'SocialFlowStudioApp',
    avatarUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=120&auto=format&fit=crop&q=80',
    isConnected: true,
    isDemo: true,
    lastSyncAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    lastPublishAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    accountType: 'Meta Verified Business Page',
    followersCount: 32680,
    permissions: [
      'pages_show_list',
      'pages_read_engagement',
      'pages_manage_posts',
      'pages_messaging',
      'read_insights',
    ],
  },
];

const now = new Date();
const formatIso = (hoursOffset: number) => {
  return new Date(now.getTime() + hoursOffset * 3600 * 1000).toISOString();
};

export const initialPosts: ContentPost[] = [
  {
    id: 'post_01',
    title: '5 Automation Hacks Every Social Manager Needs',
    defaultCaption: 'Stop manually reposting between platforms! Here is how our team saves 12+ hours every week using smart content batching. Which step are you trying first?',
    hashtags: ['#socialmediamanager', '#creatorworkflow', '#marketingautomation', '#growthtips'],
    category: 'Educational',
    mediaUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=80',
    mediaType: 'video',
    tiktokCaption: '5 automation hacks that saved us 12 hrs this week! Which one do you need? 👇 #socialmediamanager #creatortips #fyp',
    facebookCaption: 'Stop manually scheduling across platforms. Learn how modern marketing teams orchestrate multi-channel distribution from a single hub.',
    status: 'published',
    scheduledFor: formatIso(-24),
    publishedAt: formatIso(-24),
    createdAt: formatIso(-72),
    updatedAt: formatIso(-24),
    targets: [
      {
        platform: 'tiktok',
        status: 'published',
        platformPostId: 'tt_738491029481920',
        platformPostUrl: 'https://tiktok.com/@socialflow_studio/video/738491029481920',
        scheduledFor: formatIso(-24),
        publishedAt: formatIso(-24),
        reach: 18450,
        impressions: 24800,
        likes: 1420,
        comments: 86,
        shares: 312,
        videoViews: 22100,
      },
      {
        platform: 'facebook',
        status: 'published',
        platformPostId: 'fb_10293847561829',
        platformPostUrl: 'https://facebook.com/SocialFlowStudioApp/posts/10293847561829',
        scheduledFor: formatIso(-24),
        publishedAt: formatIso(-24),
        reach: 12200,
        impressions: 16900,
        likes: 640,
        comments: 42,
        shares: 98,
        videoViews: 9800,
      },
    ],
  },
  {
    id: 'post_02',
    title: 'New Feature Announcement: Unified Engagement Inbox',
    defaultCaption: 'Direct messages and comments from TikTok and Facebook, now together in real time. Configure AI assisted templates and never leave a follower hanging.',
    hashtags: ['#productupdate', '#saas', '#socialmediatips', '#crm'],
    category: 'Product Demo',
    mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    status: 'published',
    scheduledFor: formatIso(-6),
    publishedAt: formatIso(-6),
    createdAt: formatIso(-30),
    updatedAt: formatIso(-6),
    targets: [
      {
        platform: 'facebook',
        status: 'published',
        platformPostId: 'fb_88291039481726',
        platformPostUrl: 'https://facebook.com/SocialFlowStudioApp/posts/88291039481726',
        scheduledFor: formatIso(-6),
        publishedAt: formatIso(-6),
        reach: 9400,
        impressions: 13100,
        likes: 412,
        comments: 31,
        shares: 64,
      },
    ],
  },
  {
    id: 'post_03',
    title: 'Behind the Scenes: How We Shoot 20 TikToks in 2 Hours',
    defaultCaption: 'Our batching framework revealed! Scripting, lighting setup, and editing templates breakdown. Save this post for your next shoot day.',
    hashtags: ['#behindthescenes', '#contentcreator', '#studioday', '#videoediting'],
    category: 'Behind the Scenes',
    mediaUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80',
    mediaType: 'video',
    status: 'scheduled',
    scheduledFor: formatIso(4),
    createdAt: formatIso(-12),
    updatedAt: formatIso(-1),
    targets: [
      {
        platform: 'tiktok',
        status: 'scheduled',
        scheduledFor: formatIso(4),
      },
      {
        platform: 'facebook',
        status: 'scheduled',
        scheduledFor: formatIso(4),
      },
    ],
  },
  {
    id: 'post_04',
    title: 'Weekend Community Q&A: Ask Us Anything',
    defaultCaption: 'Drop your toughest social growth questions below. Our lead strategist will be answering live in the comments for the next 2 hours!',
    hashtags: ['#qanda', '#communityfirst', '#marketingadvice', '#askmeanything'],
    category: 'Community',
    mediaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    status: 'scheduled',
    scheduledFor: formatIso(28),
    createdAt: formatIso(-8),
    updatedAt: formatIso(-8),
    targets: [
      {
        platform: 'facebook',
        status: 'scheduled',
        scheduledFor: formatIso(28),
      },
    ],
  },
  {
    id: 'post_05',
    title: 'High-Converting TikTok Hook Formulas [Swipe]',
    defaultCaption: 'The first 2.5 seconds make or break your video. Try these 4 hook frameworks on your next reel or short.',
    hashtags: ['#hooks', '#viralcontent', '#growthstrategy', '#videomarketing'],
    category: 'Educational',
    mediaUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
    mediaType: 'video',
    status: 'scheduled',
    scheduledFor: formatIso(52),
    createdAt: formatIso(-4),
    updatedAt: formatIso(-4),
    targets: [
      {
        platform: 'tiktok',
        status: 'scheduled',
        scheduledFor: formatIso(52),
      },
    ],
  },
  {
    id: 'post_06',
    title: 'Summer Campaign Creative Concepts (Internal Draft)',
    defaultCaption: 'Exploring 3 visual themes for the upcoming Q3 product release. Feedback welcomed from creative team.',
    hashtags: ['#campaign', '#creativeteam'],
    category: 'Promotion',
    mediaUrl: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    status: 'draft',
    scheduledFor: formatIso(96),
    createdAt: formatIso(-10),
    updatedAt: formatIso(-2),
    targets: [
      {
        platform: 'facebook',
        status: 'draft',
        scheduledFor: formatIso(96),
      },
      {
        platform: 'tiktok',
        status: 'draft',
        scheduledFor: formatIso(96),
      },
    ],
  },
  {
    id: 'post_07',
    title: 'Client Spotlight: 400% Reach Surge in 90 Days',
    defaultCaption: 'Case study breakdown: How a DTC apparel brand overhauled their daily posting schedule and quadrupled organic views.',
    hashtags: ['#casestudy', '#clientgrowth', '#roi', '#ecommerce'],
    category: 'Educational',
    mediaUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
    mediaType: 'image',
    status: 'needs_review',
    scheduledFor: formatIso(72),
    createdAt: formatIso(-15),
    updatedAt: formatIso(-1),
    targets: [
      {
        platform: 'facebook',
        status: 'needs_review',
        scheduledFor: formatIso(72),
      },
    ],
  },
];

export const initialConversations: Conversation[] = [
  {
    id: 'conv_01',
    platform: 'tiktok',
    type: 'comment',
    postTitle: '5 Automation Hacks Every Social Manager Needs',
    postUrl: 'https://tiktok.com/@socialflow_studio/video/738491029481920',
    senderName: 'Elena Rostova',
    senderUsername: '@elena_digital',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
    lastMessage: 'What is the pricing for small boutique agencies with 5 clients?',
    lastTimestamp: formatIso(-1),
    status: 'replied',
    handlingMode: 'auto_replied',
    priority: 'normal',
    tags: ['Pricing', 'High Intent'],
    internalNotes: 'Automated pricing template triggered via keyword match "pricing".',
    messages: [
      {
        id: 'msg_01_1',
        conversationId: 'conv_01',
        sender: {
          name: 'Elena Rostova',
          username: '@elena_digital',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80',
          isSelf: false,
        },
        text: 'What is the pricing for small boutique agencies with 5 clients?',
        timestamp: formatIso(-1.1),
        platform: 'tiktok',
      },
      {
        id: 'msg_01_2',
        conversationId: 'conv_01',
        sender: {
          name: 'SocialFlow Studio',
          username: '@socialflow_studio',
          avatarUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80',
          isSelf: true,
        },
        text: 'Thanks for reaching out! Our Agency Starter plan is tailored for teams managing up to 10 brand accounts with full scheduling and inbox automation. Check our plans or DM us for a personalized walkthrough!',
        timestamp: formatIso(-1.05),
        platform: 'tiktok',
        matchedRuleId: 'rule_pricing',
      },
    ],
  },
  {
    id: 'conv_02',
    platform: 'facebook',
    type: 'dm',
    senderName: 'Marcus Vance',
    senderUsername: 'marcus.vance.biz',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
    lastMessage: 'Hi! I noticed a billing discrepancy on my recent invoice and need a refund for the extra seat charge.',
    lastTimestamp: formatIso(-2.5),
    status: 'needs_review',
    handlingMode: 'human_review',
    priority: 'urgent',
    tags: ['Billing', 'Refund', 'Financial Safety Rule'],
    internalNotes: 'Triggered safety keyword "refund". Automatic reply prohibited by rule safety policy. Assigned for urgent human review.',
    messages: [
      {
        id: 'msg_02_1',
        conversationId: 'conv_02',
        sender: {
          name: 'Marcus Vance',
          username: 'marcus.vance.biz',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80',
          isSelf: false,
        },
        text: 'Hi! I noticed a billing discrepancy on my recent invoice and need a refund for the extra seat charge.',
        timestamp: formatIso(-2.5),
        platform: 'facebook',
      },
    ],
  },
  {
    id: 'conv_03',
    platform: 'facebook',
    type: 'comment',
    postTitle: 'New Feature Announcement: Unified Engagement Inbox',
    postUrl: 'https://facebook.com/SocialFlowStudioApp/posts/88291039481726',
    senderName: 'Aria Montgomery',
    senderUsername: 'aria.creatives',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
    lastMessage: 'Does the inbox allow assigning conversation threads to specific team members?',
    lastTimestamp: formatIso(-3),
    status: 'unread',
    handlingMode: 'pending',
    priority: 'normal',
    tags: ['Product Question', 'Collaboration'],
    messages: [
      {
        id: 'msg_03_1',
        conversationId: 'conv_03',
        sender: {
          name: 'Aria Montgomery',
          username: 'aria.creatives',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80',
          isSelf: false,
        },
        text: 'Does the inbox allow assigning conversation threads to specific team members?',
        timestamp: formatIso(-3),
        platform: 'facebook',
      },
    ],
  },
  {
    id: 'conv_04',
    platform: 'tiktok',
    type: 'comment',
    postTitle: '5 Automation Hacks Every Social Manager Needs',
    postUrl: 'https://tiktok.com/@socialflow_studio/video/738491029481920',
    senderName: 'Zenith Brand Studio',
    senderUsername: '@zenithstudio',
    senderAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&auto=format&fit=crop&q=80',
    lastMessage: 'We would love to explore a partnership or co-hosted webinar on multi-channel TikTok tactics!',
    lastTimestamp: formatIso(-5),
    status: 'needs_review',
    handlingMode: 'human_review',
    priority: 'high',
    tags: ['Partnership', 'Collaboration'],
    internalNotes: 'Matched rule "Partnership inquiries". AI suggested response ready for manual approval.',
    messages: [
      {
        id: 'msg_04_1',
        conversationId: 'conv_04',
        sender: {
          name: 'Zenith Brand Studio',
          username: '@zenithstudio',
          avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&auto=format&fit=crop&q=80',
          isSelf: false,
        },
        text: 'We would love to explore a partnership or co-hosted webinar on multi-channel TikTok tactics!',
        timestamp: formatIso(-5),
        platform: 'tiktok',
      },
    ],
  },
  {
    id: 'conv_05',
    platform: 'facebook',
    type: 'dm',
    senderName: 'David Chen',
    senderUsername: 'dchen_marketing',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
    lastMessage: 'What are your support team business hours for live chat?',
    lastTimestamp: formatIso(-8),
    status: 'replied',
    handlingMode: 'auto_replied',
    priority: 'normal',
    tags: ['Business Hours', 'Support'],
    messages: [
      {
        id: 'msg_05_1',
        conversationId: 'conv_05',
        sender: {
          name: 'David Chen',
          username: 'dchen_marketing',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80',
          isSelf: false,
        },
        text: 'What are your support team business hours for live chat?',
        timestamp: formatIso(-8.1),
        platform: 'facebook',
      },
      {
        id: 'msg_05_2',
        conversationId: 'conv_05',
        sender: {
          name: 'SocialFlow Studio',
          username: 'SocialFlowStudioApp',
          avatarUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=80&auto=format&fit=crop&q=80',
          isSelf: true,
        },
        text: 'Thanks for your message! Our team is available Monday through Friday from 8:00 AM to 6:00 PM PST. For urgent matters, leave your account email and we will reply as soon as our shift begins.',
        timestamp: formatIso(-8),
        platform: 'facebook',
        matchedRuleId: 'rule_hours',
      },
    ],
  },
];

export const initialReplyTemplates: ReplyTemplate[] = [
  {
    id: 'tpl_01',
    name: 'General Inquiries',
    body: 'Hi {{first_name}}! Thanks for getting in touch with {{page_name}}. How can we assist you with your social media automation goals today?',
    keywords: ['info', 'general', 'hello', 'hey', 'learn more'],
    platform: 'all',
    mode: 'auto',
    enabled: true,
    updatedAt: '2026-03-10',
  },
  {
    id: 'tpl_02',
    name: 'Product or Service Questions',
    body: 'Great question! SocialFlow Studio enables direct scheduling, unified comment & DM management, and automated publishing for TikTok and Facebook. Would you like a demo video or documentation link?',
    keywords: ['features', 'how does it work', 'support', 'capability', 'services'],
    platform: 'all',
    mode: 'auto',
    enabled: true,
    updatedAt: '2026-03-12',
  },
  {
    id: 'tpl_03',
    name: 'Pricing Inquiries',
    body: 'Thanks for reaching out! Please share which plan you are interested in (Creator, Pro, or Agency), and we will help you with the full tier details and custom onboarding options.',
    keywords: ['pricing', 'price', 'cost', 'rate', 'quote', 'subscription'],
    platform: 'all',
    mode: 'auto',
    enabled: true,
    updatedAt: '2026-03-14',
  },
  {
    id: 'tpl_04',
    name: 'Business Hours',
    body: 'Thanks for your message! Our strategy & support team is active Monday–Friday, 8:00 AM to 6:00 PM PST. Feel free to leave details here and our team will get back to you promptly.',
    keywords: ['hours', 'opening', 'open', 'schedule', 'available', 'timezone'],
    platform: 'all',
    mode: 'auto',
    enabled: true,
    updatedAt: '2026-03-01',
  },
  {
    id: 'tpl_05',
    name: 'Positive Comments & Appreciation',
    body: 'Thank you so much for the love! 🙌 We put a lot of heart into crafting these workflows. Let us know what content you want to see next!',
    keywords: ['awesome', 'love this', 'great post', 'fire', 'super helpful', 'congrats'],
    platform: 'all',
    mode: 'auto',
    enabled: true,
    updatedAt: '2026-02-28',
  },
  {
    id: 'tpl_06',
    name: 'Partnership Inquiries',
    body: 'Thank you for your interest in collaborating with SocialFlow Studio! We love working with creators and agencies. Please share your portfolio or pitch deck at partnerships@socialflow.studio.',
    keywords: ['partnership', 'collaboration', 'collab', 'sponsor', 'affiliate', 'webinar'],
    platform: 'all',
    mode: 'approval_required',
    enabled: true,
    updatedAt: '2026-03-08',
  },
  {
    id: 'tpl_07',
    name: 'Complaints Requiring Human Review',
    body: 'We are sorry to hear you had this experience. Your message has been escalated directly to our senior support manager, who will investigate and reply within 2 business hours.',
    keywords: ['refund', 'complaint', 'issue', 'broken', 'scam', 'cancel', 'terrible', 'failed'],
    platform: 'all',
    mode: 'approval_required',
    enabled: true,
    updatedAt: '2026-03-15',
  },
  {
    id: 'tpl_08',
    name: 'Fallback Responses',
    body: 'Thanks for your message! We have received your inquiry and a team member will follow up shortly. In the meantime, feel free to explore our knowledge base at docs.socialflow.studio.',
    keywords: ['*'],
    platform: 'all',
    mode: 'approval_required',
    enabled: true,
    updatedAt: '2026-01-20',
  },
];

export const initialReplyRules: ReplyRule[] = [
  {
    id: 'rule_pricing',
    name: 'Pricing & Cost Inquiries',
    keywords: ['pricing', 'price', 'cost', 'subscription fee', 'how much'],
    matchType: 'case_insensitive',
    action: 'auto_reply',
    templateId: 'tpl_03',
    responseText: 'Thanks for reaching out! Please share which service you are interested in, and we will help you with the details.',
    enabled: true,
    priority: 1,
    appliesTo: 'all',
  },
  {
    id: 'rule_hours',
    name: 'Business & Support Hours',
    keywords: ['hours', 'opening', 'open', 'business hours', 'operating hours'],
    matchType: 'case_insensitive',
    action: 'auto_reply',
    templateId: 'tpl_04',
    responseText: 'Thanks for your message! Please check our latest business hours (Mon-Fri 8am-6pm PST) or let us know what information you need.',
    enabled: true,
    priority: 2,
    appliesTo: 'all',
  },
  {
    id: 'rule_complaints',
    name: 'Customer Complaints & Refund Flag',
    keywords: ['refund', 'complaint', 'issue', 'dispute', 'charged twice', 'money back'],
    matchType: 'phrase',
    action: 'flag_review',
    templateId: 'tpl_07',
    enabled: true,
    priority: 0, // Highest priority
    appliesTo: 'all',
  },
  {
    id: 'rule_collab',
    name: 'Partnerships & Influencer Collabs',
    keywords: ['partnership', 'collaboration', 'collab', 'sponsor', 'brand deal'],
    matchType: 'case_insensitive',
    action: 'suggest_ai',
    templateId: 'tpl_06',
    enabled: true,
    priority: 3,
    appliesTo: 'all',
  },
  {
    id: 'rule_positive',
    name: 'Appreciation & Cheers',
    keywords: ['love this', 'great job', 'helpful', 'awesome', 'game changer'],
    matchType: 'case_insensitive',
    action: 'auto_reply',
    templateId: 'tpl_05',
    enabled: true,
    priority: 4,
    appliesTo: 'all',
  },
];

// Generate 30 days of realistic analytics snapshots
export const generateAnalyticsSnapshots = (): AnalyticsSnapshot[] => {
  const snapshots: AnalyticsSnapshot[] = [];
  const baseDate = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date(baseDate.getTime() - i * 86400 * 1000);
    const dateStr = d.toISOString().split('T')[0];
    
    // Day of week cycle
    const dayFactor = 1 + Math.sin((i / 7) * Math.PI * 2) * 0.25;
    const randomVariation = 0.85 + Math.random() * 0.3;
    
    const ttReach = Math.round(18000 * dayFactor * randomVariation);
    const fbReach = Math.round(11000 * dayFactor * randomVariation * 0.95);
    
    const ttImpressions = Math.round(ttReach * 1.38);
    const fbImpressions = Math.round(fbReach * 1.32);
    
    const ttFollowers = 46000 + Math.round((30 - i) * 75 + Math.random() * 20);
    const fbFollowers = 31500 + Math.round((30 - i) * 39 + Math.random() * 15);
    
    const ttLikes = Math.round(ttReach * 0.075);
    const fbLikes = Math.round(fbReach * 0.048);
    
    const ttComments = Math.round(ttReach * 0.007);
    const fbComments = Math.round(fbReach * 0.004);
    
    const ttShares = Math.round(ttReach * 0.015);
    const fbShares = Math.round(fbReach * 0.008);
    
    const ttViews = Math.round(ttImpressions * 0.88);
    const fbViews = Math.round(fbImpressions * 0.55);

    // TikTok snapshot
    snapshots.push({
      date: dateStr,
      platform: 'tiktok',
      reach: ttReach,
      impressions: ttImpressions,
      followers: ttFollowers,
      followerGrowth: Math.round(50 + Math.random() * 40),
      likes: ttLikes,
      comments: ttComments,
      shares: ttShares,
      videoViews: ttViews,
      engagementRate: Number(((ttLikes + ttComments + ttShares) / (ttReach || 1) * 100).toFixed(2)),
    });

    // Facebook snapshot
    snapshots.push({
      date: dateStr,
      platform: 'facebook',
      reach: fbReach,
      impressions: fbImpressions,
      followers: fbFollowers,
      followerGrowth: Math.round(25 + Math.random() * 25),
      likes: fbLikes,
      comments: fbComments,
      shares: fbShares,
      videoViews: fbViews,
      engagementRate: Number(((fbLikes + fbComments + fbShares) / (fbReach || 1) * 100).toFixed(2)),
    });
  }

  return snapshots;
};

export const initialAutomationSettings: AutomationSettings = {
  dailyPublishingEnabled: true,
  tiktokSchedule: {
    Monday: ['11:00', '16:30', '20:00'],
    Tuesday: ['11:00', '16:30', '20:00'],
    Wednesday: ['11:00', '16:30', '20:00'],
    Thursday: ['11:00', '16:30', '20:00'],
    Friday: ['10:30', '15:00', '19:30'],
    Saturday: ['12:00', '17:00'],
    Sunday: ['12:00', '18:00', '21:00'],
  },
  facebookSchedule: {
    Monday: ['09:30', '14:00', '18:30'],
    Tuesday: ['09:30', '14:00', '18:30'],
    Wednesday: ['09:30', '14:00', '18:30'],
    Thursday: ['09:30', '14:00', '18:30'],
    Friday: ['09:30', '13:30', '17:00'],
    Saturday: ['10:00', '16:00'],
    Sunday: ['11:00', '17:30'],
  },
  timeZone: 'America/Los_Angeles (PST)',
  queueBehavior: 'strict',
  retryLimit: 3,
  retryBackoffMinutes: 15,
  pollingFrequencyMinutes: 15,
  autoReplyPolicy: 'auto_approved',
  analyticsSyncHours: 4,
  exportSchedule: 'daily',
  failureNotifications: true,
  safeKeywordsProtection: true,
};

export const initialActivityLogs: ActivityLog[] = [
  {
    id: 'log_01',
    timestamp: formatIso(-0.25),
    platform: 'tiktok',
    action: 'Engagement Sync Complete',
    status: 'success',
    details: 'Polled TikTok Comments API: 14 new comments captured, 1 automated response dispatched.',
    metadata: { commentsCount: 14, autoReplied: 1 },
    retryable: false,
  },
  {
    id: 'log_02',
    timestamp: formatIso(-1.05),
    platform: 'tiktok',
    action: 'Automated Comment Reply Dispatched',
    status: 'success',
    details: 'Auto-responded to user @elena_digital matching rule "Pricing & Cost Inquiries".',
    metadata: { ruleId: 'rule_pricing', targetPost: 'tt_738491029481920' },
    retryable: false,
  },
  {
    id: 'log_03',
    timestamp: formatIso(-2.5),
    platform: 'facebook',
    action: 'Direct Message Flagged for Human Review',
    status: 'warning',
    details: 'Message from marcus.vance.biz flagged due to safe keyword "refund". Automatic reply prevented.',
    metadata: { ruleId: 'rule_complaints', priority: 'urgent' },
    retryable: false,
  },
  {
    id: 'log_04',
    timestamp: formatIso(-6),
    platform: 'facebook',
    action: 'Post Published Successfully',
    status: 'success',
    details: 'Published "New Feature Announcement: Unified Engagement Inbox" to Meta Graph API.',
    metadata: { postId: 'fb_88291039481726', pageId: 'SocialFlowStudioApp' },
    retryable: false,
  },
  {
    id: 'log_05',
    timestamp: formatIso(-12),
    platform: 'google_sheets',
    action: 'Analytics Report Exported',
    status: 'success',
    details: 'Appended 24-hour metric snapshot to spreadsheet "SocialFlow Performance 2026".',
    metadata: { rowsAdded: 48, spreadsheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms' },
    retryable: false,
  },
  {
    id: 'log_06',
    timestamp: formatIso(-24),
    platform: 'tiktok',
    action: 'Video Published Successfully',
    status: 'success',
    details: 'Dispatched "5 Automation Hacks Every Social Manager Needs" via TikTok Content Posting API.',
    metadata: { postId: 'tt_738491029481920', durationSec: 42 },
    retryable: false,
  },
  {
    id: 'log_07',
    timestamp: formatIso(-36),
    platform: 'facebook',
    action: 'Media Upload Resiliency Check',
    status: 'success',
    details: 'Verified video asset checksums and aspect ratio compatibility across feed targets.',
    retryable: false,
  },
  {
    id: 'log_08',
    timestamp: formatIso(-48),
    platform: 'tiktok',
    action: 'Video Publish Retry',
    status: 'failed',
    details: 'Temporary network timeout contacting TikTok Creator upload endpoint. Requeued for retry #1.',
    metadata: { errorCode: 'TT_UPLOAD_TIMEOUT_504', retryCount: 1 },
    retryable: true,
  },
];
