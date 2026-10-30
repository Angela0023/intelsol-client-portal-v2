'use client';

import { useEditMode } from './EditModeContext';

export type SequenceApprovalStatus = 'Pending' | 'Confirmed';

const statusStyles: Record<SequenceApprovalStatus, string> = {
  Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Confirmed: 'bg-green-100 text-green-700 border-green-200',
};

const allStatuses: SequenceApprovalStatus[] = ['Pending', 'Confirmed'];

interface SequenceApprovalBadgeProps {
  status: SequenceApprovalStatus;
  onStatusChange?: (newStatus: SequenceApprovalStatus) => void;
  size?: 'sm' | 'md';
}

export default function SequenceApprovalBadge({ status, onStatusChange, size = 'sm' }: SequenceApprovalBadgeProps) {
  const { editMode, isAdmin } = useEditMode();
  const canEdit = editMode && isAdmin && onStatusChange;

  const sizeClasses = size === 'sm'
    ? 'px-3 py-1 text-xs'
    : 'px-4 py-1.5 text-sm';

  if (canEdit) {
    return (
      <div
        className="relative inline-block"
        onClick={(e) => e.preventDefault()}
        onClickCapture={(e) => e.stopPropagation()}
      >
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as SequenceApprovalStatus)}
          className={`${sizeClasses} font-semibold rounded-full border appearance-none cursor-pointer pr-6 ${statusStyles[status]}`}
        >
          {allStatuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    );
  }

  return (
    <span className={`${sizeClasses} font-semibold rounded-full border ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

// Helper to get/set sequence approval status from localStorage
export function getSequenceApprovalStatus(clientId: string, defaultStatus: SequenceApprovalStatus = 'Pending'): SequenceApprovalStatus {
  if (typeof window === 'undefined') return defaultStatus;
  const stored = localStorage.getItem(`intelsol_sequences_approval_${clientId}`);
  if (stored === 'Pending' || stored === 'Confirmed') {
    return stored;
  }
  return defaultStatus;
}

export function setSequenceApprovalStatus(clientId: string, status: SequenceApprovalStatus): void {
  localStorage.setItem(`intelsol_sequences_approval_${clientId}`, status);
}
