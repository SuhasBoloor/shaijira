import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
    Crown, 
    Database, 
    RefreshCw, 
    Building2, 
    Users, 
    FolderGit2, 
    CheckSquare, 
    Key,
    ShieldAlert,
    ChevronDown,
    ChevronRight,
    Search,
    Filter,
    CheckCircle2,
    Clock,
    CircleDot,
    User
} from 'lucide-react';

export function SuperAdminConsole({ onToast }) {
    const [statsData, setStatsData] = useState(null);
    const [overviewData, setOverviewData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [seeding, setSeeding] = useState(false);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'permissions'
    const [expandedOrgs, setExpandedOrgs] = useState({});
    const [expandedProjects, setExpandedProjects] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'todo' | 'in_progress' | 'done'

    const fetchAllAdminData = async () => {
        setLoading(true);
        try {
            const [statsRes, overviewRes] = await Promise.all([
                api.getAdminStats(),
                api.getAdminOverview().catch(() => ({ data: [] }))
            ]);
            setStatsData(statsRes);
            const orgs = overviewRes.data || [];
            setOverviewData(orgs);
            const initialOrgState = {};
            const initialProjState = {};
            orgs.forEach(o => {
                initialOrgState[o.id] = true;
                o.projects?.forEach(p => {
                    initialProjState[p.id] = true;
                });
            });
            setExpandedOrgs(initialOrgState);
            setExpandedProjects(initialProjState);
        } catch (err) {
            onToast?.(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllAdminData();
    }, []);

    const handleSeed = async () => {
        setSeeding(true);
        try {
            const res = await api.seedData();
            onToast?.(res.message || 'Permissions seeded successfully!', 'success');
            fetchAllAdminData();
        } catch (err) {
            onToast?.(err.message, 'error');
        } finally {
            setSeeding(false);
        }
    };

    const toggleOrg = (orgId) => {
        setExpandedOrgs(prev => ({ ...prev, [orgId]: !prev[orgId] }));
    };

    const toggleProject = (projId) => {
        setExpandedProjects(prev => ({ ...prev, [projId]: !prev[projId] }));
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'todo':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        <CircleDot className="w-3 h-3 text-slate-400" />
                        To Do
                    </span>
                );
            case 'in_progress':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        <Clock className="w-3 h-3 text-amber-400" />
                        In Progress
                    </span>
                );
            case 'done':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        Done
                    </span>
                );
            default:
                return <span className="text-xs text-slate-400">{status}</span>;
        }
    };

    const filteredOverview = overviewData.map(org => {
        const matchesOrg = org.name.toLowerCase().includes(searchTerm.toLowerCase());
        const filteredProjects = (org.projects || []).map(proj => {
            const matchesProj = proj.name.toLowerCase().includes(searchTerm.toLowerCase());
            const filteredTasks = (proj.tasks || []).filter(task => {
                const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
                const matchesText = !searchTerm || 
                    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                    matchesProj || matchesOrg;
                return matchesStatus && matchesText;
            });
            return { ...proj, tasks: filteredTasks };
        }).filter(proj => proj.tasks.length > 0 || !searchTerm);

        return { ...org, projects: filteredProjects };
    }).filter(org => org.projects.length > 0 || !searchTerm);

    return (
        <main className="flex-1 p-8 bg-slate-950 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <Crown className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                SuperAdmin Master Console & God-Mode Dashboard
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Platform-wide administrative authority, multi-tenant introspection, and global task telemetry.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchAllAdminData}
                            disabled={loading}
                            className="p-2 bg-slate-900 hover:bg-slate-850 text-slate-300 rounded-xl border border-slate-800 transition"
                            title="Refresh Stats & Overview"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>

                        <button
                            onClick={handleSeed}
                            disabled={seeding}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md shadow-amber-600/30 transition"
                        >
                            <Database className="w-4 h-4" />
                            {seeding ? 'Seeding...' : 'Seed Baseline Permissions'}
                        </button>
                    </div>
                </div>

                {/* Telemetry Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 mb-1">
                            <span className="text-[11px] font-medium">Total Users</span>
                            <Users className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">{statsData?.stats?.users ?? '-'}</div>
                    </div>

                    <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 mb-1">
                            <span className="text-[11px] font-medium">Organizations</span>
                            <Building2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">{statsData?.stats?.organizations ?? '-'}</div>
                    </div>

                    <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 mb-1">
                            <span className="text-[11px] font-medium">Projects</span>
                            <FolderGit2 className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">{statsData?.stats?.projects ?? '-'}</div>
                    </div>

                    <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 mb-1">
                            <span className="text-[11px] font-medium">Tasks</span>
                            <CheckSquare className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">{statsData?.stats?.tasks ?? '-'}</div>
                    </div>

                    <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 mb-1">
                            <span className="text-[11px] font-medium">Permissions</span>
                            <Key className="w-4 h-4 text-rose-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">{statsData?.stats?.permissions ?? '-'}</div>
                    </div>
                </div>

                {/* Section Navigation Tabs */}
                <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl w-fit">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${
                            activeTab === 'overview'
                                ? 'bg-amber-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Master Platform Tree ({overviewData.length} Orgs)
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${
                            activeTab === 'users'
                                ? 'bg-amber-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Global User Directory ({statsData?.users?.length || 0})
                    </button>
                    <button
                        onClick={() => setActiveTab('permissions')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-medium transition ${
                            activeTab === 'permissions'
                                ? 'bg-amber-600 text-white shadow-sm'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        IAM Permissions ({statsData?.permissions?.length || 0})
                    </button>
                </div>

                {/* TAB 1: MASTER PLATFORM TREE (GOD MODE) */}
                {activeTab === 'overview' && (
                    <div className="space-y-4">
                        {/* Search & Status Filter Controls */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
                            <div className="relative flex-1 max-w-md">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search by organization, project, or task title..."
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition"
                                />
                            </div>

                            <div className="flex items-center gap-1.5">
                                <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                                    <Filter className="w-3.5 h-3.5" />
                                    Status:
                                </span>
                                {['all', 'todo', 'in_progress', 'done'].map((st) => (
                                    <button
                                        key={st}
                                        onClick={() => setStatusFilter(st)}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition capitalize ${
                                            statusFilter === st
                                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                                        }`}
                                    >
                                        {st === 'in_progress' ? 'In Progress' : st}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Hierarchical Organizations Tree */}
                        {filteredOverview.length === 0 ? (
                            <div className="py-16 text-center text-slate-500 text-xs bg-slate-900/40 border border-slate-800 rounded-2xl">
                                No matching organizations, projects, or tasks found.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredOverview.map((org) => {
                                    const isOrgExpanded = !!expandedOrgs[org.id];
                                    return (
                                        <div key={org.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition">
                                            {/* Organization Accordion Bar */}
                                            <div 
                                                onClick={() => toggleOrg(org.id)}
                                                className="p-4 bg-slate-900/80 hover:bg-slate-850 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <button className="text-slate-400 hover:text-white">
                                                        {isOrgExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                    </button>
                                                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                                                        <Building2 className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-sm font-bold text-white">{org.name}</h3>
                                                            <span className="text-[10px] text-slate-500 font-mono">ID: {org.id.slice(0, 8)}...</span>
                                                        </div>
                                                        <div className="text-[11px] text-slate-400 flex items-center gap-3 mt-0.5">
                                                            <span>{org.summary?.totalMembers || 0} Members</span>
                                                            <span>•</span>
                                                            <span>{org.summary?.totalProjects || 0} Projects</span>
                                                            <span>•</span>
                                                            <span>{org.summary?.totalTasks || 0} Tasks</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Org Status Pills */}
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                                                        {org.summary?.todo || 0} To Do
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                                        {org.summary?.in_progress || 0} In Progress
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                                        {org.summary?.done || 0} Done
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Org Body */}
                                            {isOrgExpanded && (
                                                <div className="p-5 space-y-5 bg-slate-950/40">
                                                    {/* Members Roster Preview */}
                                                    {org.members && org.members.length > 0 && (
                                                        <div>
                                                            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                                                <Users className="w-3.5 h-3.5 text-blue-400" />
                                                                Workspace Members ({org.members.length})
                                                            </div>
                                                            <div className="flex flex-wrap gap-2">
                                                                {org.members.map(m => (
                                                                    <div key={m.userId} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
                                                                        <span className="font-medium text-white">{m.username}</span>
                                                                        <span className="text-[10px] text-slate-500 capitalize">({m.roleName})</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Projects and Tasks */}
                                                    <div>
                                                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                                                            <FolderGit2 className="w-3.5 h-3.5 text-amber-400" />
                                                            Projects & Task Roster ({org.projects?.length || 0})
                                                        </div>

                                                        {org.projects?.length === 0 ? (
                                                            <div className="text-xs text-slate-500 italic p-4 bg-slate-900/30 rounded-xl border border-slate-800/60">
                                                                No projects created in this organization yet.
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-4">
                                                                {org.projects.map(proj => {
                                                                    const isProjExpanded = !!expandedProjects[proj.id];
                                                                    return (
                                                                        <div key={proj.id} className="rounded-xl border border-slate-800/90 bg-slate-900/40 overflow-hidden">
                                                                            <div 
                                                                                onClick={() => toggleProject(proj.id)}
                                                                                className="p-3.5 bg-slate-900/70 hover:bg-slate-850 cursor-pointer flex items-center justify-between border-b border-slate-800/80"
                                                                            >
                                                                                <div className="flex items-center gap-2.5">
                                                                                    <button className="text-slate-400 hover:text-white">
                                                                                        {isProjExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                                                                    </button>
                                                                                    <span className="text-xs font-bold text-white">{proj.name}</span>
                                                                                    {proj.description && (
                                                                                        <span className="text-xs text-slate-400 font-normal truncate max-w-xs">
                                                                                            — {proj.description}
                                                                                        </span>
                                                                                    )}
                                                                                </div>

                                                                                <div className="flex items-center gap-2">
                                                                                    <span className="text-[11px] text-slate-400">
                                                                                        {proj.tasks?.length || 0} Tasks:
                                                                                    </span>
                                                                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                                                                                        {proj.taskCounts?.todo || 0} Todo
                                                                                    </span>
                                                                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/15 text-amber-300">
                                                                                        {proj.taskCounts?.in_progress || 0} Prog
                                                                                    </span>
                                                                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/15 text-emerald-300">
                                                                                        {proj.taskCounts?.done || 0} Done
                                                                                    </span>
                                                                                </div>
                                                                            </div>

                                                                            {/* Tasks List Table */}
                                                                            {isProjExpanded && (
                                                                                <div className="p-3">
                                                                                    {proj.tasks?.length === 0 ? (
                                                                                        <div className="text-xs text-slate-500 italic p-3 text-center">
                                                                                            No tasks matching the filter in this project.
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="overflow-x-auto">
                                                                                            <table className="w-full text-left text-xs">
                                                                                                <thead>
                                                                                                    <tr className="text-slate-500 font-medium border-b border-slate-800">
                                                                                                        <th className="pb-2">Task Title</th>
                                                                                                        <th className="pb-2">Status</th>
                                                                                                        <th className="pb-2">Assignee</th>
                                                                                                        <th className="pb-2">Created</th>
                                                                                                    </tr>
                                                                                                </thead>
                                                                                                <tbody className="divide-y divide-slate-800/50">
                                                                                                    {proj.tasks.map(task => (
                                                                                                        <tr key={task.id} className="hover:bg-slate-800/30 transition">
                                                                                                            <td className="py-2.5 pr-4">
                                                                                                                <div className="font-medium text-white">{task.title}</div>
                                                                                                                {task.description && (
                                                                                                                    <div className="text-[11px] text-slate-400 line-clamp-1">{task.description}</div>
                                                                                                                )}
                                                                                                            </td>
                                                                                                            <td className="py-2.5">
                                                                                                                {getStatusBadge(task.status)}
                                                                                                            </td>
                                                                                                            <td className="py-2.5">
                                                                                                                {task.assigneeUsername ? (
                                                                                                                    <span className="inline-flex items-center gap-1 text-[11px] text-blue-300">
                                                                                                                        <User className="w-3 h-3 text-blue-400" />
                                                                                                                        @{task.assigneeUsername}
                                                                                                                    </span>
                                                                                                                ) : (
                                                                                                                    <span className="text-[11px] text-slate-500 italic">Unassigned</span>
                                                                                                                )}
                                                                                                            </td>
                                                                                                            <td className="py-2.5 text-slate-500 text-[11px]">
                                                                                                                {new Date(task.createdAt).toLocaleDateString()}
                                                                                                            </td>
                                                                                                        </tr>
                                                                                                    ))}
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 2: GLOBAL USER DIRECTORY */}
                {activeTab === 'users' && (
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <Users className="w-4 h-4 text-blue-400" />
                            Global User Directory ({statsData?.users?.length || 0})
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-800 text-slate-500 font-medium">
                                        <th className="pb-3">Username</th>
                                        <th className="pb-3">User ID</th>
                                        <th className="pb-3">Privileges</th>
                                        <th className="pb-3">Registered Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/60 font-mono">
                                    {statsData?.users?.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-800/30 transition">
                                            <td className="py-3 font-sans font-medium text-white">{u.username}</td>
                                            <td className="py-3 text-slate-400 text-[11px]">{u.id}</td>
                                            <td className="py-3 font-sans">
                                                {u.isSuperAdmin ? (
                                                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                                                        SuperAdmin
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-500 text-[10px]">Standard User</span>
                                                )}
                                            </td>
                                            <td className="py-3 text-slate-500 font-sans">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* TAB 3: IAM PERMISSIONS */}
                {activeTab === 'permissions' && (
                    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
                        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                            <Key className="w-4 h-4 text-rose-400" />
                            Platform IAM Permissions Catalog ({statsData?.permissions?.length || 0})
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {statsData?.permissions?.map((p) => (
                                <div key={p.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                                    <div className="font-mono text-xs text-white font-medium">{p.name}</div>
                                    <div className="text-[11px] text-slate-400">{p.description || 'System access permission'}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
