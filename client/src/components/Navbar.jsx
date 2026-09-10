import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
    Layers, 
    Building2, 
    Plus, 
    LogOut, 
    Shield, 
    Crown, 
    Users, 
    Kanban,
    ChevronDown
} from 'lucide-react';

export function Navbar({ activeTab, setActiveTab, userOrgs = [], onOrgCreated, onToast }) {
    const { user, activeOrgId, activeOrgName, isSuperAdmin, logout, switchOrg } = useAuth();
    const [showNewOrgModal, setShowNewOrgModal] = useState(false);
    const [showOrgDropdown, setShowOrgDropdown] = useState(false);
    const [newOrgName, setNewOrgName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateOrg = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.createOrg(newOrgName);
            onToast?.(`Organization "${newOrgName}" created!`, 'success');
            switchOrg(res.data.id, res.data.name);
            setShowNewOrgModal(false);
            setNewOrgName('');
            onOrgCreated?.(res.data);
        } catch (err) {
            onToast?.(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
                {/* Brand & Organization */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-600/30">
                            <Layers className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-white text-base tracking-tight">Shai-Jira</span>
                    </div>

                    <div className="h-5 w-px bg-slate-800" />

                    {/* Active Organization Switcher Dropdown */}
                    <div className="relative">
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setShowOrgDropdown(!showOrgDropdown)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 text-slate-200 text-xs font-medium transition"
                            >
                                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                                <span className="max-w-[130px] truncate">{activeOrgName || 'Select Workspace'}</span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
                            </button>

                            <button
                                onClick={() => setShowNewOrgModal(true)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700/60 transition"
                                title="Create New Workspace"
                            >
                                <Plus className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        {/* Dropdown Menu */}
                        {showOrgDropdown && (
                            <div className="absolute left-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50">
                                <div className="text-[10px] font-semibold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
                                    Your Workspaces
                                </div>
                                <div className="max-h-48 overflow-y-auto space-y-0.5">
                                    {userOrgs.map((org) => (
                                        <button
                                            key={org.id}
                                            onClick={() => {
                                                switchOrg(org.id, org.name);
                                                setShowOrgDropdown(false);
                                            }}
                                            className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex items-center justify-between transition ${
                                                org.id === activeOrgId
                                                    ? 'bg-blue-600/20 text-blue-300 font-semibold border border-blue-500/30'
                                                    : 'text-slate-300 hover:bg-slate-800'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2 truncate">
                                                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span className="truncate">{org.name}</span>
                                            </div>
                                            {org.id === activeOrgId && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                    {userOrgs.length === 0 && (
                                        <div className="px-2.5 py-2 text-xs text-slate-500 text-center">
                                            No workspaces found
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-slate-800 my-1" />

                                <button
                                    onClick={() => {
                                        setShowOrgDropdown(false);
                                        setShowNewOrgModal(true);
                                    }}
                                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-blue-400 hover:bg-blue-600/10 flex items-center gap-2 transition"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Create Workspace</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* View Tabs (Dynamic based on Role) */}
                <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800/80">
                    <button
                        onClick={() => setActiveTab('kanban')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                            activeTab === 'kanban' 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Kanban className="w-3.5 h-3.5" />
                        Kanban Board
                    </button>

                    <button
                        onClick={() => setActiveTab('members')}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                            activeTab === 'members' 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        <Users className="w-3.5 h-3.5" />
                        Org Members & IAM
                    </button>

                    {isSuperAdmin && (
                        <button
                            onClick={() => setActiveTab('superadmin')}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                                activeTab === 'superadmin' 
                                    ? 'bg-amber-600 text-white shadow-sm' 
                                    : 'text-amber-400 hover:text-amber-300'
                            }`}
                        >
                            <Crown className="w-3.5 h-3.5" />
                            SuperAdmin Master
                        </button>
                    )}
                </div>

                {/* User Profile & Logout */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-blue-400">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="hidden sm:block text-left">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-white">{user?.username}</span>
                                {isSuperAdmin ? (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                                        SuperAdmin
                                    </span>
                                ) : (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-medium border border-blue-500/30">
                                        Member
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition"
                        title="Sign Out"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </header>

            {/* Create Org Modal */}
            {showNewOrgModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                        <h3 className="text-base font-bold text-white mb-1">Create Organization</h3>
                        <p className="text-xs text-slate-400 mb-4">
                            You will automatically become the Org Admin with full permissions.
                        </p>
                        <form onSubmit={handleCreateOrg} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">Organization Name</label>
                                <input
                                    type="text"
                                    required
                                    value={newOrgName}
                                    onChange={(e) => setNewOrgName(e.target.value)}
                                    placeholder="e.g. Stark Industries"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowNewOrgModal(false)}
                                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition"
                                >
                                    {loading ? 'Creating...' : 'Create Org'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
