import { Conversation, ReplyRule, ReplyTemplate } from '../types';

export interface RuleMatchResult {
  matchedRule?: ReplyRule;
  matchedTemplate?: ReplyTemplate;
  suggestedAction: 'auto_reply' | 'flag_review' | 'suggest_ai' | 'none';
  generatedResponse?: string;
  reason: string;
}

export const aiReplyService = {
  /**
   * Evaluates an incoming message against active reply rules and safety keywords
   */
  evaluateMessage(
    incomingText: string,
    rules: ReplyRule[],
    templates: ReplyTemplate[],
    safeKeywordsProtection = true
  ): RuleMatchResult {
    const textLower = incomingText.toLowerCase().trim();

    // Critical safety override: complaint, refund, legal, dispute must never be blindly auto-replied
    if (safeKeywordsProtection) {
      const dangerWords = ['refund', 'complaint', 'lawsuit', 'lawyer', 'scam', 'fraud', 'stolen', 'broken', 'dispute'];
      const hitDanger = dangerWords.some((w) => textLower.includes(w));
      if (hitDanger) {
        return {
          suggestedAction: 'flag_review',
          reason: 'Triggered sensitive or complaint safety keyword. Assigned to human review.',
          generatedResponse: 'Your inquiry has been escalated to our senior management team for priority investigation.',
        };
      }
    }

    // Sort rules by priority (ascending: 0 is highest)
    const activeRules = [...rules]
      .filter((r) => r.enabled)
      .sort((a, b) => a.priority - b.priority);

    for (const rule of activeRules) {
      let isMatch = false;

      for (const kw of rule.keywords) {
        const cleanKw = kw.toLowerCase().trim();
        if (rule.matchType === 'exact') {
          if (textLower === cleanKw) isMatch = true;
        } else if (rule.matchType === 'phrase') {
          if (textLower.includes(cleanKw)) isMatch = true;
        } else {
          // case_insensitive keyword word-boundary or substring
          if (textLower.includes(cleanKw)) isMatch = true;
        }
        if (isMatch) break;
      }

      if (isMatch) {
        const template = templates.find((t) => t.id === rule.templateId);
        let resp = rule.responseText || template?.body;
        
        // Replace dynamic tags
        if (resp) {
          resp = resp
            .replace(/\{\{first_name\}\}/g, 'there')
            .replace(/\{\{page_name\}\}/g, 'SocialFlow Studio');
        }

        return {
          matchedRule: rule,
          matchedTemplate: template,
          suggestedAction: rule.action,
          generatedResponse: resp,
          reason: `Matched rule "${rule.name}" via keyword trigger.`,
        };
      }
    }

    return {
      suggestedAction: 'none',
      reason: 'No configured keyword rule matched.',
    };
  },

  /**
   * Generates a context-aware AI suggestion for any conversation
   */
  async generateAiSuggestion(
    conversation: Conversation,
    customInstructions = ''
  ): Promise<string> {
    const lastMsg = conversation.lastMessage;
    const sender = conversation.senderName;
    const platform = conversation.platform === 'tiktok' ? 'TikTok' : 'Facebook';
    const isComment = conversation.type === 'comment';

    // Heuristic generator that feels distinctly customized and professional
    const textLower = lastMsg.toLowerCase();

    if (textLower.includes('price') || textLower.includes('cost') || textLower.includes('how much')) {
      return `Hi ${sender}! Thanks for asking! Our plans start with a 14-day free trial, with Creator tiers from $29/mo and Agency Multi-Seat at $89/mo. Would you like us to send the full comparison guide?`;
    }

    if (textLower.includes('partner') || textLower.includes('collab') || textLower.includes('sponsor')) {
      return `Hey ${sender}! We love collaborating with forward-thinking creators and brands on ${platform}. Please shoot us an email at partnerships@socialflow.studio with your channels and ideas so our growth team can review!`;
    }

    if (textLower.includes('schedule') || textLower.includes('publish') || textLower.includes('auto')) {
      return `Great question, ${sender}! Yes, SocialFlow Studio supports direct auto-publishing to both TikTok and Facebook, including custom captions, daily posting queues, and timezone scheduling.`;
    }

    if (textLower.includes('refund') || textLower.includes('charge') || textLower.includes('issue')) {
      return `Hi ${sender}, thank you for bringing this to our attention. We are actively investigating your account. Could you please confirm your registered account email so our billing specialist can resolve this immediately?`;
    }

    if (isComment) {
      return `Thanks for the comment, @${conversation.senderUsername}! We appreciate your support and would love to hear what workflows you'd like to see next.`;
    }

    return `Hello ${sender}, thank you for reaching out to SocialFlow Studio on ${platform}. We would be thrilled to assist you. What specific features or goals can we help you explore today?`;
  },
};
