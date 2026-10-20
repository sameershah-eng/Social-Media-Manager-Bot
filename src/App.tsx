import React, { useState, useEffect } from 'react';
import { NavItemKey, Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { CommandPalette } from './components/layout/CommandPalette';
import { ToastProvider, useToast } from './components/common/Toast';
import { storageService } from './services/storageService';
import { schedulerEngine } from './services/schedulerEngine';
import { analyticsExportService } from './services/analyticsExportService';

import { OverviewView } from './components/views/OverviewView';
import { ContentStudioView } from './components/views/ContentStudioView';
import { PublishingCalendarView } from './components/views/PublishingCalendarView';
import { EngagementInboxView } from './components/views/EngagementInboxView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { AutomationRulesView } from './components/views/AutomationRulesView';
import { ResponseTemplatesView } from './components/views/ResponseTemplatesView';
import { ConnectedAccountsView } from './components/views/ConnectedAccountsView';
import { ActivityLogsView } from './components/views/ActivityLogsView';
import { SettingsView } from './components/views/SettingsView';

import { OnboardingModal } from './components/modals/OnboardingModal';
import { ReadinessCheckModal } from './components/modals/ReadinessCheckModal';

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
} from './types';

function MainApp() {
  const { success, info } = useToast();

  // App Navigation & UI State
  const [currentView, setCurrentView] = useState<NavItemKey>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [readinessOpen, setReadinessOpen] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  // Persistent Domain State
  const [workspace, setWorkspace] = useState<Workspace>(() => storageService.getWorkspace());
  const [accounts, setAccounts] = useState<ConnectedAccount[]>(() => storageService.getAccounts());
  const [posts, setPosts] = useState<ContentPost[]>(() => storageService.getPosts());
  const [conversations, setConversations] = useState<Conversation[]>(() => storageService.getConversations());
  const [rules, setRules] = useState<ReplyRule[]>(() => storageService.getRules());
  const [templates, setTemplates] = useState<ReplyTemplate[]>(() => storageService.getTemplates());
  const [analytics, setAnalytics] = useState<AnalyticsSnapshot[]>(() => storageService.getAnalytics());
  const [settings, setSettings] = useState<AutomationSettings>(() => storageService.getSettings());
  const [logs, setLogs] = useState<ActivityLog[]>(() => storageService.getLogs());

  // Initialize storage & start background scheduler daemon
  useEffect(() => {
    storageService.init();

    // Start background queue processing daemon
    schedulerEngine.start((updatedCount) => {
      setPosts(storageService.getPosts());
      setLogs(storageService.getLogs());
      success('Queue Worker Auto-Published Post', `${updatedCount} post reached scheduled delivery time.`);
    });

    return () => {
      schedulerEngine.stop();
    };
  }, [success]);

  // Handle manual queue simulation trigger
  const handleSimulatePublish = () => {
    const res = schedulerEngine.forcePublishNext();
    if (res.success) {
      setPosts(storageService.getPosts());
      setLogs(storageService.getLogs());
      success('Publishing Worker Cycle Complete', `Published "${res.postTitle}" across connected channels.`);
    } else {
      info('Queue Empty', 'No scheduled posts pending in queue. Add one in Content Studio to test!');
    }
  };

  // State update handlers
  const handleAddPost = (newPost: ContentPost) => {
    const updated = storageService.addPost(newPost);
    setPosts(updated);
    setLogs(storageService.getLogs());
  };

  const handleUpdatePost = (post: ContentPost) => {
    const updated = storageService.updatePost(post);
    setPosts(updated);
  };

  const handleDeletePost = (id: string) => {
    const updated = storageService.deletePost(id);
    setPosts(updated);
  };

  const handleUpdateConversation = (conv: Conversation) => {
    const updated = storageService.updateConversation(conv);
    setConversations(updated);
  };

  const handleAddIncomingMessage = (convId: string, text: string) => {
    const updated = storageService.addIncomingMessage(convId, text);
    setConversations(updated);
  };

  const handleToggleAccountConnection = (id: string, isConnected: boolean) => {
    const updated = storageService.toggleAccountConnection(id, isConnected);
    setAccounts(updated);
  };

  const handleSaveTemplates = (tpls: ReplyTemplate[]) => {
    storageService.saveTemplates(tpls);
    setTemplates(tpls);
  };

  const handleSaveSettings = (st: AutomationSettings) => {
    storageService.saveSettings(st);
    setSettings(st);
  };

  const handleSaveWorkspace = (ws: Workspace) => {
    storageService.saveWorkspace(ws);
    setWorkspace(ws);
  };

  const handleAddLog = (log: ActivityLog) => {
    const updated = storageService.addLog(log);
    setLogs(updated);
  };

  const handleClearLogs = () => {
    storageService.saveLogs([]);
    setLogs([]);
  };

  const handleResetAllData = () => {
    storageService.resetAll();
    setWorkspace(storageService.getWorkspace());
    setAccounts(storageService.getAccounts());
    setPosts(storageService.getPosts());
    setConversations(storageService.getConversations());
    setRules(storageService.getRules());
    setTemplates(storageService.getTemplates());
    setAnalytics(storageService.getAnalytics());
    setSettings(storageService.getSettings());
    setLogs(storageService.getLogs());
  };

  const handleExportCsv = () => {
    analyticsExportService.downloadCsv(posts, analytics);
    success('CSV Export Downloaded', 'Downloaded complete 15-column analytics dataset.');
  };

  const pendingInboxCount = conversations.filter(
    (c) => c.status === 'unread' || c.status === 'needs_review'
  ).length;

  const scheduledCount = posts.filter((p) => p.status === 'scheduled').length;

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#172033] antialiased selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        pendingInboxCount={pendingInboxCount}
        scheduledCount={scheduledCount}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Bar */}
        <TopBar
          workspace={workspace}
          onSwitchWorkspace={(wsName) => {
            const updated = { ...workspace, name: wsName };
            handleSaveWorkspace(updated);
            info('Switched Workspace', `Active profile: ${wsName}`);
          }}
          accounts={accounts}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenReadiness={() => setReadinessOpen(true)}
          onOpenOnboarding={() => setOnboardingOpen(true)}
          onSimulatePublish={handleSimulatePublish}
        />

        {/* View Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {currentView === 'overview' && (
            <OverviewView
              posts={posts}
              conversations={conversations}
              accounts={accounts}
              analytics={analytics}
              logs={logs}
              onNavigate={(v) => setCurrentView(v)}
              onOpenCreatePost={() => setCurrentView('content-studio')}
              onSimulatePublish={handleSimulatePublish}
            />
          )}

          {currentView === 'content-studio' && (
            <ContentStudioView
              posts={posts}
              onAddPost={handleAddPost}
              onUpdatePost={handleUpdatePost}
              onDeletePost={handleDeletePost}
            />
          )}

          {currentView === 'calendar' && (
            <PublishingCalendarView
              posts={posts}
              onAddPost={handleAddPost}
              onUpdatePost={handleUpdatePost}
              onDeletePost={handleDeletePost}
            />
          )}

          {currentView === 'inbox' && (
            <EngagementInboxView
              conversations={conversations}
              rules={rules}
              templates={templates}
              onUpdateConversation={handleUpdateConversation}
              onAddIncomingMessage={handleAddIncomingMessage}
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsView posts={posts} analytics={analytics} />
          )}

          {currentView === 'automation' && (
            <AutomationRulesView
              settings={settings}
              rules={rules}
              onSaveSettings={handleSaveSettings}
              onUpdateRule={(rule) => {
                const updated = rules.map((r) => (r.id === rule.id ? rule : r));
                storageService.saveRules(updated);
                setRules(updated);
              }}
              onSimulateSchedulerRun={handleSimulatePublish}
            />
          )}

          {currentView === 'templates' && (
            <ResponseTemplatesView
              templates={templates}
              onSaveTemplates={handleSaveTemplates}
            />
          )}

          {currentView === 'accounts' && (
            <ConnectedAccountsView
              accounts={accounts}
              onToggleConnection={handleToggleAccountConnection}
            />
          )}

          {currentView === 'activity-logs' && (
            <ActivityLogsView
              logs={logs}
              onAddLog={handleAddLog}
              onClearLogs={handleClearLogs}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              workspace={workspace}
              onSaveWorkspace={handleSaveWorkspace}
              onResetAllData={handleResetAllData}
              onOpenOnboarding={() => setOnboardingOpen(true)}
              onOpenReadiness={() => setReadinessOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Global Quick Action Palette (⌘K) */}
      <CommandPalette
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={(v) => setCurrentView(v)}
        onNewPost={() => setCurrentView('content-studio')}
        onRunReadiness={() => setReadinessOpen(true)}
        onExportCsv={handleExportCsv}
      />

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onComplete={() => success('Onboarding Complete', 'Your workspace is primed and ready.')}
        onOpenReadiness={() => setReadinessOpen(true)}
      />

      {/* Handover Readiness Check Modal */}
      <ReadinessCheckModal
        isOpen={readinessOpen}
        onClose={() => setReadinessOpen(false)}
        posts={posts}
      />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
