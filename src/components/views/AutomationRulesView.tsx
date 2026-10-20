import React, { useState } from 'react';
import { AutomationSettings, ReplyRule } from '../../types';
import {
  Bot,
  Clock,
  RotateCcw,
  Shield,
  Save,
  CheckCircle2,
  Calendar,
  Zap,
  PlayCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { useToast } from '../common/Toast';

interface AutomationRulesViewProps {
  settings: AutomationSettings;
  rules: ReplyRule[];
  onSaveSettings: (settings: AutomationSettings) => void;
  onUpdateRule: (rule: ReplyRule) => void;
  onSimulateSchedulerRun: () => void;
}

export const AutomationRulesView: React.FC<AutomationRulesViewProps> = ({
  settings,
  rules,
  onSaveSettings,
  onUpdateRule,
  onSimulateSchedulerRun,
}) => {
  const { success, info } = useToast();

  const [currentSettings, setCurrentSettings] = useState<AutomationSettings>({ ...settings });
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const [newTimeInput, setNewTimeInput] = useState('12:00');

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleSave = () => {
    onSaveSettings(currentSettings);
    success('Automation Rules Saved', 'Updated daemon polling and daily publishing schedules.');
  };

  const handleAddTimeToDay = (platform: 'tiktok' | 'facebook') => {
    if (!newTimeInput) return;
    const scheduleKey = platform === 'tiktok' ? 'tiktokSchedule' : 'facebookSchedule';
    const currentTimes = currentSettings[scheduleKey][selectedDay] || [];
    if (!currentTimes.includes(newTimeInput)) {
      const updated = {
        ...currentSettings,
        [scheduleKey]: {
          ...currentSettings[scheduleKey],
          [selectedDay]: [...currentTimes, newTimeInput].sort(),
        },
      };
      setCurrentSettings(updated);
    }
  };

  const handleRemoveTime = (platform: 'tiktok' | 'facebook', timeToRemove: string) => {
    const scheduleKey = platform === 'tiktok' ? 'tiktokSchedule' : 'facebookSchedule';
    const currentTimes = currentSettings[scheduleKey][selectedDay] || [];
    const updated = {
      ...currentSettings,
      [scheduleKey]: {
        ...currentSettings[scheduleKey],
        [selectedDay]: currentTimes.filter((t) => t !== timeToRemove),
      },
    };
    setCurrentSettings(updated);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Automation Rules & Publishing Daemon
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Configure automated daily time slots, polling intervals, safety locks, and retry policies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onSimulateSchedulerRun}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <PlayCircle className="w-4 h-4 text-indigo-600" />
            <span>Test Queue Worker</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Save Automation Configuration</span>
          </button>
        </div>
      </div>

      {/* Execution Health Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-medium text-slate-400 uppercase">Last Execution</span>
          <p className="text-base font-bold text-slate-900 mt-1">2 mins ago</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Status: Nominal (200 OK)</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-medium text-slate-400 uppercase">Next Cycle</span>
          <p className="text-base font-bold text-slate-900 mt-1">In 13 minutes</p>
          <span className="text-[11px] text-indigo-600 font-semibold mt-0.5 block">15-min interval</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-medium text-slate-400 uppercase">Successful Jobs</span>
          <p className="text-base font-bold text-slate-900 tabular-nums mt-1">1,482</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">99.7% delivery rate</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-[11px] font-medium text-slate-400 uppercase">Failed / Retried</span>
          <p className="text-base font-bold text-slate-900 tabular-nums mt-1">4</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Auto-requeued with backoff</span>
        </div>
      </div>

      {/* Daily Publishing Schedule Editor */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Platform Posting Schedule Matrix</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Specify independent daily time slots for TikTok and Facebook distribution.
            </p>
          </div>

          {/* Master Enable/Disable Toggle */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700">Daily Publishing:</span>
            <button
              onClick={() =>
                setCurrentSettings({
                  ...currentSettings,
                  dailyPublishingEnabled: !currentSettings.dailyPublishingEnabled,
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative ${
                currentSettings.dailyPublishingEnabled ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                  currentSettings.dailyPublishingEnabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Day of Week Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {daysOfWeek.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 transition-all ${
                selectedDay === day
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Schedule Grid for Selected Day */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* TikTok Schedule */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-bold">
                  TT
                </div>
                <h3 className="text-xs font-bold text-slate-900">TikTok Drops for {selectedDay}</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {(currentSettings.tiktokSchedule[selectedDay] || []).length} slots
              </span>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[44px]">
              {(currentSettings.tiktokSchedule[selectedDay] || []).map((time) => (
                <span
                  key={time}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-mono font-semibold text-slate-800"
                >
                  <Clock className="w-3 h-3 text-indigo-600" />
                  <span>{time}</span>
                  <button
                    onClick={() => handleRemoveTime('tiktok', time)}
                    className="text-slate-400 hover:text-red-600 ml-0.5 text-xs"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
              <input
                type="time"
                value={newTimeInput}
                onChange={(e) => setNewTimeInput(e.target.value)}
                className="px-2 py-1 text-xs border border-slate-200 rounded bg-white outline-none"
              />
              <button
                onClick={() => handleAddTimeToDay('tiktok')}
                className="px-2.5 py-1 text-xs font-semibold bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Add Slot
              </button>
            </div>
          </div>

          {/* Facebook Schedule */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                  FB
                </div>
                <h3 className="text-xs font-bold text-slate-900">Facebook Drops for {selectedDay}</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {(currentSettings.facebookSchedule[selectedDay] || []).length} slots
              </span>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[44px]">
              {(currentSettings.facebookSchedule[selectedDay] || []).map((time) => (
                <span
                  key={time}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs font-mono font-semibold text-slate-800"
                >
                  <Clock className="w-3 h-3 text-blue-600" />
                  <span>{time}</span>
                  <button
                    onClick={() => handleRemoveTime('facebook', time)}
                    className="text-slate-400 hover:text-red-600 ml-0.5 text-xs"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60">
              <input
                type="time"
                value={newTimeInput}
                onChange={(e) => setNewTimeInput(e.target.value)}
                className="px-2 py-1 text-xs border border-slate-200 rounded bg-white outline-none"
              />
              <button
                onClick={() => handleAddTimeToDay('facebook')}
                className="px-2.5 py-1 text-xs font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Add Slot
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Daemon Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Worker & Polling Policies */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Worker & Queue Parameters</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Queue Execution Mode</label>
              <select
                value={currentSettings.queueBehavior}
                onChange={(e) =>
                  setCurrentSettings({ ...currentSettings, queueBehavior: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-white text-slate-700"
              >
                <option value="strict">Strict (Only publish at exact scheduled slot)</option>
                <option value="asap">ASAP (Distribute immediately if backlog exists)</option>
                <option value="requeue">Auto-Requeue (Re-queue failed posts for next slot)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Max Retries</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={currentSettings.retryLimit}
                  onChange={(e) =>
                    setCurrentSettings({
                      ...currentSettings,
                      retryLimit: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Polling Interval</label>
                <select
                  value={currentSettings.pollingFrequencyMinutes}
                  onChange={(e) =>
                    setCurrentSettings({
                      ...currentSettings,
                      pollingFrequencyMinutes: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-white"
                >
                  <option value={5}>Every 5 minutes</option>
                  <option value={15}>Every 15 minutes</option>
                  <option value={30}>Every 30 minutes</option>
                  <option value={60}>Every 1 hour</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement & Safety Response Policy */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Auto-Reply & Safety Governance</h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Automated Response Policy</label>
              <select
                value={currentSettings.autoReplyPolicy}
                onChange={(e) =>
                  setCurrentSettings({ ...currentSettings, autoReplyPolicy: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-white text-slate-700"
              >
                <option value="auto_approved">Auto-reply for verified rules, flag others</option>
                <option value="suggestions_only">Suggestions only (Human must click Send)</option>
                <option value="human_approval_all">Mandatory human review for 100% of messages</option>
              </select>
            </div>

            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-900">Mandatory Sensitive Keyword Lock</span>
                <span className="text-[10px] font-semibold text-amber-800 uppercase">Enforced</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-normal">
                Never automatically replies to messages containing terms like <span className="font-mono">refund</span>, <span className="font-mono">complaint</span>, <span className="font-mono">scam</span>, or legal disputes. Always escalates to Human Review queue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
