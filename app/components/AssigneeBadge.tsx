'use client';

import { type Assignee } from '../../lib/auth';
import { User } from 'lucide-react';

interface AssigneeBadgeProps {
  assignee: Assignee | null;
  size?: 'sm' | 'md' | 'lg';
}

export default function AssigneeBadge({ assignee, size = 'md' }: AssigneeBadgeProps) {
  if (!assignee) return null;

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

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 font-medium rounded-full ${sizeClasses[size]}`}
    >
      <User className={iconSizes[size]} />
      <span>{assignee}</span>
    </div>
  );
}
