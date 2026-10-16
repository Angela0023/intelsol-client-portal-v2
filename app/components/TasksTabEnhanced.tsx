'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useEditMode } from './EditModeContext';
import {
  CheckSquare, Square, Trash2, Plus, Save, User, Calendar, Loader, RefreshCw,
  Edit2, MessageSquare, X, Send, GripVertical, ChevronDown, ChevronUp, Filter,
  Building2, Clock, AlertCircle
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface TaskComment {
  id: string;
  text: string;
  createdAt: string;
  createdBy: string;
}

export interface Task {
  id: string;
  description: string;
  assignedTo: 'Matej' | 'Frosina' | 'Filip';
  status: 'pending' | 'done';
  dueDate: string;
  order?: number;
  comments?: TaskComment[];
  client?: string; // NEW: Which client this task is for
  completedAt?: string; // NEW: When task was marked done
}

interface TasksTabProps {
  clientId: string;
  defaultTasks: Task[];
}

// Available clients for dropdown
const ALL_CLIENTS = [
  { id: 'adsigner', name: 'AdSigner' },
  { id: 'beeit', name: 'BeeIT' },
  { id: 'birografika', name: 'Birografika' },
  { id: 'bmevents', name: 'BM Events' },
  { id: 'clevercraft', name: 'CleverCraft' },
  { id: 'demo', name: 'Demo' },
  { id: 'dhm', name: 'DHM' },
  { id: 'eblissai', name: 'eBliss AI' },
  { id: 'integraplast', name: 'Integraplast' },
  { id: 'intelsol', name: 'IntElsol' },
  { id: 'intera', name: 'Intera' },
  { id: 'mbedtronix', name: 'MBEDTronix' },
  { id: 'morefromfood', name: 'MoreFromFood' },
  { id: 'mountaindrop', name: 'MountainDrop' },
  { id: 'pacia', name: 'PACIA' },
  { id: 'panorate', name: 'Panorate' },
  { id: 'peoplefocus', name: 'PeopleFocus' },
  { id: 'plantryx', name: 'Plantryx' },
  { id: 'prtronic', name: 'PrTronic' },
  { id: 'selekcija', name: 'Selekcija' },
  { id: 'seyens', name: 'Seyens' },
  { id: 'stojkov', name: 'Stojkov' },
  { id: 'tslab', name: 'TS Lab' },
  { id: 'wulf', name: 'Wulf' },
  { id: 'xpose', name: 'Xpose' },
  { id: 'zen2fit', name: 'Zen2Fit' },
];

type DateFilter = 'all' | 'overdue' | 'thisWeek' | 'thisMonth' | 'custom';

// Sortable Task Item Component (same as before, with added client and completion date display)
function SortableTaskItem({
  task,
  canEdit,
  editingTaskId,
  editedDescription,
  showCommentsForTask,
  newComment,
  onToggleTask,
  onDeleteTask,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditDescriptionChange,
  onToggleComments,
  onNewCommentChange,
  onAddComment,
  onDeleteComment,
}: {
  task: Task;
  canEdit: boolean;
  editingTaskId: string | null;
  editedDescription: string;
  showCommentsForTask: string | null;
  newComment: string;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onStartEdit: (task: Task) => void;
  onSaveEdit: (taskId: string) => void;
  onCancelEdit: () => void;
  onEditDescriptionChange: (value: string) => void;
  onToggleComments: (taskId: string) => void;
  onNewCommentChange: (value: string) => void;
  onAddComment: (taskId: string) => void;
  onDeleteComment: (taskId: string, commentId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, disabled: !canEdit || task.status === 'done' });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isEditing = editingTaskId === task.id;
  const showComments = showCommentsForTask === task.id;
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  const toggleCommentExpansion = (commentId: string) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // Check if overdue
  const isOverdue = task.status === 'pending' && new Date(task.dueDate) < new Date();

  // Get client name
  const clientName = task.client
    ? ALL_CLIENTS.find(c => c.id === task.client)?.name || task.client
    : 'No Client';

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`p-4 flex items-start space-x-4 hover:bg-slate-50 transition-colors border-b border-slate-100 ${
          task.status === 'done' ? 'opacity-60' : ''
        } ${isOverdue ? 'bg-red-50' : ''}`}
      >
        {/* Drag Handle */}
        {canEdit && task.status === 'pending' && (
          <button
            className="flex-shrink-0 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 mt-1"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5" />
          </button>
        )}

        {/* Checkbox */}
        <button
          onClick={() => onToggleTask(task.id)}
          disabled={!canEdit}
          className={`flex-shrink-0 mt-1 ${canEdit ? 'cursor-pointer' : 'cursor-default'}`}
        >
          {task.status === 'done' ? (
            <CheckSquare className="w-5 h-5 text-green-600" />
          ) : (
            <Square className="w-5 h-5 text-slate-400" />
          )}
        </button>

        {/* Content Column */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Description */}
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editedDescription}
                onChange={(e) => onEditDescriptionChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a2647] focus:border-transparent outline-none"
                placeholder="Task description..."
              />
              <button
                onClick={() => onSaveEdit(task.id)}
                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Save"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={onCancelEdit}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <p
                className={`text-sm font-medium ${
                  task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-900'
                }`}
              >
                {task.description}
              </p>
              {/* Completion date */}
              {task.status === 'done' && task.completedAt && (
                <p className="text-xs text-slate-500 flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>Completed: {new Date(task.completedAt).toLocaleDateString()}</span>
                </p>
              )}
            </div>
          )}

          {/* Comments Section */}
          {showComments && (
            <div className="bg-slate-50 rounded-lg p-3 space-y-3">
              {task.comments && task.comments.length > 0 && (
                <div className="space-y-2">
                  {task.comments.map((comment) => {
                    const isExpanded = expandedComments.has(comment.id);
                    const isLongComment = comment.text.length > 150;

                    return (
                      <div key={comment.id} className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm text-slate-900 ${!isExpanded && isLongComment ? 'line-clamp-3' : ''}`}>
                              {comment.text}
                            </p>
                            {isLongComment && (
                              <button
                                onClick={() => toggleCommentExpansion(comment.id)}
                                className="text-xs text-[#1a2647] hover:text-[#2a3757] mt-1 flex items-center gap-1 font-medium"
                              >
                                {isExpanded ? (
                                  <>
                                    <ChevronUp className="w-3 h-3" />
                                    Show less
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown className="w-3 h-3" />
                                    Show more
                                  </>
                                )}
                              </button>
                            )}
                            <p className="text-xs text-slate-500 mt-1">
                              {comment.createdBy} • {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {canEdit && (
                            <button
                              onClick={() => onDeleteComment(task.id, comment.id)}
                              className="text-slate-400 hover:text-red-600 transition-colors flex-shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {canEdit && (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => onNewCommentChange(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a2647] focus:border-transparent outline-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && newComment.trim()) {
                        onAddComment(task.id);
                      }
                    }}
                  />
                  <button
                    onClick={() => onAddComment(task.id)}
                    disabled={!newComment.trim()}
                    className="p-2 bg-[#1a2647] text-white rounded-lg hover:bg-[#2a3757] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Client badge */}
        <div className="flex items-center space-x-1.5 flex-shrink-0 mt-1">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {clientName}
          </span>
        </div>

        {/* Assignee badge */}
        <div className="flex items-center space-x-1.5 flex-shrink-0 mt-1">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              task.assignedTo === 'Matej'
                ? 'bg-blue-100 text-blue-700'
                : task.assignedTo === 'Frosina'
                ? 'bg-purple-100 text-purple-700'
                : task.assignedTo === 'Filip'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {task.assignedTo}
          </span>
        </div>

        {/* Due date with overdue indicator */}
        <div className="flex items-center space-x-1.5 flex-shrink-0 mt-1">
          {isOverdue && <AlertCircle className="w-3.5 h-3.5 text-red-600" />}
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
            {task.dueDate}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1 flex-shrink-0 mt-1">
          <button
            onClick={() => onToggleComments(task.id)}
            className={`p-1 rounded transition-colors relative ${
              showComments
                ? 'text-[#1a2647] bg-blue-50'
                : 'text-slate-400 hover:text-[#1a2647]'
            }`}
            title={`${task.comments?.length || 0} comment(s)`}
          >
            <MessageSquare className="w-4 h-4" />
            {task.comments && task.comments.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#1a2647] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {task.comments.length}
              </span>
            )}
          </button>

          {canEdit && !isEditing && (
            <button
              onClick={() => onStartEdit(task)}
              className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

          {canEdit && (
            <button
              onClick={() => onDeleteTask(task.id)}
              className="p-1 text-slate-400 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TasksTabEnhanced({ clientId, defaultTasks }: TasksTabProps) {
  const { editMode, isAdmin } = useEditMode();
  const canEdit = editMode && isAdmin;

  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dirty, setDirty] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    description: '',
    assignedTo: 'Matej',
    status: 'pending',
    dueDate: '',
    order: 0,
    comments: [],
    client: clientId,
  });

  // Filter states
  const [filterAssignee, setFilterAssignee] = useState<'all' | 'Matej' | 'Frosina' | 'Filip'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'done'>('all');
  const [filterClient, setFilterClient] = useState<'all' | string>('all');
  const [filterDate, setFilterDate] = useState<DateFilter>('all');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);

  // Edit task state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedDescription, setEditedDescription] = useState('');

  // Comments state
  const [showCommentsForTask, setShowCommentsForTask] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper function to check if date is in range
  const isDateInRange = (date: string, filter: DateFilter): boolean => {
    const taskDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case 'overdue':
        return taskDate < today;
      case 'thisWeek': {
        const weekFromNow = new Date(today);
        weekFromNow.setDate(weekFromNow.getDate() + 7);
        return taskDate >= today && taskDate <= weekFromNow;
      }
      case 'thisMonth': {
        const monthFromNow = new Date(today);
        monthFromNow.setMonth(monthFromNow.getMonth() + 1);
        return taskDate >= today && taskDate <= monthFromNow;
      }
      case 'custom': {
        if (!customDateRange.start || !customDateRange.end) return true;
        const start = new Date(customDateRange.start);
        const end = new Date(customDateRange.end);
        return taskDate >= start && taskDate <= end;
      }
      default:
        return true;
    }
  };

  // Apply filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Assignee filter
      if (filterAssignee !== 'all' && task.assignedTo !== filterAssignee) return false;

      // Status filter
      if (filterStatus !== 'all' && task.status !== filterStatus) return false;

      // Client filter
      if (filterClient !== 'all' && task.client !== filterClient) return false;

      // Date filter
      if (filterDate !== 'all' && !isDateInRange(task.dueDate, filterDate)) return false;

      return true;
    });
  }, [tasks, filterAssignee, filterStatus, filterClient, filterDate, customDateRange]);

  // Sort filtered tasks
  const sortedTasks = useMemo(() => {
    const pending = filteredTasks
      .filter((t) => t.status === 'pending')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const done = filteredTasks
      .filter((t) => t.status === 'done')
      .sort((a, b) => {
        // Sort by completion date if available, otherwise by due date
        const dateA = a.completedAt ? new Date(a.completedAt) : new Date(a.dueDate);
        const dateB = b.completedAt ? new Date(b.completedAt) : new Date(b.dueDate);
        return dateB.getTime() - dateA.getTime(); // Most recent first
      });

    return [...pending, ...done];
  }, [filteredTasks]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterAssignee !== 'all') count++;
    if (filterStatus !== 'all') count++;
    if (filterClient !== 'all') count++;
    if (filterDate !== 'all') count++;
    return count;
  }, [filterAssignee, filterStatus, filterClient, filterDate]);

  // Clear all filters
  const clearFilters = () => {
    setFilterAssignee('all');
    setFilterStatus('all');
    setFilterClient('all');
    setFilterDate('all');
    setCustomDateRange({ start: '', end: '' });
  };

  // Fetch tasks from GitHub
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/tasks/get?clientId=${clientId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load tasks');
      }

      // Migrate tasks to new structure
      const migratedTasks = data.tasks.map((task: Task, index: number) => ({
        ...task,
        order: task.order ?? index,
        comments: task.comments ?? [],
        client: task.client || null,
        completedAt: task.completedAt || null,
      }));

      setTasks(migratedTasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleTask = useCallback((taskId: string) => {
    if (!canEdit) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newStatus = t.status === 'done' ? 'pending' : 'done';
          return {
            ...t,
            status: newStatus,
            completedAt: newStatus === 'done' ? new Date().toISOString() : undefined
          };
        }
        return t;
      })
    );
    setDirty(true);
  }, [canEdit]);

  const handleDeleteTask = useCallback((taskId: string) => {
    if (!canEdit) return;
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      setDirty(true);
    }
  }, [canEdit]);

  const handleAddTask = useCallback(() => {
    if (!newTask.description.trim() || !newTask.dueDate) return;

    const pendingTasks = tasks.filter((t) => t.status === 'pending');
    const maxOrder = pendingTasks.length > 0
      ? Math.max(...pendingTasks.map((t) => t.order ?? 0))
      : -1;

    const task: Task = {
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      ...newTask,
      order: maxOrder + 1,
      comments: [],
    };
    setTasks((prev) => [...prev, task]);
    setNewTask({
      description: '',
      assignedTo: 'Matej',
      status: 'pending',
      dueDate: '',
      order: 0,
      comments: [],
      client: clientId
    });
    setShowAddForm(false);
    setDirty(true);
  }, [newTask, tasks, clientId]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    setTasks((items) => {
      const pendingTasks = items.filter((t) => t.status === 'pending');
      const doneTasks = items.filter((t) => t.status === 'done');

      const oldIndex = pendingTasks.findIndex((t) => t.id === active.id);
      const newIndex = pendingTasks.findIndex((t) => t.id === over.id);

      if (oldIndex === -1 || newIndex === -1) return items;

      const reordered = arrayMove(pendingTasks, oldIndex, newIndex).map((t, idx) => ({
        ...t,
        order: idx,
      }));

      setDirty(true);
      return [...reordered, ...doneTasks];
    });
  }, []);

  const handleStartEdit = useCallback((task: Task) => {
    setEditingTaskId(task.id);
    setEditedDescription(task.description);
  }, []);

  const handleSaveEdit = useCallback((taskId: string) => {
    if (!editedDescription.trim()) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, description: editedDescription } : t
      )
    );
    setEditingTaskId(null);
    setEditedDescription('');
    setDirty(true);
  }, [editedDescription]);

  const handleCancelEdit = useCallback(() => {
    setEditingTaskId(null);
    setEditedDescription('');
  }, []);

  const handleToggleComments = useCallback((taskId: string) => {
    setShowCommentsForTask((prev) => (prev === taskId ? null : taskId));
    setNewComment('');
  }, []);

  const handleAddComment = useCallback((taskId: string) => {
    if (!newComment.trim()) return;

    const comment: TaskComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      text: newComment,
      createdAt: new Date().toISOString(),
      createdBy: isAdmin ? 'Admin' : 'User',
    };

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, comments: [...(t.comments || []), comment] }
          : t
      )
    );
    setNewComment('');
    setDirty(true);
  }, [newComment, isAdmin]);

  const handleDeleteComment = useCallback((taskId: string, commentId: string) => {
    if (!canEdit) return;
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, comments: (t.comments || []).filter((c) => c.id !== commentId) }
          : t
      )
    );
    setDirty(true);
  }, [canEdit]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError('');

    try {
      const response = await fetch('/api/tasks/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, tasks }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save tasks');
      }

      setDirty(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save tasks');
    } finally {
      setSaving(false);
    }
  }, [clientId, tasks]);

  const pendingCount = filteredTasks.filter((t) => t.status === 'pending').length;
  const doneCount = filteredTasks.filter((t) => t.status === 'done').length;
  const overdueCount = filteredTasks.filter((t) =>
    t.status === 'pending' && new Date(t.dueDate) < new Date()
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-900 font-medium">Error</p>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <button
            onClick={fetchTasks}
            className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center space-x-1"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Total Tasks</p>
          <p className="text-2xl font-bold text-slate-900">{filteredTasks.length}</p>
          {activeFiltersCount > 0 && (
            <p className="text-xs text-slate-500 mt-1">of {tasks.length} total</p>
          )}
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">{doneCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-900">Filters</h3>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                {activeFiltersCount} active
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="text-sm text-[#1a2647] hover:text-[#2a3757] flex items-center space-x-1"
            >
              <span>{showFilters ? 'Hide' : 'Show'} filters</span>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
            {/* Assignee filter */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Assignee</label>
              <select
                value={filterAssignee}
                onChange={(e) => setFilterAssignee(e.target.value as typeof filterAssignee)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a2647] focus:border-transparent outline-none"
              >
                <option value="all">All SNEs</option>
                <option value="Matej">Matej</option>
                <option value="Frosina">Frosina</option>
                <option value="Filip">Filip</option>
              </select>
            </div>

            {/* Status filter */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a2647] focus:border-transparent outline-none"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="done">Completed</option>
              </select>
            </div>

            {/* Client filter */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Client</label>
              <select
                value={filterClient}
                onChange={(e) => setFilterClient(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a2647] focus:border-transparent outline-none"
              >
                <option value="all">All Clients</option>
                {ALL_CLIENTS.map((client) => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>

            {/* Date filter */}
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Due Date</label>
              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value as DateFilter)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a2647] focus:border-transparent outline-none"
              >
                <option value="all">All Dates</option>
                <option value="overdue">Overdue</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>

            {/* Custom date range (shown when custom is selected) */}
            {filterDate === 'custom' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">From</label>
                  <input
                    type="date"
                    value={customDateRange.start}
                    onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a2647] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">To</label>
                  <input
                    type="date"
                    value={customDateRange.end}
                    onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a2647] focus:border-transparent outline-none"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Quick filter shortcuts */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200">
          <button
            onClick={() => {
              setFilterStatus('pending');
              setFilterDate('all');
            }}
            className="px-3 py-1 text-xs font-medium bg-amber-50 text-amber-700 rounded-full hover:bg-amber-100 transition-colors"
          >
            My Pending Tasks
          </button>
          <button
            onClick={() => {
              setFilterStatus('pending');
              setFilterDate('overdue');
            }}
            className="px-3 py-1 text-xs font-medium bg-red-50 text-red-700 rounded-full hover:bg-red-100 transition-colors"
          >
            Overdue Tasks
          </button>
          <button
            onClick={() => {
              setFilterStatus('pending');
              setFilterDate('thisWeek');
            }}
            className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100 transition-colors"
          >
            Due This Week
          </button>
          <button
            onClick={() => {
              setFilterStatus('done');
              setFilterDate('all');
            }}
            className="px-3 py-1 text-xs font-medium bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition-colors"
          >
            Recently Completed
          </button>
        </div>
      </div>

      {/* Task list */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Tasks</h3>
          <div className="flex items-center space-x-2">
            {canEdit && dirty && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save</span>
                  </>
                )}
              </button>
            )}
            {canEdit && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-[#1a2647] text-white text-sm rounded-lg hover:bg-[#2a3757] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Task</span>
              </button>
            )}
          </div>
        </div>

        {/* Add task form */}
        {canEdit && showAddForm && (
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Task description..."
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a2647] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <select
                  value={newTask.assignedTo}
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value as 'Matej' | 'Frosina' | 'Filip' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a2647] focus:border-transparent outline-none"
                >
                  <option value="Matej">Matej</option>
                  <option value="Frosina">Frosina</option>
                  <option value="Filip">Filip</option>
                </select>
              </div>
              <div>
                <select
                  value={newTask.client || ''}
                  onChange={(e) => setNewTask({ ...newTask, client: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a2647] focus:border-transparent outline-none"
                >
                  <option value="">No Client</option>
                  {ALL_CLIENTS.map((client) => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex space-x-2">
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a2647] focus:border-transparent outline-none"
                />
                <button
                  onClick={handleAddTask}
                  disabled={!newTask.description.trim() || !newTask.dueDate}
                  className="px-3 py-2 bg-[#1a2647] text-white text-sm rounded-lg hover:bg-[#2a3757] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedTasks.filter((t) => t.status === 'pending').map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div>
              {sortedTasks.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No tasks match your filters. {activeFiltersCount > 0 && 'Try adjusting the filters.'}
                </div>
              ) : (
                sortedTasks.map((task) => (
                  <SortableTaskItem
                    key={task.id}
                    task={task}
                    canEdit={canEdit}
                    editingTaskId={editingTaskId}
                    editedDescription={editedDescription}
                    showCommentsForTask={showCommentsForTask}
                    newComment={newComment}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                    onStartEdit={handleStartEdit}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
                    onEditDescriptionChange={setEditedDescription}
                    onToggleComments={handleToggleComments}
                    onNewCommentChange={setNewComment}
                    onAddComment={handleAddComment}
                    onDeleteComment={handleDeleteComment}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
