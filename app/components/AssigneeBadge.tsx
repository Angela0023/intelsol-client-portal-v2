'use client';

import { type Assignee } from '../../lib/auth';
import { User } from 'lucide-react';
import { useEditMode } from './EditModeContext';

const allAssignees: Assignee[] = ['Frosina', 'Matej', 'Filip'];

interface AssigneeBadgeProps {
  assignee: Assignee | null;
  onAssigneeChange?: (newAssignee: Assignee) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function AssigneeBadge({ assignee, onAssigneeChange, size = 'md' }: AssigneeBadgeProps) {
  const { editMode, isAdmin } = useEditMode();
  const canEdit = editMode && isAdmin && onAssigneeChange;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (!assignee && !canEdit) return null;

  if (canEdit) {
    return (
      <div
        className="relative inline-block"
        onClick={(e) => e.preventDefault()}
        onClickCapture={(e) => e.stopPropagation()}
      >
        <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 font-medium rounded-full pr-7">
          <User className={`${iconSizes[size]} ml-3`} />
          <select
            value={assignee || ''}
            onChange={(e) => onAssigneeChange(e.target.value as Assignee)}
            className={`${sizeClasses[size]} font-medium bg-transparent border-none appearance-none cursor-pointer focus:outline-none`}
          >
            {!assignee && <option value="">Select...</option>}
            {allAssignees.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <svg
          className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none opacity-60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    );
  }

  if (!assignee) return null;

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 font-medium rounded-full ${sizeClasses[size]}`}
    >
      <User className={iconSizes[size]} />
      <span>{assignee}</span>
    </div>
  );
}

// Helper to get/set assignee from localStorage
export function getStoredAssignee(clientId: string, defaultAssignee: Assignee | null): Assignee | null {
  if (typeof window === 'undefined') return defaultAssignee;
  const stored = localStorage.getItem(`intelsol_assignee_${clientId}`);
  if (stored === 'Frosina' || stored === 'Matej' || stored === 'Filip') {
    return stored;
  }
  return defaultAssignee;
}

export function setStoredAssignee(clientId: string, assignee: Assignee): void {
  localStorage.setItem(`intelsol_assignee_${clientId}`, assignee);
}
