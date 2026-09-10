import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
    Plus, 
    Trash2, 
    Users, 
    ArrowRight, 
    ArrowLeft, 
    CheckCircle2, 
    Clock, 
    Circle,
    UserPlus
} from 'lucide-react';

const COLUMNS = [
    { key: 'todo', label: 'To Do', icon: Circle, color: 'border-blue-500/40 text-blue-400 bg-blue-500/10' },
    { key: 'in_progress', label: 'In Progress', icon: Clock, color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
    { key: 'done', label: 'Done', icon: CheckCircle2, color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' }
];

export function KanbanBoard({ project, onToast }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showNewTaskModal, setShowNewTaskModal] = useState(false);
    const [showTeamModal, setShowTeamModal] = useState(false);

    // New task form state
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [taskStatus, setTaskStatus] = useState('todo');

    // Add teammate form state
    const [teammateId, setTeammateId] = useState('');

    const fetchTasks = async () => {
        if (!project?.id) return;
        setLoading(true);
        try {
            const res = await api.getTasksByProject(project.id);
            setTasks(res.data || []);
        } catch (err) {
            onToast?.(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [project?.id]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const res = await api.createTask(taskTitle, project.id, taskDesc, null, taskStatus);
            onToast?.('Task created successfully!', 'success');
            setTaskTitle('');
            setTaskDesc('');
            setShowNewTaskModal(false);
            fetchTasks();
        } catch (err) {
            onToast?.(err.message, 'error');
        }
    };

    const handleStatusMove = async (task, newStatus) => {
        try {
            await api.updateTask(task.id, { status: newStatus });
            onToast?.(`Task moved to ${newStatus}!`, 'success');
            fetchTasks();
        } catch (err) {
            onToast?.(err.message, 'error');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await api.deleteTask(taskId);
            onToast?.('Task deleted!', 'success');
            fetchTasks();
        } catch (err) {
            onToast?.(err.message, 'error');
        }
    };

    const handleAddTeammate = async (e) => {
        e.preventDefault();
        try {
            await api.addProjectMember(project.id, teammateId);
            onToast?.('Teammate added to project! They can now view this board.', 'success');
            setTeammateId('');
            setShowTeamModal(false);
        } catch (err) {
            onToast?.(err.message, 'error');
        }
    };

    if (!project) {
        return (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-slate-500">
                <div>
                    <h3 className="text-sm font-semibold text-slate-400">No project selected</h3>
                    <p className="text-xs mt-1">Select a project from the sidebar to view its board</p>
                </div>
            </div>
        );
    }

    return (
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-950">
            {/* Project Header Bar */}
            <div className="px-8 py-5 border-b border-slate-800 bg-slate-900/30 flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-white tracking-tight">{project.name}</h2>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-mono">
                            {project.id.slice(0, 8)}...
                        </span>
                    </div>
                    {project.description && (
                        <p className="text-xs text-slate-400 mt-0.5">{project.description}</p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowTeamModal(true)}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition"
                    >
                        <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                        Add Teammate
                    </button>

                    <button
                        onClick={() => setShowNewTaskModal(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition"
                    >
                        <Plus className="w-4 h-4" />
                        New Task
                    </button>
                </div>
            </div>

            {/* Kanban Columns */}
            <div className="flex-1 overflow-x-auto p-8 flex gap-6">
                {COLUMNS.map((col) => {
                    const colTasks = tasks.filter((t) => t.status === col.key);
                    const ColIcon = col.icon;

                    return (
                        <div
                            key={col.key}
                            className="w-80 shrink-0 bg-slate-900/50 border border-slate-800/80 rounded-2xl flex flex-col max-h-full"
                        >
                            {/* Column Header */}
                            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ColIcon className={`w-4 h-4 ${col.color.split(' ')[1]}`} />
                                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                                        {col.label}
                                    </span>
                                </div>
                                <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
                                    {colTasks.length}
                                </span>
                            </div>

                            {/* Task Cards Container */}
                            <div className="p-3 flex-1 overflow-y-auto space-y-3">
                                {colTasks.length === 0 ? (
                                    <div className="py-8 text-center border border-dashed border-slate-800/60 rounded-xl">
                                        <p className="text-xs text-slate-600">No tasks in {col.label}</p>
                                    </div>
                                ) : (
                                    colTasks.map((task) => (
                                        <div
                                            key={task.id}
                                            className="p-4 bg-slate-950 border border-slate-800 rounded-xl shadow-sm hover:border-slate-700 transition group"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <h4 className="text-sm font-semibold text-slate-200 leading-snug">
                                                    {task.title}
                                                </h4>
                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded transition"
                                                    title="Delete Task"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            {task.description && (
                                                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                                    {task.description}
                                                </p>
                                            )}

                                            {/* Status Transition Actions */}
                                            <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between">
                                                <span className="text-[10px] text-slate-600 font-mono">
                                                    {task.id.slice(0, 6)}
                                                </span>

                                                <div className="flex items-center gap-1">
                                                    {col.key !== 'todo' && (
                                                        <button
                                                            onClick={() => handleStatusMove(task, col.key === 'done' ? 'in_progress' : 'todo')}
                                                            className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-900 rounded transition"
                                                            title="Move Left"
                                                        >
                                                            <ArrowLeft className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}

                                                    {col.key !== 'done' && (
                                                        <button
                                                            onClick={() => handleStatusMove(task, col.key === 'todo' ? 'in_progress' : 'done')}
                                                            className="p-1 text-slate-500 hover:text-blue-400 hover:bg-slate-900 rounded transition"
                                                            title="Move Right"
                                                        >
                                                            <ArrowRight className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* New Task Modal */}
            {showNewTaskModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
                        <h3 className="text-base font-bold text-white mb-1">Create New Task</h3>
                        <p className="text-xs text-slate-400 mb-4">
                            Requires <code className="text-blue-400">task:create</code> permission.
                        </p>
                        <form onSubmit={handleCreateTask} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                    placeholder="e.g. Build Arc Reactor Stabilizers"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={taskDesc}
                                    onChange={(e) => setTaskDesc(e.target.value)}
                                    placeholder="Task details and acceptance criteria..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">Initial Status</label>
                                <select
                                    value={taskStatus}
                                    onChange={(e) => setTaskStatus(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowNewTaskModal(false)}
                                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition"
                                >
                                    Create Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Teammate Modal */}
            {showTeamModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                        <h3 className="text-base font-bold text-white mb-1">Assign Teammate to Project</h3>
                        <p className="text-xs text-slate-400 mb-4">
                            Adding a user to <code className="text-blue-400">project_members</code> grants them access to view and collaborate on this project.
                        </p>
                        <form onSubmit={handleAddTeammate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">User ID (UUID)</label>
                                <input
                                    type="text"
                                    required
                                    value={teammateId}
                                    onChange={(e) => setTeammateId(e.target.value)}
                                    placeholder="e.g. b17752fe-bba4-48e4-b24c-..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition font-mono"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowTeamModal(false)}
                                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition"
                                >
                                    Assign Member
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
