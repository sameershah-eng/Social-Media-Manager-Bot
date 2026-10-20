import React, { useState } from 'react';
import { ReplyTemplate } from '../../types';
import {
  MessageSquareText,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Eye,
  Check,
  Bot,
  Sparkles,
  Save,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { useToast } from '../common/Toast';

interface ResponseTemplatesViewProps {
  templates: ReplyTemplate[];
  onSaveTemplates: (templates: ReplyTemplate[]) => void;
}

export const ResponseTemplatesView: React.FC<ResponseTemplatesViewProps> = ({
  templates,
  onSaveTemplates,
}) => {
  const { success, warning } = useToast();

  const [templateList, setTemplateList] = useState<ReplyTemplate[]>([...templates]);
  const [editingTemplate, setEditingTemplate] = useState<ReplyTemplate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Live Test Previewer state
  const [testFirstName, setTestFirstName] = useState('Sarah');
  const [testPlatform, setTestPlatform] = useState('TikTok');
  const [activePreviewId, setActivePreviewId] = useState<string>(templates[0]?.id || '');

  const activeTemplate = templateList.find((t) => t.id === activePreviewId) || templateList[0];

  const handleOpenAdd = () => {
    const newTpl: ReplyTemplate = {
      id: `tpl_${Date.now()}`,
      name: 'New Custom Template',
      body: 'Hi {{first_name}}! Thanks for contacting {{page_name}}.',
      keywords: ['inquiry', 'custom'],
      platform: 'all',
      mode: 'auto',
      enabled: true,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setEditingTemplate(newTpl);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: ReplyTemplate) => {
    setEditingTemplate({ ...t });
    setIsModalOpen(true);
  };

  const handleSaveModal = () => {
    if (!editingTemplate || !editingTemplate.name.trim()) return;
    const exists = templateList.some((t) => t.id === editingTemplate.id);
    let updated: ReplyTemplate[];
    if (exists) {
      updated = templateList.map((t) =>
        t.id === editingTemplate.id ? { ...editingTemplate, updatedAt: new Date().toISOString().split('T')[0] } : t
      );
      success('Template Updated', `Saved changes to "${editingTemplate.name}"`);
    } else {
      updated = [editingTemplate, ...templateList];
      success('Template Created', `Added "${editingTemplate.name}" to library`);
    }
    setTemplateList(updated);
    onSaveTemplates(updated);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = templateList.filter((t) => t.id !== id);
    setTemplateList(updated);
    onSaveTemplates(updated);
    success('Template Deleted');
  };

  const handleDuplicate = (t: ReplyTemplate) => {
    const dup: ReplyTemplate = {
      ...t,
      id: `tpl_${Date.now()}`,
      name: `${t.name} (Copy)`,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    const updated = [dup, ...templateList];
    setTemplateList(updated);
    onSaveTemplates(updated);
    success('Template Duplicated');
  };

  const handleToggleEnabled = (id: string) => {
    const updated = templateList.map((t) =>
      t.id === id ? { ...t, enabled: !t.enabled } : t
    );
    setTemplateList(updated);
    onSaveTemplates(updated);
  };

  const renderPreview = (body: string) => {
    return body
      .replace(/\{\{first_name\}\}/g, testFirstName || 'there')
      .replace(/\{\{page_name\}\}/g, 'SocialFlow Studio');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Response Template Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pre-approved response messages, dynamic placeholders, and human-approval routing.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Template</span>
        </button>
      </div>

      {/* Main 2-Column Split: List + Live Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Templates Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>{templateList.length} configured response templates</span>
            <span>Click to test interactive preview</span>
          </div>

          <div className="space-y-3">
            {templateList.map((t) => {
              const isSelected = activePreviewId === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => setActivePreviewId(t.id)}
                  className={`p-4 bg-white rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 ring-1 ring-indigo-600/30 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{t.name}</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                          t.mode === 'auto'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {t.mode === 'auto' ? 'Instant Auto-Send' : 'Approval Required'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleToggleEnabled(t.id)}
                        className={`w-8 h-4.5 rounded-full transition-colors relative ${
                          t.enabled ? 'bg-indigo-600' : 'bg-slate-200'
                        }`}
                        title={t.enabled ? 'Enabled' : 'Disabled'}
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                            t.enabled ? 'left-4' : 'left-0.5'
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(t)}
                        title="Edit template"
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(t)}
                        title="Duplicate"
                        className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        title="Delete"
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                    {t.body}
                  </p>

                  <div className="flex items-center justify-between mt-2.5 text-[10px] text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span>Keywords:</span>
                      <span className="font-mono text-slate-600 truncate max-w-xs">
                        {t.keywords.join(', ')}
                      </span>
                    </div>
                    <span>Updated {t.updatedAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Simulator Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 space-y-5 sticky top-24">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-900">Live Placeholder Previewer</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Recipient Test Name (placeholder: <span className="font-mono">{'{{first_name}}'}</span>)
              </label>
              <input
                type="text"
                value={testFirstName}
                onChange={(e) => setTestFirstName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Testing Selected Template
              </label>
              <p className="font-bold text-slate-900 text-xs">{activeTemplate?.name}</p>
            </div>

            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-semibold text-slate-600">Simulated Rendered Output:</span>
              <div className="p-4 bg-slate-900 text-white rounded-xl text-xs leading-relaxed shadow-inner">
                {activeTemplate ? renderPreview(activeTemplate.body) : 'No template selected.'}
              </div>
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-lg text-[11px] text-indigo-900 leading-snug">
              <strong>Supported Placeholders:</strong>
              <ul className="list-disc pl-4 mt-1 space-y-0.5 text-indigo-800">
                <li><span className="font-mono">{'{{first_name}}'}</span> — Recipient's display name</li>
                <li><span className="font-mono">{'{{page_name}}'}</span> — Current workspace / channel name</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editingTemplate && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={templateList.some((t) => t.id === editingTemplate.id) ? 'Edit Response Template' : 'New Response Template'}
          subtitle="Configure message copy, keywords, and mode"
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Template Title</label>
              <input
                type="text"
                value={editingTemplate.name}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Message Body</label>
              <textarea
                rows={4}
                value={editingTemplate.body}
                onChange={(e) => setEditingTemplate({ ...editingTemplate, body: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-slate-400">Use {'{{first_name}}'} and {'{{page_name}}'} for variables.</span>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Associated Keywords (comma separated)</label>
              <input
                type="text"
                value={editingTemplate.keywords.join(', ')}
                onChange={(e) =>
                  setEditingTemplate({
                    ...editingTemplate,
                    keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean),
                  })
                }
                className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Execution Mode</label>
                <select
                  value={editingTemplate.mode}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, mode: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-white"
                >
                  <option value="auto">Instant Auto-Reply</option>
                  <option value="approval_required">Approval Required</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Applicable Platform</label>
                <select
                  value={editingTemplate.platform}
                  onChange={(e) => setEditingTemplate({ ...editingTemplate, platform: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg outline-none bg-white"
                >
                  <option value="all">All Platforms</option>
                  <option value="tiktok">TikTok Only</option>
                  <option value="facebook">Facebook Only</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs"
              >
                Save Template
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
