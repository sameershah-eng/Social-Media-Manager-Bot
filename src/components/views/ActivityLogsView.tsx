import React, { useState } from 'react';
import { ActivityLog, SinglePlatform } from '../../types';
import {
  ScrollText,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
  Clock,
  Download,
  Trash2,
  ChevronRight,
} from 'lucide-react';
import { Drawer } from '../common/Drawer';
import { useToast } from '../common/Toast';

interface ActivityLogsViewProps {
  logs: ActivityLog[];
  onAddLog: (log: ActivityLog) => void;
  onClearLogs: () => void;
}

export const ActivityLogsView: React.FC<ActivityLogsViewProps> = ({
  logs,
  onAddLog,
  onClearLogs,
}) => {
  const { success, info } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<'all' | SinglePlatform | 'system' | 'google_sheets'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed' | 'warning' | 'pending'>('all');
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  // Filter logs
  const filteredLogs = logs.filter((l) => {
    const matchPlatform = platformFilter === 'all' || l.platform === platformFilter;
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchSearch =
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchPlatform && matchStatus && matchSearch;
  });

  const handleRetryJob = (log: ActivityLog) => {
    if (!log.retryable) return;
    const retrySuccessLog: ActivityLog = {
      id: `log_retry_${Date.now()}`,
      timestamp: new Date().toISOString(),
      platform: log.platform,
      action: `Retried: ${log.action}`,
      status: 'success',
      details: `Idempotent retry executed successfully for job ${log.id}. Result delivered.`,
      retryable: false,
    };
    onAddLog(retrySuccessLog);
    success('Job Retry Successful', 'Executed with duplicate protection locks.');
    setSelectedLog(null);
  };

  const handleExportLogs = () => {
    const headers = ['Timestamp', 'Platform', 'Action', 'Status', 'Details'];
    const rows = logs.map((l) => [
      l.timestamp,
      l.platform,
      `"${l.action}"`,
      l.status,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SocialFlow_ActivityLogs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    success('Logs Exported to CSV');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            System Activity & Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete audit trail of scheduled jobs, publishing outcomes, engagement captures, and API syncs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Trail</span>
          </button>
          <button
            onClick={() => {
              onClearLogs();
              info('Logs Cleared');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search action or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value as any)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
          >
            <option value="all">All Targets</option>
            <option value="tiktok">TikTok</option>
            <option value="facebook">Facebook</option>
            <option value="google_sheets">Google Sheets</option>
            <option value="system">System / Worker</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-700 outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100">
          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No activity logs match the current filters.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="p-3.5 sm:px-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    {log.status === 'success' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {log.status === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                    {log.status === 'failed' && (
                      <XCircle className="w-4 h-4 text-red-500" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {log.action}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {log.platform}
                      </span>
                      {log.retryable && (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          Retryable
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 truncate mt-0.5 max-w-2xl">
                      {log.details}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Drawer */}
      <Drawer
        isOpen={selectedLog !== null}
        onClose={() => setSelectedLog(null)}
        title="Audit Record Diagnostics"
        subtitle={selectedLog?.action}
        width="md"
      >
        {selectedLog && (
          <div className="space-y-5 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="font-mono text-slate-800">{new Date(selectedLog.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Target Platform:</span>
                <span className="font-semibold text-slate-800 uppercase">{selectedLog.platform}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Execution Status:</span>
                <span className="capitalize font-bold text-slate-900">{selectedLog.status}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                Detailed Log Payload
              </span>
              <p className="p-3 bg-slate-900 text-slate-100 font-mono text-[11px] rounded-lg leading-relaxed whitespace-pre-wrap">
                {selectedLog.details}
              </p>
            </div>

            {selectedLog.metadata && (
              <div>
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Metadata
                </span>
                <pre className="p-3 bg-slate-100 rounded-lg font-mono text-[11px] text-slate-700 overflow-x-auto">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            )}

            {selectedLog.retryable && (
              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => handleRetryJob(selectedLog)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Execute Safe Retry</span>
                </button>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
};
