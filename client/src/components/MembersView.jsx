import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
    UserCheck, 
    UserPlus, 
    Trash2, 
    Shield, 
    Users, 
    Key, 
    Plus, 
    Check, 
    RefreshCw, 
    ShieldCheck, 
    AlertCircle 
} from 'lucide-react';

export function MembersView({ onToast }) {
    const { activeOrgId, activeOrgName } = useAuth();
    const [subTab, setSubTab] = useState('members'); // 'members' | 'roles'
    
    // Members state
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);
    const [inviteUsername, setInviteUsername] = useState('');
    const [inviteRoleId, setInviteRoleId] = useState('');
    const [inviting, setInviting] = useState(false);

    // Roles state
    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [allPermissions, setAllPermissions] = useState([]);
    const [showCreateRoleModal, setShowCreateRoleModal] = useState(false);
    const [newRoleName, setNewRoleName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [creatingRole, setCreatingRole] = useState(false);

    const fetchMembers = async () => {
        if (!activeOrgId) return;
        setLoadingMembers(true);
        try {
            const res = await api.getOrgMembers();
            setMembers(res.data || []);
        } catch (err) {
            onToast?.(err.message, 'error');
        } finally {
            setLoadingMembers(false);
        }
    };

    const fetchRoles = async () => {
        if (!activeOrgId) return;
        setLoadingRoles(true);
        try {
            const [rolesRes, permsRes] = await Promise.all([
                api.getOrgRoles(),
                api.getAllPermissions().catch(() => ({ data: [] }))
            ]);
            const rolesList = rolesRes.data || [];
            setRoles(rolesList);
            if (rolesList.length > 0 && !inviteRoleId) {
                setInviteRoleId(String(rolesList[0].id));
            }
            setAllPermissions(permsRes.data || []);
        } catch (err) {
            onToast?.(err.message, 'error');
        } finally {
            setLoadingRoles(false);
        }
    };

    useEffect(() => {
        if (activeOrgId) {
            fetchMembers();
            fetchRoles();
        }
    }, [activeOrgId]);

    const handleInviteMember = async (e) => {
        e.preventDefault();
        if (!inviteUsername.trim()) {
            onToast?.('Please enter a username to invite', 'error');
            return;
        }
        setInviting(true);
        try {
            await api.addOrgMember({
                username: inviteUsername.trim(),
                roleId: Number(inviteRoleId)
            });
            onToast?.(`User "${inviteUsername.trim()}" successfully invited!`, 'success');
            setInviteUsername('');
            fetchMembers();
        } catch (err) {
            onToast?.(err.message, 'error');
        } finally {
            setInviting(false);
        }
    };

    const handleRemoveMember = async (targetUserId, targetRoleId, targetUsername) => {
        if (!confirm(`Are you sure you want to remove ${targetUsername || 'this member'} from the organization?`)) return;
        try {
            await api.removeOrgMember({
                userId: targetUserId,
                roleId: targetRoleId
            });
            onToast?.('Member removed from organization.', 'success');
            fetchMembers();
        } catch (err) {
            onToast?.(err.message, 'error');
        }
    };

    const handleTogglePermission = (permName) => {
        setSelectedPermissions(prev => 
            prev.includes(permName) 
                ? prev.filter(p => p !== permName) 
                : [...prev, permName]
        );
    };

    const handleCreateRole = async (e) => {
        e.preventDefault();
        if (!newRoleName.trim()) {
            onToast?.('Role name is required', 'error');
            return;
        }
        if (selectedPermissions.length === 0) {
            onToast?.('Please select at least one permission for this role', 'error');
            return;
        }

        setCreatingRole(true);
        try {
            await api.createRole(newRoleName.trim(), selectedPermissions);
            onToast?.(`Role "${newRoleName.trim()}" created successfully!`, 'success');
            setNewRoleName('');
            setSelectedPermissions([]);
            setShowCreateRoleModal(false);
            fetchRoles();
        } catch (err) {
            onToast?.(err.message, 'error');
        } finally {
            setCreatingRole(false);
        }
    };

    const selectAllPerms = () => {
        setSelectedPermissions(allPermissions.map(p => p.name));
    };

    const deselectAllPerms = () => {
        setSelectedPermissions([]);
    };

    return (
        <main className="flex-1 p-8 bg-slate-950 overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-400" />
                            IAM & Workspace Access Control
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Manage members and configure RBAC roles for workspace <strong className="text-white">{activeOrgName || 'current'}</strong>.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Sub-tabs */}
                        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
                            <button
                                onClick={() => setSubTab('members')}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                                    subTab === 'members'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Users className="w-3.5 h-3.5" />
                                Members ({members.length})
                            </button>
                            <button
                                onClick={() => setSubTab('roles')}
                                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                                    subTab === 'roles'
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Key className="w-3.5 h-3.5" />
                                Roles & Permissions ({roles.length})
                            </button>
                        </div>

                        <button
                            onClick={() => { fetchMembers(); fetchRoles(); }}
                            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition"
                            title="Refresh"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* TAB 1: MEMBERS */}
                {subTab === 'members' && (
                    <div className="space-y-6">
                        {/* Quick Invite Form Card */}
                        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
                            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                                <UserPlus className="w-4 h-4 text-blue-400" />
                                Invite Member by Username
                            </h3>
                            <p className="text-xs text-slate-400 mb-4">
                                Enter the registered username of the user you wish to add and assign their workspace role.
                            </p>

                            <form onSubmit={handleInviteMember} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                <div className="sm:col-span-6">
                                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={inviteUsername}
                                        onChange={(e) => setInviteUsername(e.target.value)}
                                        placeholder="e.g. alice"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                                    />
                                </div>

                                <div className="sm:col-span-4">
                                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                                        Role Assignment
                                    </label>
                                    <select
                                        value={inviteRoleId}
                                        onChange={(e) => setInviteRoleId(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition capitalize"
                                    >
                                        {roles.map(r => (
                                            <option key={r.id} value={r.id}>
                                                {r.name} ({r.permissions?.length || 0} perms)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="sm:col-span-2 flex items-end">
                                    <button
                                        type="submit"
                                        disabled={inviting || roles.length === 0}
                                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition shadow-lg shadow-blue-600/20"
                                    >
                                        <UserPlus className="w-3.5 h-3.5" />
                                        {inviting ? 'Inviting...' : 'Invite'}
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* Members Directory Table */}
                        <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                                    <Users className="w-4 h-4 text-emerald-400" />
                                    Active Members ({members.length})
                                </h3>
                                <span className="text-xs text-slate-500">
                                    Cached in Redis with sub-millisecond IAM verification
                                </span>
                            </div>

                            {loadingMembers ? (
                                <div className="py-12 text-center text-slate-500 text-xs">
                                    Loading workspace members...
                                </div>
                            ) : members.length === 0 ? (
                                <div className="py-12 text-center text-slate-500 text-xs">
                                    No members found in this workspace. Invite someone above!
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="border-b border-slate-800 text-slate-500 font-medium">
                                                <th className="pb-3">User</th>
                                                <th className="pb-3">User ID</th>
                                                <th className="pb-3">Assigned Role</th>
                                                <th className="pb-3 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60">
                                            {members.map((m) => (
                                                <tr key={`${m.userId}-${m.roleId}`} className="hover:bg-slate-800/30 transition">
                                                    <td className="py-3">
                                                        <div className="flex items-center gap-2.5">
                                                            <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center text-xs">
                                                                {m.username?.[0]?.toUpperCase() || 'U'}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-white">{m.username}</span>
                                                                {m.isSuperAdmin && (
                                                                    <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
                                                                        SuperAdmin
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 font-mono text-[11px] text-slate-400">{m.userId}</td>
                                                    <td className="py-3">
                                                        <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-medium capitalize">
                                                            {m.roleName}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <button
                                                            onClick={() => handleRemoveMember(m.userId, m.roleId, m.username)}
                                                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition"
                                                            title="Remove member"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 2: ROLES & PERMISSIONS */}
                {subTab === 'roles' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-white">Custom Roles & Permissions</h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    Configure granular access policies for team members within this workspace.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowCreateRoleModal(true)}
                                className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/30 transition"
                            >
                                <Plus className="w-4 h-4" />
                                Create Custom Role
                            </button>
                        </div>

                        {/* Roles Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {roles.map((r) => (
                                <div key={r.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-bold">
                                                <Key className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-white capitalize">{r.name}</h4>
                                                <span className="text-[10px] text-slate-500 font-mono">Role ID: #{r.id}</span>
                                            </div>
                                        </div>

                                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                                            {r.permissions?.length || 0} permissions
                                        </span>
                                    </div>

                                    <div className="pt-2 border-t border-slate-800/80">
                                        <div className="text-[11px] text-slate-400 font-medium mb-2">Granted Permissions:</div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {r.permissions && r.permissions.length > 0 ? (
                                                r.permissions.map((p) => (
                                                    <span 
                                                        key={p} 
                                                        className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-[10px] font-mono text-slate-300"
                                                    >
                                                        {p}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-slate-500 italic">No permissions assigned</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Create Custom Role Modal */}
            {showCreateRoleModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <Key className="w-4 h-4 text-blue-400" />
                                Create Custom Role
                            </h3>
                            <div className="flex gap-2 text-xs">
                                <button 
                                    type="button" 
                                    onClick={selectAllPerms} 
                                    className="text-blue-400 hover:text-blue-300 transition text-[11px]"
                                >
                                    Select All
                                </button>
                                <span className="text-slate-600">|</span>
                                <button 
                                    type="button" 
                                    onClick={deselectAllPerms} 
                                    className="text-slate-400 hover:text-slate-300 transition text-[11px]"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleCreateRole} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-1">
                                    Role Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newRoleName}
                                    onChange={(e) => setNewRoleName(e.target.value)}
                                    placeholder="e.g. Developer, QA Engineer, Guest"
                                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-300 mb-2">
                                    Assign Permissions ({selectedPermissions.length} selected)
                                </label>
                                <div className="max-h-60 overflow-y-auto space-y-1.5 p-2 bg-slate-950 border border-slate-800/80 rounded-xl">
                                    {allPermissions.map((p) => {
                                        const isChecked = selectedPermissions.includes(p.name);
                                        return (
                                            <div
                                                key={p.name}
                                                onClick={() => handleTogglePermission(p.name)}
                                                className={`p-2 rounded-lg text-xs cursor-pointer flex items-start gap-2.5 transition ${
                                                    isChecked
                                                        ? 'bg-blue-600/15 border border-blue-500/30 text-blue-200'
                                                        : 'hover:bg-slate-900 border border-transparent text-slate-400'
                                                }`}
                                            >
                                                <div className={`w-4 h-4 rounded border flex items-center justify-center mt-0.5 transition ${
                                                    isChecked 
                                                        ? 'bg-blue-600 border-blue-500 text-white' 
                                                        : 'border-slate-700 bg-slate-900'
                                                }`}>
                                                    {isChecked && <Check className="w-3 h-3" />}
                                                </div>
                                                <div>
                                                    <div className="font-mono font-medium text-white text-[11px]">{p.name}</div>
                                                    <div className="text-[10px] text-slate-400">{p.description || 'Access grant'}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateRoleModal(false)}
                                    className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={creatingRole}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-600/30 transition"
                                >
                                    {creatingRole ? 'Creating Role...' : 'Save Role'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
