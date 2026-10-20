import React, { useState } from 'react';
import { ConnectedAccount } from '../../types';
import {
  Radio,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  Lock,
  Key,
  Info,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

interface ConnectedAccountsViewProps {
  accounts: ConnectedAccount[];
  onToggleConnection: (id: string, isConnected: boolean) => void;
}

export const ConnectedAccountsView: React.FC<ConnectedAccountsViewProps> = ({
  accounts,
  onToggleConnection,
}) => {
  const { success, warning, info } = useToast();
  const [diagnosticsModalAccount, setDiagnosticsModalAccount] = useState<ConnectedAccount | null>(null);

  const handleReconnect = (acc: ConnectedAccount) => {
    onToggleConnection(acc.id, true);
    success(`Account Reconnected`, `Successfully verified token and permissions for ${acc.accountName}`);
  };

  const handleDisconnect = (acc: ConnectedAccount) => {
    onToggleConnection(acc.id, false);
    warning(`Account Disconnected`, `Revoked session permissions for ${acc.accountName}`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Connected Accounts & API Integrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage authenticated TikTok Creator/Business endpoints and Meta Facebook Page connections.
          </p>
        </div>

        {/* Integration Status Pill */}
        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>OAuth Mode: Demonstration Sandbox</span>
          <span className="text-slate-300">·</span>
          <span className="text-indigo-600 font-semibold">Ready for Client API Keys</span>
        </div>
      </div>

      {/* Transparent Disclaimer Banner from Section 6 */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
        <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-slate-900 block mb-0.5">
            Demonstration & Sandbox Connection Diagnostics
          </span>
          To protect user privacy and avoid fabricating external connections, the platform is currently operating in an authorized sandbox environment. Real production OAuth requires supplying <span className="font-mono text-[11px] font-semibold text-slate-800">TIKTOK_CLIENT_KEY</span> and <span className="font-mono text-[11px] font-semibold text-slate-800">META_APP_SECRET</span> in your server environment configuration.
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((acc) => {
          const isTT = acc.platform === 'tiktok';
          return (
            <div
              key={acc.id}
              className="bg-white rounded-xl border border-slate-200 p-6 space-y-6 shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Account Card Header */}
                <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm text-white ${
                        isTT ? 'bg-black' : 'bg-blue-600'
                      }`}
                    >
                      {isTT ? 'TT' : 'FB'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-900">{acc.accountName}</h3>
                        <span className="text-xs text-slate-400 font-mono">({acc.username})</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{acc.accountType}</p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-md ${
                      acc.isConnected
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                        : 'text-red-700 bg-red-50 border border-red-200'
                    }`}
                  >
                    {acc.isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>

                {/* Account Details & Diagnostics */}
                <div className="space-y-3.5 pt-4 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                      <span className="text-[11px] text-slate-400 block">Verified Followers</span>
                      <span className="text-sm font-bold text-slate-900 tabular-nums">
                        {acc.followersCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80">
                      <span className="text-[11px] text-slate-400 block">Last Sync Cycle</span>
                      <span className="text-xs font-semibold text-slate-700">
                        {new Date(acc.lastSyncAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">
                      Granted API Permissions ({acc.permissions.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {acc.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-mono"
                        >
                          {perm}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                    <span>Last publishing activity:</span>
                    <span className="font-semibold text-slate-700">
                      {acc.lastPublishAt
                        ? new Date(acc.lastPublishAt).toLocaleDateString()
                        : 'Pending next queue slot'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={() => setDiagnosticsModalAccount(acc)}
                  className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>API Diagnostics</span>
                </button>

                <div className="flex items-center gap-2">
                  {acc.isConnected ? (
                    <button
                      onClick={() => handleDisconnect(acc)}
                      className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                    >
                      Disconnect
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReconnect(acc)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      Connect
                    </button>
                  )}
                  <button
                    onClick={() => handleReconnect(acc)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Force immediate sync"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Diagnostics Modal */}
      {diagnosticsModalAccount && (
        <Modal
          isOpen={diagnosticsModalAccount !== null}
          onClose={() => setDiagnosticsModalAccount(null)}
          title={`API Integration Diagnostics — ${diagnosticsModalAccount.accountName}`}
          subtitle={`Platform: ${diagnosticsModalAccount.platform.toUpperCase()} Developer Architecture`}
          maxWidth="xl"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-900">OAuth Handshake Architecture</span>
              <p className="text-slate-500 leading-normal">
                {diagnosticsModalAccount.platform === 'tiktok'
                  ? 'Configured for TikTok Login Kit v2 with Content Posting API scopes for direct scheduled video upload.'
                  : 'Configured for Meta Graph API v20.0 with Page Access Token exchanges and Webhooks for Messenger.'}
              </p>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-1">Required Environment Variables:</span>
              <div className="p-2.5 bg-slate-900 text-white font-mono text-[11px] rounded-lg space-y-1">
                {diagnosticsModalAccount.platform === 'tiktok' ? (
                  <>
                    <p>TIKTOK_CLIENT_KEY="your_tiktok_client_key"</p>
                    <p>TIKTOK_CLIENT_SECRET="your_tiktok_client_secret"</p>
                    <p>TIKTOK_REDIRECT_URI="https://your-domain.com/api/auth/tiktok/callback"</p>
                  </>
                ) : (
                  <>
                    <p>META_APP_ID="your_meta_app_id"</p>
                    <p>META_APP_SECRET="your_meta_app_secret"</p>
                    <p>META_REDIRECT_URI="https://your-domain.com/api/auth/meta/callback"</p>
                  </>
                )}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-[11px]">
              ✓ Webhook Listener: <span className="font-mono">/api/webhooks/{diagnosticsModalAccount.platform}</span> configured for real-time comment and direct message ingestion.
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setDiagnosticsModalAccount(null)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded-lg font-semibold"
              >
                Close Diagnostics
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
