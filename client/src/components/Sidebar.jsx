import React, { useState } from 'react';
import { api } from '../services/api';
import { FolderGit2, Plus, Hash, Users, Sparkles } from 'lucide-react';

export function Sidebar({ projects, selectedProject, onSelectProject, onProjectCreated, onToast }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.createProject(name, description);
            onToast?.(`Project "${name}" created! You were added as member.`, 'success');
            setName('');
            setDescription('');
            setShowCreateModal(false);
            onProjectCreated?.(res.data);
        } catch (err) {
            onToast?.(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <aside className="w-64 border-r border-slate-800 bg-slate-900/40 p-4 flex flex-col justify-between shrink-0">
            <div>
                {/* Header with Add Button */}
                <div className="flex items-center justify-between px-2 mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
                        Projects (Scoped)
                    </span>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="p-1 rounded-md bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white transition"
                        title="Create Project (Requires project:create)"
                    >
                        <Plus className="w-3.5 h-3.5" />
                    </button>
                </div>

                {/* Project List */}
                <div className="space-y-1">
                    {projects.length === 0 ? (
                        <div className="px-3 py-6 text-center border border-dashed border-slate-800 rounded-xl">
                            <p className="text-xs text-slate-500">No projects visible</p>
                            <p className="text-[10px] text-slate-600 mt-1">Create one or ask to be assigned</p>
                        </div>
                    ) : (
                        projects.map((proj) => {
                            const isSelected = selectedProject?.id === proj.id;
                            return (
                                <button
                                    key={proj.id}
                                    onClick={() => onSelectProject(proj)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition text-left ${
                                        isSelected
                                            ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        <Hash className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                                        <span className="truncate">{proj.name}</span>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Scoping Info Footer */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center gap-2 text-blue-400 text-xs font-semibold mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>RBAC Visibility</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                    Projects are strictly scoped. Only members assigned in <code className="text-blue-300">project_members</code> can view this board.
                </p>
            </div>

            {/* Create Project Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                        <h3 className="text-base font-bold text-white mb-1">Create Project</h3>
                        <p className="text-xs text-slate-400 mb-4">
                            Requires the <code className="text-blue-400">project:create</code> permission.
                        </p>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">Project Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Iron Suit Mark III"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">Description (Optional)</label>
                                <textarea
                                    rows={2}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Brief summary..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition"
                                >
                                    {loading ? 'Creating...' : 'Create Project'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </aside>
    );
}
