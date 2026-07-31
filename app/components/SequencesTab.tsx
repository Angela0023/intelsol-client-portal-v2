'use client';

import { useState, useEffect } from 'react';
import { Mail, Plus, Edit2, Trash2, Save, X, Loader, RefreshCw } from 'lucide-react';
import { useEditMode } from './EditModeContext';

interface Email {
  emailNumber: number;
  type: string;
  subject: string;
  body: string;
}

interface Sequence {
  id: string;
  tierName: string;
  tierColor: string;
  targetPersonas: string;
  messagingAngle: string;
  emails: Email[];
}

interface SequencesTabProps {
  clientId: string;
}

const tierColors: Record<string, { bg: string; border: string; text: string; badge: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-900', badge: 'bg-blue-600' },
  green: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-900', badge: 'bg-green-600' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-500', text: 'text-amber-900', badge: 'bg-amber-600' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-900', badge: 'bg-purple-600' },
  indigo: { bg: 'bg-indigo-50', border: 'border-indigo-500', text: 'text-indigo-900', badge: 'bg-indigo-600' },
};

export default function SequencesTab({ clientId }: SequencesTabProps) {
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const { editMode, isAdmin } = useEditMode();

  const canEdit = editMode && isAdmin;

  useEffect(() => {
    fetchSequences();
  }, [clientId]);

  const fetchSequences = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/sequences/get?clientId=${clientId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load sequences');
      }

      setSequences(data.sequences);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sequences');
    } finally {
      setLoading(false);
    }
  };

  const saveSequences = async (updatedSequences: Sequence[]) => {
    setSaving(true);
    try {
      const response = await fetch('/api/sequences/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, sequences: updatedSequences }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save sequences');
      }

      // Refetch from GitHub to get the updated SHA
      await fetchSequences();
      setEditingId(null);
      setIsAdding(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save sequences');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSequence = () => {
    const newSequence: Sequence = {
      id: `sequence-${Date.now()}`,
      tierName: 'New Sequence',
      tierColor: 'blue',
      targetPersonas: 'Target personas here',
      messagingAngle: 'Messaging angle here',
      emails: [
        { emailNumber: 1, type: 'Initial Outreach', subject: '', body: '' },
        { emailNumber: 2, type: 'Follow-Up', subject: '', body: '' },
        { emailNumber: 3, type: 'Follow-Up', subject: '', body: '' },
      ],
    };

    setSequences([...sequences, newSequence]);
    setEditingId(newSequence.id);
    setIsAdding(true);
  };

  const handleDeleteSequence = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sequence?')) return;

    const updatedSequences = sequences.filter((s) => s.id !== id);
    await saveSequences(updatedSequences);
  };

  const handleUpdateSequence = (id: string, field: keyof Sequence, value: any) => {
    setSequences(
      sequences.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      )
    );
  };

  const handleUpdateEmail = (sequenceId: string, emailNumber: number, field: keyof Email, value: string) => {
    setSequences(
      sequences.map((s) =>
        s.id === sequenceId
          ? {
              ...s,
              emails: s.emails.map((e) =>
                e.emailNumber === emailNumber ? { ...e, [field]: value } : e
              ),
            }
          : s
      )
    );
  };

  const handleSave = async () => {
    const sequence = sequences.find((s) => s.id === editingId);
    if (!sequence) return;

    // Validation
    if (!sequence.tierName.trim()) {
      alert('Please enter a tier name');
      return;
    }

    for (const email of sequence.emails) {
      if (!email.subject.trim() || !email.body.trim()) {
        alert(`Please complete Email ${email.emailNumber}: subject and body are required`);
        return;
      }
    }

    await saveSequences(sequences);
  };

  const handleCancel = () => {
    if (isAdding) {
      setSequences(sequences.filter((s) => s.id !== editingId));
    } else {
      fetchSequences(); // Reload to discard changes
    }
    setEditingId(null);
    setIsAdding(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-900 font-medium">Failed to load email sequences</p>
        <p className="text-red-700 text-sm mt-1">{error}</p>
        <button
          onClick={fetchSequences}
          className="mt-3 text-sm text-red-600 hover:text-red-800 flex items-center space-x-1"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Email Sequences</span>
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Manage email sequences for different persona tiers or campaign types
          </p>
        </div>
        {canEdit && !editingId && (
          <button
            onClick={handleAddSequence}
            className="flex items-center space-x-2 px-4 py-2 bg-[#1a2647] text-white rounded-lg hover:bg-[#0f1629] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Sequence</span>
          </button>
        )}
      </div>

      {sequences.length === 0 ? (
        <div className="text-center p-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
          <Mail className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No email sequences yet</p>
          <p className="text-sm text-slate-500 mt-1">
            {canEdit
              ? 'Click "Add Sequence" to create your first email sequence'
              : 'Email sequences will appear here when added'}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sequences.map((sequence, index) => {
            const colors = tierColors[sequence.tierColor] || tierColors.blue;
            const isEditing = editingId === sequence.id;

            return (
              <div key={sequence.id} className="bg-white border border-slate-200 rounded-lg p-6">
                {/* Sequence Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3 flex-1">
                    <div className={`w-8 h-8 ${colors.bg} rounded-full flex items-center justify-center`}>
                      <span className={`${colors.text} font-bold text-sm`}>{index + 1}</span>
                    </div>
                    {isEditing ? (
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={sequence.tierName}
                          onChange={(e) => handleUpdateSequence(sequence.id, 'tierName', e.target.value)}
                          className="w-full text-lg font-semibold px-3 py-2 border border-slate-300 rounded-lg"
                          placeholder="Tier Name (e.g., TIER 1: Corporate Planning)"
                        />
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium text-slate-700">Color:</label>
                          <select
                            value={sequence.tierColor}
                            onChange={(e) => handleUpdateSequence(sequence.id, 'tierColor', e.target.value)}
                            className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                          >
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="amber">Amber</option>
                            <option value="purple">Purple</option>
                            <option value="indigo">Indigo</option>
                          </select>
                        </div>
                      </div>
                    ) : (
                      <h4 className="text-lg font-semibold text-slate-900">{sequence.tierName}</h4>
                    )}
                  </div>
                  {canEdit && !editingId && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setEditingId(sequence.id)}
                        className="p-2 text-[#1a2647] hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSequence(sequence.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Sequence Details */}
                <div className={`${colors.bg} border-l-4 ${colors.border} p-3 rounded mb-4`}>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className={`text-sm font-medium ${colors.text} block mb-1`}>
                          Target Personas:
                        </label>
                        <input
                          type="text"
                          value={sequence.targetPersonas}
                          onChange={(e) => handleUpdateSequence(sequence.id, 'targetPersonas', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          placeholder="e.g., Director/Sr. Manager of Supply Chain, Demand Planning"
                        />
                      </div>
                      <div>
                        <label className={`text-sm font-medium ${colors.text} block mb-1`}>
                          Messaging Angle:
                        </label>
                        <input
                          type="text"
                          value={sequence.messagingAngle}
                          onChange={(e) => handleUpdateSequence(sequence.id, 'messagingAngle', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          placeholder="e.g., Forecast accuracy, S&OP maturity, planning-cycle speed"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className={`text-sm font-medium ${colors.text} mb-1`}>Target Personas:</p>
                      <p className={`text-sm ${colors.text} opacity-90 mb-2`}>{sequence.targetPersonas}</p>
                      <p className={`text-sm font-medium ${colors.text} mb-1`}>Messaging Angle:</p>
                      <p className={`text-sm ${colors.text} opacity-90`}>{sequence.messagingAngle}</p>
                    </>
                  )}
                </div>

                {/* Emails */}
                <div className="space-y-3">
                  {sequence.emails.map((email) => (
                    <div key={email.emailNumber} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`${colors.badge} text-white text-xs font-bold px-2 py-1 rounded`}>
                          EMAIL {email.emailNumber}
                        </span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={email.type}
                            onChange={(e) =>
                              handleUpdateEmail(sequence.id, email.emailNumber, 'type', e.target.value)
                            }
                            className="flex-1 px-3 py-1 border border-slate-300 rounded text-sm"
                            placeholder="e.g., Initial Outreach"
                          />
                        ) : (
                          <span className="text-slate-600 text-sm">{email.type}</span>
                        )}
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 mb-1">SUBJECT:</p>
                          {isEditing ? (
                            <input
                              type="text"
                              value={email.subject}
                              onChange={(e) =>
                                handleUpdateEmail(sequence.id, email.emailNumber, 'subject', e.target.value)
                              }
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-mono"
                              placeholder="Email subject line"
                            />
                          ) : (
                            <p className="text-sm font-mono bg-slate-50 p-2 rounded border border-slate-200">
                              {email.subject}
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 mb-1">BODY:</p>
                          {isEditing ? (
                            <textarea
                              value={email.body}
                              onChange={(e) =>
                                handleUpdateEmail(sequence.id, email.emailNumber, 'body', e.target.value)
                              }
                              rows={10}
                              className="w-full px-3 py-3 border border-slate-300 rounded-lg text-sm font-mono"
                              placeholder="Email body"
                            />
                          ) : (
                            <div className="text-sm bg-slate-50 p-3 rounded border border-slate-200 font-mono whitespace-pre-wrap">
                              {email.body}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit Actions */}
                {isEditing && (
                  <div className="flex items-center justify-end space-x-3 mt-4 pt-4 border-t border-slate-200">
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Sequence</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
