import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import {
  Check,
  Sparkles,
  Radio,
  Calendar,
  PenTool,
  MessageSquareText,
  FileSpreadsheet,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onOpenReadiness: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onOpenReadiness,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      id: 1,
      title: 'Welcome to SocialFlow Studio',
      shortTitle: 'Workspace',
      icon: Sparkles,
      desc: 'Orchestrate multi-channel publishing for TikTok and Facebook from one unified command center.',
      content: (
        <div className="space-y-4 text-xs text-slate-600 leading-relaxed">
          <p>
            SocialFlow Studio is engineered to eliminate manual social media toil. From automated daily posting queues to unified direct messages and intelligent comment replies, your entire presence can run reliably in the background.
          </p>
          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg text-slate-700">
            <span className="font-semibold text-indigo-900 block mb-1">Key Principles:</span>
            <ul className="list-disc pl-4 space-y-1 text-slate-600">
              <li>Direct scheduling with platform-specific captions and video formats.</li>
              <li>Unified engagement inbox with automatic keyword triggers and human-review safety filters.</li>
              <li>Real-time performance analytics with genuine CSV and Google Sheets export.</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Connect TikTok Account',
      shortTitle: 'TikTok',
      icon: Radio,
      desc: 'Link your TikTok Business or Creator account to authorize video publishing and comments API.',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                TT
              </div>
              <div>
                <p className="font-semibold text-slate-900">@socialflow_studio</p>
                <p className="text-[11px] text-slate-500">TikTok Creator Account (48.2k followers)</p>
              </div>
            </div>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">
              Demo Connected
            </span>
          </div>
          <p className="text-slate-500 leading-normal">
            Permissions granted: <span className="font-mono text-[11px]">video.upload</span>, <span className="font-mono text-[11px]">video.publish</span>, <span className="font-mono text-[11px]">comment.list</span>.
          </p>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Connect Facebook Page',
      shortTitle: 'Facebook',
      icon: Radio,
      desc: 'Link your Meta Facebook Business Page via Graph API to distribute feeds and monitor messenger.',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                FB
              </div>
              <div>
                <p className="font-semibold text-slate-900">SocialFlow Studio Official</p>
                <p className="text-[11px] text-slate-500">Meta Verified Page (32.7k followers)</p>
              </div>
            </div>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">
              Demo Connected
            </span>
          </div>
          <p className="text-slate-500 leading-normal">
            Permissions granted: <span className="font-mono text-[11px]">pages_manage_posts</span>, <span className="font-mono text-[11px]">pages_read_engagement</span>, <span className="font-mono text-[11px]">pages_messaging</span>.
          </p>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Configure Daily Posting Schedules',
      shortTitle: 'Schedules',
      icon: Calendar,
      desc: 'Set preferred daily time slots so scheduled posts distribute during peak audience engagement.',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-semibold text-slate-900 block mb-1">TikTok Default Slots:</span>
              <p className="text-slate-500 font-mono text-[11px]">11:00 AM · 4:30 PM · 8:00 PM</p>
              <span className="text-[10px] text-slate-400 mt-1 block">Tuned for video viral algorithms</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="font-semibold text-slate-900 block mb-1">Facebook Default Slots:</span>
              <p className="text-slate-500 font-mono text-[11px]">9:30 AM · 2:00 PM · 6:30 PM</p>
              <span className="text-[10px] text-slate-400 mt-1 block">Tuned for desktop & feed reading</span>
            </div>
          </div>
          <p className="text-slate-400 text-[11px]">
            You can customize day-by-day posting times in Automation Rules anytime.
          </p>
        </div>
      ),
    },
    {
      id: 5,
      title: 'Batch & Create Initial Content',
      shortTitle: 'Content',
      icon: PenTool,
      desc: 'Compose your posts once, tweak per platform, and drag into the calendar queue.',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            The Content Studio allows independent caption tailoring, character counter limits (TikTok 2,200 vs FB 63,206), media aspect-ratio verification, and simulated previews.
          </p>
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px]">
            ✓ 7 initial sample posts have already been provisioned into your queue and published history.
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: 'Configure Response Templates & Triggers',
      shortTitle: 'Templates',
      icon: MessageSquareText,
      desc: 'Set up instant replies for pricing and hours, while protecting sensitive complaint messages.',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            SocialFlow Studio includes an automatic rule evaluation engine with safe placeholders (<span className="font-mono text-slate-700">{'{{first_name}}'}</span>) and a mandatory human-review safety policy that blocks automated replies to complaints, refund disputes, or legal terms.
          </p>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-600">
            rule_pricing: "pricing, price, cost" → Auto Reply<br />
            rule_complaints: "refund, complaint, issue" → Flag Human Review
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: 'Configure Analytics & Data Export',
      shortTitle: 'Export',
      icon: FileSpreadsheet,
      desc: 'Export normalized metrics via standard CSV or automatic Google Sheets synchronization.',
      content: (
        <div className="space-y-3 text-xs text-slate-600">
          <p>
            All reach, impressions, followers, and engagement rates are tracked with daily snapshot histories. You can download the complete schema spreadsheet anytime from the Analytics tab.
          </p>
          <p className="text-[11px] text-slate-400">
            Export format complies with the 15-column client specification including post URLs, engagement rates, and platform account identifiers.
          </p>
        </div>
      ),
    },
    {
      id: 8,
      title: 'Run Connection & Readiness Verification',
      shortTitle: 'Readiness',
      icon: ShieldCheck,
      desc: 'Perform a comprehensive audit of account permissions, queue workers, and export readiness.',
      content: (
        <div className="space-y-4 text-xs text-slate-600">
          <p>
            Your workspace is fully configured! Launch the Handover Readiness Verification tool to run self-tests on accounts, scheduler queues, and engagement capture.
          </p>
          <button
            onClick={() => {
              onClose();
              onOpenReadiness();
            }}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Launch Handover Verification Panel</span>
          </button>
        </div>
      ),
    },
  ];

  const current = steps[currentStep - 1];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Interactive Setup Guide"
      subtitle={`Step ${currentStep} of ${steps.length} — Onboarding Wizard`}
      maxWidth="2xl"
    >
      <div className="flex flex-col gap-5">
        {/* Progress indicator */}
        <div className="flex items-center justify-between gap-1 border-b border-slate-100 pb-4 overflow-x-auto">
          {steps.map((s) => {
            const isPassed = s.id < currentStep;
            const isCurrent = s.id === currentStep;
            return (
              <button
                key={s.id}
                onClick={() => setCurrentStep(s.id)}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs transition-colors shrink-0 ${
                  isCurrent
                    ? 'font-bold text-indigo-600 bg-indigo-50'
                    : isPassed
                    ? 'text-emerald-600 hover:bg-slate-50'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isPassed
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isPassed ? <Check className="w-2.5 h-2.5" /> : s.id}
                </span>
                <span className="hidden sm:inline">{s.shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Step details */}
        <div className="py-2">
          <div className="flex items-center gap-2.5 mb-1.5">
            <current.icon className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900">{current.title}</h4>
          </div>
          <p className="text-xs text-slate-500 mb-4">{current.desc}</p>
          {current.content}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              currentStep === 1
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700"
            >
              Skip Setup
            </button>
            {currentStep < steps.length ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(steps.length, prev + 1))}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onComplete();
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Finish Onboarding</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};
