import {
  ActivityLog,
  AnalyticsSnapshot,
  AutomationSettings,
  ConnectedAccount,
  ContentPost,
  Conversation,
  ReplyRule,
  ReplyTemplate,
  Workspace,
} from '../types';
import {
  generateAnalyticsSnapshots,
  initialAccounts,
  initialActivityLogs,
  initialAutomationSettings,
  initialConversations,
  initialPosts,
  initialReplyRules,
  initialReplyTemplates,
  initialWorkspace,
} from '../data/mockData';

const STORAGE_KEYS = {
  WORKSPACE: 'sfs_workspace',
  ACCOUNTS: 'sfs_accounts',
  POSTS: 'sfs_posts',
  CONVERSATIONS: 'sfs_conversations',
  RULES: 'sfs_rules',
  TEMPLATES: 'sfs_templates',
  ANALYTICS: 'sfs_analytics',
  SETTINGS: 'sfs_settings',
  LOGS: 'sfs_logs',
  IS_INITIALIZED: 'sfs_initialized_v2',
};

export const storageService = {
  init() {
    if (!localStorage.getItem(STORAGE_KEYS.IS_INITIALIZED)) {
      this.resetAll();
      localStorage.setItem(STORAGE_KEYS.IS_INITIALIZED, 'true');
    }
  },

  resetAll() {
    localStorage.setItem(STORAGE_KEYS.WORKSPACE, JSON.stringify(initialWorkspace));
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(initialAccounts));
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(initialPosts));
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(initialConversations));
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(initialReplyRules));
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(initialReplyTemplates));
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(generateAnalyticsSnapshots()));
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(initialAutomationSettings));
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(initialActivityLogs));
  },

  // Workspace
  getWorkspace(): Workspace {
    const data = localStorage.getItem(STORAGE_KEYS.WORKSPACE);
    return data ? JSON.parse(data) : initialWorkspace;
  },
  saveWorkspace(ws: Workspace) {
    localStorage.setItem(STORAGE_KEYS.WORKSPACE, JSON.stringify(ws));
  },

  // Accounts
  getAccounts(): ConnectedAccount[] {
    const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    return data ? JSON.parse(data) : initialAccounts;
  },
  saveAccounts(accounts: ConnectedAccount[]) {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
  },
  toggleAccountConnection(id: string, isConnected: boolean) {
    const accounts = this.getAccounts().map((acc) =>
      acc.id === id ? { ...acc, isConnected, lastSyncAt: new Date().toISOString() } : acc
    );
    this.saveAccounts(accounts);
    return accounts;
  },

  // Posts
  getPosts(): ContentPost[] {
    const data = localStorage.getItem(STORAGE_KEYS.POSTS);
    return data ? JSON.parse(data) : initialPosts;
  },
  savePosts(posts: ContentPost[]) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  },
  addPost(post: ContentPost): ContentPost[] {
    const posts = [post, ...this.getPosts()];
    this.savePosts(posts);
    this.addLog({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      platform: post.targets.length > 1 ? 'system' : post.targets[0].platform,
      action: post.status === 'published' ? 'Post Published' : 'Post Scheduled',
      status: 'success',
      details: `${post.status === 'published' ? 'Published' : 'Scheduled'} "${post.title}" across ${post.targets.map(t => t.platform).join(', ')}.`,
      retryable: false,
    });
    return posts;
  },
  updatePost(post: ContentPost): ContentPost[] {
    const posts = this.getPosts().map((p) => (p.id === post.id ? post : p));
    this.savePosts(posts);
    return posts;
  },
  deletePost(id: string): ContentPost[] {
    const posts = this.getPosts().filter((p) => p.id !== id);
    this.savePosts(posts);
    return posts;
  },

  // Conversations
  getConversations(): Conversation[] {
    const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    return data ? JSON.parse(data) : initialConversations;
  },
  saveConversations(convs: Conversation[]) {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convs));
  },
  updateConversation(conv: Conversation): Conversation[] {
    const convs = this.getConversations().map((c) => (c.id === conv.id ? conv : c));
    this.saveConversations(convs);
    return convs;
  },
  addIncomingMessage(convId: string, text: string) {
    const convs = this.getConversations();
    const updated = convs.map((c) => {
      if (c.id === convId) {
        const newMsg = {
          id: `msg_${Date.now()}`,
          conversationId: convId,
          sender: {
            name: c.senderName,
            username: c.senderUsername,
            avatarUrl: c.senderAvatar,
            isSelf: false,
          },
          text,
          timestamp: new Date().toISOString(),
          platform: c.platform,
        };
        return {
          ...c,
          status: 'unread' as const,
          lastMessage: text,
          lastTimestamp: new Date().toISOString(),
          messages: [...c.messages, newMsg],
        };
      }
      return c;
    });
    this.saveConversations(updated);
    return updated;
  },

  // Templates
  getTemplates(): ReplyTemplate[] {
    const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
    return data ? JSON.parse(data) : initialReplyTemplates;
  },
  saveTemplates(templates: ReplyTemplate[]) {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
  },

  // Rules
  getRules(): ReplyRule[] {
    const data = localStorage.getItem(STORAGE_KEYS.RULES);
    return data ? JSON.parse(data) : initialReplyRules;
  },
  saveRules(rules: ReplyRule[]) {
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rules));
  },

  // Analytics
  getAnalytics(): AnalyticsSnapshot[] {
    const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    return data ? JSON.parse(data) : generateAnalyticsSnapshots();
  },
  saveAnalytics(snaps: AnalyticsSnapshot[]) {
    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(snaps));
  },

  // Settings
  getSettings(): AutomationSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : initialAutomationSettings;
  },
  saveSettings(settings: AutomationSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Logs
  getLogs(): ActivityLog[] {
    const data = localStorage.getItem(STORAGE_KEYS.LOGS);
    return data ? JSON.parse(data) : initialActivityLogs;
  },
  saveLogs(logs: ActivityLog[]) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },
  addLog(log: ActivityLog): ActivityLog[] {
    const logs = [log, ...this.getLogs()].slice(0, 100);
    this.saveLogs(logs);
    return logs;
  },
};
