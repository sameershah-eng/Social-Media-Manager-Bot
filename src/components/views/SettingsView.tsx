import React, { useState } from 'react';
import { Workspace } from '../../types';
import {
  Settings,
  ShieldCheck,
  HelpCircle,
  RotateCcw,
  Save,
  Check,
  Bell,
  Sliders,
  Globe,
  Database,
  Key,
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface SettingsViewProps {
  workspace: Workspace;
  onSaveWorkspace: (ws: Workspace) => void;
  onResetAllData: () => void;
  onOpenOnboarding: () => void;
  onOpenReadiness: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  workspace,
  onSaveWorkspace,
  onResetAllData,
  onOpenOnboarding,
  onOpenReadiness,
}) => {
  const { success, warning, info } = useToast();

  const [wsName, setWsName] = useState(workspace.name);
  const [industry, setIndustry] = useState(workspace.industry);
  const [timeZone, setTimeZone] = useState(workspace.timeZone);
  const [adminEmail, setAdminEmail] = useState(workspace.email);

  // Notification toggles
  const [notifyOnFailure, setNotifyOnFailure] = useState(true);
  const [notifyOnUrgentDm, setNotifyOnUrgentDm] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  const handleSaveProfile = () => {
    const updated: Workspace = {
      ...workspace,
      name: wsName.trim() || workspace.name,
      industry: industry.trim() || workspace.industry,
      timeZone,
      email: adminEmail.trim() || workspace.email,
    };
    onSaveWorkspace(updated);
    success('Workspace Settings Saved', 'Updated administrative profile and timezone configuration.');
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all posts, messages, and rules to the original demo state?')) {
      onResetAllData();
      info('Workspace Data Reset', 'Restored initial sample accounts, posts, and analytics.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Workspace Settings & Administration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage organization profile, notifications, verification checks, and data backups.
          </p>
        </div>

        <button
          onClick={handleSaveProfile}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {/* Handover & Onboarding Quick Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900">Handover Verification Panel</h3>
            </div>
            <p className="text-xs text-slate-500 leading-normal">
              Run comprehensive diagnostics across connected accounts, background scheduler queues, and CSV export capabilities.
            </p>
          </div>
          <button
            onClick={onOpenReadiness}
            className="mt-4 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold self-start transition-colors"
          >
            Launch Verification
          </button>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900">Interactive Setup Wizard</h3>
            </div>
            <p className="text-xs text-slate-500 leading-normal">
              Walk through the 8-step onboarding guide to review workspace capabilities, account links, and schedule setup.
            </p>
          </div>
          <button
            onClick={onOpenOnboarding}
            className="mt-4 px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold self-start transition-colors"
          >
            Restart Wizard
          </button>
        </div>
      </div>

      {/* Organization Profile */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Organization Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Workspace Name</label>
            <input
              type="text"
              value={wsName}
              onChange={(e) => setWsName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Industry / Domain</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Administrative Email</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Primary Time Zone</label>
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-white text-slate-700 focus:border-indigo-500"
            >
              <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
              <option value="America/New_York (EST)">America/New_York (EST)</option>
              <option value="Europe/London (GMT)">Europe/London (GMT)</option>
              <option value="Asia/Tokyo (JST)">Asia/Tokyo (JST)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Notification Alerts & Webhook Triggers
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
            <div>
              <p className="font-semibold text-slate-900">Publishing Failure Alerts</p>
              <p className="text-[11px] text-slate-400">Receive high-priority notifications when an API upload fails</p>
            </div>
            <input
              type="checkbox"
              checked={notifyOnFailure}
              onChange={(e) => setNotifyOnFailure(e.target.checked)}
              className="rounded text-indigo-600 w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
            <div>
              <p className="font-semibold text-slate-900">Urgent Human Review Alerts</p>
              <p className="text-[11px] text-slate-400">Trigger alert immediately when refund or complaint keyword is detected</p>
            </div>
            <input
              type="checkbox"
              checked={notifyOnUrgentDm}
              onChange={(e) => setNotifyOnUrgentDm(e.target.checked)}
              className="rounded text-indigo-600 w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
            <div>
              <p className="font-semibold text-slate-900">Weekly Performance Digest</p>
              <p className="text-[11px] text-slate-400">Aggregated reach and follower metrics report</p>
            </div>
            <input
              type="checkbox"
              checked={weeklyDigest}
              onChange={(e) => setWeeklyDigest(e.target.checked)}
              className="rounded text-indigo-600 w-4 h-4"
            />
          </div>
        </div>
      </div>

      {/* Data Management & Demo Reset */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
          Data Management & Reset
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-red-50/60 border border-red-200 rounded-lg text-xs">
          <div>
            <p className="font-bold text-red-900">Reset Local Demonstration State</p>
            <p className="text-red-700 text-[11px] mt-0.5">
              Restores initial demonstration accounts, 7 queued posts, conversations, and response rules.
            </p>
          </div>

          <button
            onClick={handleResetData}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shrink-0 transition-colors shadow-xs"
          >
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
};
