'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useEditMode } from './EditModeContext';
import { CheckSquare, Square, Trash2, Plus, Save, User, Calendar, Loader, RefreshCw, Edit2, MessageSquare, X, Send, GripVertical } from 'lucide-react';
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
  assignedTo: 'Matej' | 'Frosina';
  status: 'pending' | 'done';
  dueDate: string;
  order?: number;
  comments?: TaskComment[];
}

interface TasksTabProps {
  clientId: string;
  defaultTasks: Task[];
}

// Sortable Task Item Component
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

  return (
    <div ref={setNodeRef} style={style}>
      <div
        className={`p-4 flex items-start space-x-4 hover:bg-slate-50 transition-colors border-b border-slate-100 ${
          task.status === 'done' ? 'opacity-60' : ''
        }`}
      >
        {/* Drag Handle - only show for pending tasks when in edit mode */}
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
            <p
              className={`text-sm font-medium ${
                task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-900'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Comments Section */}
          {showComments && (
            <div className="bg-slate-50 rounded-lg p-3 space-y-3">
              {/* Existing Comments */}
              {task.comments && task.comments.length > 0 && (
                <div className="space-y-2">
                  {task.comments.map((comment) => (
                    <div key={comment.id} className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-slate-900">{comment.text}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            {comment.createdBy} • {new Date(comment.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {canEdit && (
                          <button
                            onClick={() => onDeleteComment(task.id, comment.id)}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
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

        {/* Assignee badge */}
        <div className="flex items-center space-x-1.5 flex-shrink-0 mt-1">
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              task.assignedTo === 'Matej'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-purple-100 text-purple-700'
            }`}
          >
            {task.assignedTo}
          </span>
        </div>

        {/* Due date */}
        <div className="flex items-center space-x-1.5 flex-shrink-0 mt-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">{task.dueDate}</span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-1 flex-shrink-0 mt-1">
          {/* Comments toggle */}
          <button
            onClick={() => onToggleComments(task.id)}
            className={`p-1 rounded transition-colors ${
              showComments
                ? 'text-[#1a2647] bg-blue-50'
                : 'text-slate-400 hover:text-[#1a2647]'
            }`}
            title={`${task.comments?.length || 0} comment(s)`}
          >
            <MessageSquare className="w-4 h-4" />
            {task.comments && task.comments.length > 0 && (
              <span className="absolute -mt-2 -mr-1 bg-[#1a2647] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {task.comments.length}
              </span>
            )}
          </button>

          {/* Edit */}
          {canEdit && !isEditing && (
            <button
              onClick={() => onStartEdit(task)}
              className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
              title="Edit"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}

          {/* Delete */}
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

export default function TasksTab({ clientId, defaultTasks }: TasksTabProps) {
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
  });

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

  // Sort tasks: pending first (by order), then completed (by date, oldest first)
  const sortedTasks = useMemo(() => {
    const pending = tasks
      .filter((t) => t.status === 'pending')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    const done = tasks
      .filter((t) => t.status === 'done')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    return [...pending, ...done];
  }, [tasks]);

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

      // Migrate tasks to new structure if needed
      const migratedTasks = data.tasks.map((task: Task, index: number) => ({
        ...task,
        order: task.order ?? index,
        comments: task.comments ?? [],
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
          return { ...t, status: newStatus };
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
    setNewTask({ description: '', assignedTo: 'Matej', status: 'pending', dueDate: '', order: 0, comments: [] });
    setShowAddForm(false);
    setDirty(true);
  }, [newTask, tasks]);

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

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const doneCount = tasks.filter((t) => t.status === 'done').length;

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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Total Tasks</p>
          <p className="text-2xl font-bold text-slate-900">{tasks.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
          <p className="text-sm text-slate-600 mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">{doneCount}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
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
                  onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value as 'Matej' | 'Frosina' })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1a2647] focus:border-transparent outline-none"
                >
                  <option value="Matej">Matej</option>
                  <option value="Frosina">Frosina</option>
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
                  No tasks yet. {canEdit && 'Click "Add Task" to create one.'}
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

// Default tasks per client
export const XPOSE_DEFAULT_TASKS: Task[] = [
  {
    id: 'xpose_1',
    description: 'Launch Tier 2 campaign targeting mid-size dermatology clinics',
    assignedTo: 'Matej',
    status: 'pending',
    dueDate: '2026-06-02',
    order: 0,
    comments: [],
  },
  {
    id: 'xpose_2',
    description: 'Review ad detection enrichment accuracy in Clay',
    assignedTo: 'Frosina',
    status: 'pending',
    dueDate: '2026-06-06',
    order: 1,
    comments: [],
  },
  {
    id: 'xpose_3',
    description: 'Export verified leads to SmartLead for sequencing',
    assignedTo: 'Matej',
    status: 'done',
    dueDate: '2026-05-23',
    order: 2,
    comments: [],
  },
];

export const TSLAB_DEFAULT_TASKS: Task[] = [
  {
    id: 'tslab_1',
    description: 'Run ICP matching once Anthropic credits are added',
    assignedTo: 'Matej',
    status: 'pending',
    dueDate: '2026-06-04',
    order: 0,
    comments: [],
  },
  {
    id: 'tslab_2',
    description: 'Build lead list for remaining EU countries (Sweden, Norway, Ireland)',
    assignedTo: 'Frosina',
    status: 'pending',
    dueDate: '2026-06-10',
    order: 1,
    comments: [],
  },
  {
    id: 'tslab_3',
    description: 'Verify Apollo enrichment quality for UK leads batch',
    assignedTo: 'Frosina',
    status: 'done',
    dueDate: '2026-05-20',
    order: 2,
    comments: [],
  },
];

export const BEEIT_DEFAULT_TASKS: Task[] = [
  {
    id: 'beeit_1',
    description: 'Review Track B ICP documentation with client',
    assignedTo: 'Matej',
    status: 'pending',
    dueDate: '2026-06-03',
    order: 0,
    comments: [],
  },
  {
    id: 'beeit_2',
    description: 'Start Tier 2 agency scraping for Benelux region',
    assignedTo: 'Frosina',
    status: 'pending',
    dueDate: '2026-06-09',
    order: 1,
    comments: [],
  },
  {
    id: 'beeit_3',
    description: 'Set up Clay table for DACH market Tier 1 agencies',
    assignedTo: 'Matej',
    status: 'pending',
    dueDate: '2026-06-12',
    order: 2,
    comments: [],
  },
];

export const INTELSOL_DEFAULT_TASKS: Task[] = [
  {
    id: 'intelsol_1',
    description: 'Set up SmartLead API integration for campaign tracking',
    assignedTo: 'Matej',
    status: 'pending',
    dueDate: '2026-06-01',
    order: 0,
    comments: [],
  },
  {
    id: 'intelsol_2',
    description: 'Review campaign performance for week 1 and adjust messaging',
    assignedTo: 'Matej',
    status: 'pending',
    dueDate: '2026-06-05',
    order: 1,
    comments: [],
  },
  {
    id: 'intelsol_3',
    description: 'Prepare lead export report for monthly review',
    assignedTo: 'Frosina',
    status: 'pending',
    dueDate: '2026-06-08',
    order: 2,
    comments: [],
  },
];
