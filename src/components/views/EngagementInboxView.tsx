import React, { useState } from 'react';
import {
  Conversation,
  ConversationStatus,
  ConversationType,
  ReplyRule,
  ReplyTemplate,
  SinglePlatform,
} from '../../types';
import {
  Inbox,
  MessageCircle,
  Mail,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  Bookmark,
  Archive,
  Flag,
  UserCheck,
  Bot,
  Clock,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { aiReplyService } from '../../services/aiReplyService';
import { useToast } from '../common/Toast';

interface EngagementInboxViewProps {
  conversations: Conversation[];
  rules: ReplyRule[];
  templates: ReplyTemplate[];
  onUpdateConversation: (conv: Conversation) => void;
  onAddIncomingMessage: (convId: string, text: string) => void;
}

export const EngagementInboxView: React.FC<EngagementInboxViewProps> = ({
  conversations,
  rules,
  templates,
  onUpdateConversation,
  onAddIncomingMessage,
}) => {
  const { success, warning, info } = useToast();

  const [activeTab, setActiveTab] = useState<
    'all' | 'comment' | 'dm' | 'unread' | 'needs_review' | 'replied' | 'archived'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | SinglePlatform>('all');
  const [selectedConvId, setSelectedConvId] = useState<string>(
    conversations[0]?.id || ''
  );

  // Reply Composer State
  const [replyText, setReplyText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [simulatedTextInput, setSimulatedTextInput] = useState('');

  const selectedConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    // Tab filter
    if (activeTab === 'comment' && conv.type !== 'comment') return false;
    if (activeTab === 'dm' && conv.type !== 'dm') return false;
    if (activeTab === 'unread' && conv.status !== 'unread') return false;
    if (activeTab === 'needs_review' && conv.status !== 'needs_review') return false;
    if (activeTab === 'replied' && conv.status !== 'replied') return false;
    if (activeTab === 'archived' && conv.status !== 'archived') return false;
    if (activeTab === 'all' && conv.status === 'archived') return false;

    // Platform filter
    if (platformFilter !== 'all' && conv.platform !== platformFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchSender = conv.senderName.toLowerCase().includes(q) || conv.senderUsername.toLowerCase().includes(q);
      const matchMsg = conv.lastMessage.toLowerCase().includes(q);
      if (!matchSender && !matchMsg) return false;
    }

    return true;
  });

  // Action: Send Reply
  const handleSendReply = () => {
    if (!replyText.trim() || !selectedConv) return;

    const newMsg = {
      id: `msg_${Date.now()}`,
      conversationId: selectedConv.id,
      sender: {
        name: 'SocialFlow Studio',
        username: selectedConv.platform === 'tiktok' ? '@socialflow_studio' : 'SocialFlowStudioApp',
        avatarUrl:
          selectedConv.platform === 'tiktok'
            ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=80&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=80&auto=format&fit=crop&q=80',
        isSelf: true,
      },
      text: replyText.trim(),
      timestamp: new Date().toISOString(),
      platform: selectedConv.platform,
    };

    const updated: Conversation = {
      ...selectedConv,
      status: 'replied',
      handlingMode: 'auto_replied',
      lastTimestamp: new Date().toISOString(),
      messages: [...selectedConv.messages, newMsg],
    };

    onUpdateConversation(updated);
    setReplyText('');
    success('Reply Sent', `Dispatched response to ${selectedConv.senderName}`);
  };

  // Action: AI Suggestion Generator
  const handleGenerateAiReply = async () => {
    if (!selectedConv) return;
    setIsGeneratingAi(true);
    try {
      const suggestion = await aiReplyService.generateAiSuggestion(selectedConv);
      setReplyText(suggestion);
      info('AI Suggestion Generated', 'Review or adjust the draft before sending.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Action: Insert Template
  const handleInsertTemplate = (templateBody: string) => {
    if (!selectedConv) return;
    const rendered = templateBody
      .replace(/\{\{first_name\}\}/g, selectedConv.senderName.split(' ')[0])
      .replace(/\{\{page_name\}\}/g, 'SocialFlow Studio');
    setReplyText(rendered);
  };

  // Status updates
  const handleUpdateStatus = (status: ConversationStatus) => {
    if (!selectedConv) return;
    const updated: Conversation = {
      ...selectedConv,
      status,
    };
    onUpdateConversation(updated);
    success(`Conversation marked as ${status.replace('_', ' ')}`);
  };

  // Flag for manual review
  const handleFlagForReview = () => {
    if (!selectedConv) return;
    const updated: Conversation = {
      ...selectedConv,
      status: 'needs_review',
      handlingMode: 'human_review',
      priority: 'urgent',
    };
    onUpdateConversation(updated);
    warning('Conversation Flagged', 'Assigned for manual human review.');
  };

  // Save internal notes
  const handleSaveInternalNote = () => {
    if (!selectedConv) return;
    const updated: Conversation = {
      ...selectedConv,
      internalNotes: internalNoteText,
    };
    onUpdateConversation(updated);
    success('Internal Note Saved');
  };

  // Simulate an incoming message to test rules & safety policies
  const handleSimulateIncoming = () => {
    if (!selectedConv || !simulatedTextInput.trim()) return;

    const evaluation = aiReplyService.evaluateMessage(simulatedTextInput, rules, templates, true);

    const incomingMsg = {
      id: `msg_${Date.now()}`,
      conversationId: selectedConv.id,
      sender: {
        name: selectedConv.senderName,
        username: selectedConv.senderUsername,
        avatarUrl: selectedConv.senderAvatar,
        isSelf: false,
      },
      text: simulatedTextInput.trim(),
      timestamp: new Date().toISOString(),
      platform: selectedConv.platform,
    };

    let updatedStatus: ConversationStatus = 'unread';
    let updatedHandling: any = 'pending';
    let updatedMessages = [...selectedConv.messages, incomingMsg];

    if (evaluation.suggestedAction === 'flag_review') {
      updatedStatus = 'needs_review';
      updatedHandling = 'human_review';
      warning('Safety Rule Triggered', evaluation.reason);
    } else if (evaluation.suggestedAction === 'auto_reply' && evaluation.generatedResponse) {
      updatedStatus = 'replied';
      updatedHandling = 'auto_replied';
      const autoRespMsg = {
        id: `msg_auto_${Date.now()}`,
        conversationId: selectedConv.id,
        sender: {
          name: 'SocialFlow Studio (Automation Engine)',
          username: selectedConv.platform === 'tiktok' ? '@socialflow_studio' : 'SocialFlowStudioApp',
          avatarUrl: selectedConv.senderAvatar,
          isSelf: true,
        },
        text: evaluation.generatedResponse,
        timestamp: new Date().toISOString(),
        platform: selectedConv.platform,
      };
      updatedMessages.push(autoRespMsg);
      success('Auto-Reply Dispatched', evaluation.reason);
    } else if (evaluation.suggestedAction === 'suggest_ai') {
      updatedStatus = 'needs_review';
      updatedHandling = 'human_review';
      info('AI Review Required', evaluation.reason);
    }

    const updated: Conversation = {
      ...selectedConv,
      lastMessage: simulatedTextInput.trim(),
      lastTimestamp: new Date().toISOString(),
      status: updatedStatus,
      handlingMode: updatedHandling,
      messages: updatedMessages,
    };

    onUpdateConversation(updated);
    setSimulatedTextInput('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Engagement Inbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Unified comment and direct message center with automatic rule engine and AI assists.
          </p>
        </div>

        {/* Live Safety Status indicator */}
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
          <Bot className="w-4 h-4 text-indigo-600" />
          <span>Safety Filter: Active</span>
          <span className="text-slate-300">·</span>
          <span className="text-[11px] text-slate-500">Refund/Legal auto-replies blocked</span>
        </div>
      </div>

      {/* 7 Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 bg-white p-1 rounded-xl border border-slate-200">
        {[
          { key: 'all', label: 'All Conversations' },
          { key: 'comment', label: 'Comments' },
          { key: 'dm', label: 'Direct Messages' },
          { key: 'unread', label: 'Unread' },
          { key: 'needs_review', label: 'Needs Review' },
          { key: 'replied', label: 'Replied' },
          { key: 'archived', label: 'Archived' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all ${
              activeTab === tab.key
                ? 'bg-indigo-50 text-indigo-700 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Inbox 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Conversation List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-[700px]">
          {/* Search & Platform Filter Header */}
          <div className="p-3 border-b border-slate-100 space-y-2 bg-slate-50/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by sender or message text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-lg outline-none bg-white focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Platform:</span>
              <div className="flex items-center gap-1">
                {(['all', 'tiktok', 'facebook'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPlatformFilter(p)}
                    className={`px-2 py-0.5 text-[11px] rounded capitalize font-medium ${
                      platformFilter === p
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-500 hover:bg-slate-200/60'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No conversations found in this view.
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = selectedConv?.id === conv.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSelectedConvId(conv.id);
                      setInternalNoteText(conv.internalNotes || '');
                    }}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-indigo-50/60 border-l-2 border-indigo-600'
                        : 'hover:bg-slate-50/80'
                    }`}
                  >
                    <img
                      src={conv.senderAvatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {conv.senderName}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {new Date(conv.lastTimestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                        <span
                          className={`font-semibold uppercase ${
                            conv.platform === 'tiktok' ? 'text-black' : 'text-blue-600'
                          }`}
                        >
                          {conv.platform}
                        </span>
                        <span>·</span>
                        <span>{conv.type === 'comment' ? 'Comment' : 'Direct Message'}</span>
                        {conv.priority === 'urgent' && (
                          <span className="text-red-600 font-bold">· URGENT</span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 truncate mt-1 leading-snug">
                        {conv.lastMessage}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            conv.status === 'needs_review'
                              ? 'bg-amber-100 text-amber-800'
                              : conv.status === 'unread'
                              ? 'bg-indigo-100 text-indigo-800'
                              : conv.status === 'replied'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {conv.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {conv.handlingMode === 'human_review'
                            ? 'Human Review'
                            : conv.handlingMode === 'auto_replied'
                            ? 'Auto-Replied'
                            : 'Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Conversation Detail & Reply View (7 cols) */}
        {selectedConv ? (
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col h-[700px]">
            {/* Thread Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <img
                  src={selectedConv.senderAvatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{selectedConv.senderName}</h3>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {selectedConv.senderUsername}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                    <span className="capitalize font-semibold text-slate-700">
                      {selectedConv.platform}
                    </span>
                    <span>·</span>
                    <span>{selectedConv.type === 'comment' ? 'Public Post Comment' : 'Direct Message'}</span>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleUpdateStatus('resolved')}
                  title="Mark as Resolved"
                  className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleFlagForReview}
                  title="Flag for Human Review"
                  className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Flag className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleUpdateStatus('archived')}
                  title="Archive Conversation"
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Archive className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Post reference if comment */}
            {selectedConv.postTitle && (
              <div className="px-4 py-2 bg-indigo-50/40 border-b border-indigo-100/50 text-[11px] text-indigo-900 flex items-center justify-between">
                <span className="truncate">
                  On post: <strong>{selectedConv.postTitle}</strong>
                </span>
                {selectedConv.postUrl && (
                  <a
                    href={selectedConv.postUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 hover:underline shrink-0 ml-2"
                  >
                    View Post ↗
                  </a>
                )}
              </div>
            )}

            {/* Thread Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/20">
              {selectedConv.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender.isSelf ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-2 mb-1 text-[10px] text-slate-400 font-mono">
                    <span>{msg.sender.name}</span>
                    <span>·</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div
                    className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                      msg.sender.isSelf
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Templates & AI Assist Bar */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700">Quick Response Snippets:</span>
                <button
                  onClick={handleGenerateAiReply}
                  disabled={isGeneratingAi}
                  className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isGeneratingAi ? 'Synthesizing...' : 'Suggest AI Reply'}</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {templates.slice(0, 4).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleInsertTemplate(t.body)}
                    className="text-[11px] px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 shrink-0 transition-colors"
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Reply Composer & Send */}
            <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <textarea
                rows={2}
                placeholder="Type your reply to this conversation..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500 resize-none"
              />
              <button
                onClick={handleSendReply}
                disabled={!replyText.trim()}
                className={`px-4 bg-indigo-600 text-white rounded-lg flex items-center justify-center transition-colors ${
                  replyText.trim()
                    ? 'hover:bg-indigo-700 cursor-pointer shadow-xs'
                    : 'opacity-50 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Incoming Message Trigger (for testing rules!) */}
            <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-500 shrink-0">Test Rule:</span>
              <input
                type="text"
                placeholder="Simulate user saying: 'pricing info' or 'refund'..."
                value={simulatedTextInput}
                onChange={(e) => setSimulatedTextInput(e.target.value)}
                className="flex-1 px-2 py-1 text-[11px] border border-slate-300 rounded bg-white outline-none"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSimulateIncoming())}
              />
              <button
                onClick={handleSimulateIncoming}
                className="px-2.5 py-1 text-[11px] font-semibold bg-slate-800 text-white rounded hover:bg-slate-900 transition-colors shrink-0"
              >
                Inject
              </button>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-12 text-center text-xs text-slate-400">
            Select a conversation on the left to review messages.
          </div>
        )}
      </div>
    </div>
  );
};
