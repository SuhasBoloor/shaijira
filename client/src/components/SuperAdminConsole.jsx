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
    ShieldAlert
} from 'lucide-react';

export function SuperAdminConsole({ onToast }) {
    const [statsData, setStatsData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [seeding, setSeeding] = useState(false);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await api.getAdminStats();
            setStatsData(res);
        } catch (err) {
            onToast?.(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleSeed = async () => {
        setSeeding(true);
        try {
            const res = await api.seedData();
            onToast?.(res.message || 'Permissions seeded successfully!', 'success');
            fetchStats();
        } catch (err) {
            onToast?.(err.message, 'error');
        } finally {
            setSeeding(false);
        }
    };

    return (
        <main className="flex-1 p-8 bg-slate-950 overflow-y-auto">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                            <Crown className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                SuperAdmin Master Console
                            </h2>
                            <p className="text-xs text-slate-400 mt-0.5">
                                Platform-level administration, database seeding, and global telemetry.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchStats}
                            disabled={loading}
                            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
                            title="Refresh Stats"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>

                        <button
                            onClick={handleSeed}
                            disabled={seeding}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md shadow-amber-600/30 transition"
                        >
                            <Database className="w-4 h-4" />
                            {seeding ? 'Seeding...' : 'Seed Permissions'}
                        </button>
                    </div>
                </div>

                {/* Telemetry Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 mb-2">
                            <span className="text-xs font-medium">Total Users</span>
                            <Users className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">{statsData?.stats?.users ?? '-'}</div>
                    </div>

                    <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 mb-2">
                            <span className="text-xs font-medium">Organizations</span>
                            <Building2 className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">{statsData?.stats?.organizations ?? '-'}</div>
                    </div>

                    <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 mb-2">
                            <span className="text-xs font-medium">Projects</span>
                            <FolderGit2 className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">{statsData?.stats?.projects ?? '-'}</div>
                    </div>

                    <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 mb-2">
                            <span className="text-xs font-medium">Tasks</span>
                            <CheckSquare className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">{statsData?.stats?.tasks ?? '-'}</div>
                    </div>

                    <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
                        <div className="flex items-center justify-between text-slate-400 mb-2">
                            <span className="text-xs font-medium">Permissions</span>
                            <Key className="w-4 h-4 text-rose-400" />
                        </div>
                        <div className="text-2xl font-bold text-white">{statsData?.stats?.permissions ?? '-'}</div>
                    </div>
                </div>

                {/* Global Organizations Directory */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-emerald-400" />
                        Global Organizations Directory
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="border-b border-slate-800 text-slate-500 font-medium">
                                    <th className="pb-3">Organization Name</th>
                                    <th className="pb-3">Organization ID</th>
                                    <th className="pb-3">Created At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                                {statsData?.organizations?.map((org) => (
                                    <tr key={org.id} className="hover:bg-slate-800/30 transition">
                                        <td className="py-3 font-sans font-medium text-white">{org.name}</td>
                                        <td className="py-3 text-slate-400">{org.id}</td>
                                        <td className="py-3 text-slate-500 font-sans">{new Date(org.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Global Users Directory */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-400" />
                        Global User Directory
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
                            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                                {statsData?.users?.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-800/30 transition">
                                        <td className="py-3 font-sans font-medium text-white">{u.username}</td>
                                        <td className="py-3 text-slate-400">{u.id}</td>
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
            </div>
        </main>
    );
}
