'use client';

import { useEditMode } from './EditModeContext';

export type ClientStatus = 'Active' | 'Onboarding' | 'Completed';

const statusStyles: Record<ClientStatus, string> = {
  Active: 'bg-green-100 text-green-700 border-green-200',
  Onboarding: 'bg-amber-100 text-amber-700 border-amber-200',
  Completed: 'bg-slate-100 text-slate-600 border-slate-200',
};

const allStatuses: ClientStatus[] = ['Active', 'Onboarding', 'Completed'];

interface StatusBadgeProps {
  status: ClientStatus;
  onStatusChange?: (newStatus: ClientStatus) => void;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, onStatusChange, size = 'sm' }: StatusBadgeProps) {
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
          onChange={(e) => onStatusChange(e.target.value as ClientStatus)}
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

// Helper to get/set status from localStorage
export function getClientStatus(clientId: string, defaultStatus: ClientStatus): ClientStatus {
  if (typeof window === 'undefined') return defaultStatus;
  const stored = localStorage.getItem(`intelsol_status_${clientId}`);
  if (stored === 'Active' || stored === 'Onboarding' || stored === 'Completed') {
    return stored;
  }
  return defaultStatus;
}

export function setClientStatus(clientId: string, status: ClientStatus): void {
  localStorage.setItem(`intelsol_status_${clientId}`, status);
}

// Default statuses
export const DEFAULT_STATUSES: Record<string, ClientStatus> = {
  demo: 'Active',
  xpose: 'Active',
  tslab: 'Active',
  adsigner: 'Onboarding',
  beeit: 'Onboarding',
  intelsol: 'Active',
  wulf: 'Onboarding',
  plantryx: 'Onboarding',
  mountaindrop: 'Onboarding',
  eblissai: 'Onboarding',
};
