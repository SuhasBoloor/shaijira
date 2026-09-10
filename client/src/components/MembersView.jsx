import React, { useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserCheck, UserPlus, Trash2, Shield, AlertTriangle } from 'lucide-react';

export function MembersView({ onToast }) {
    const { activeOrgId, activeOrgName } = useAuth();
    const [showAddModal, setShowAddModal] = useState(false);
    const [userId, setUserId] = useState('');
    const [roleId, setRoleId] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleAddMember = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.addOrgMember(userId, Number(roleId));
            onToast?.('User successfully added to organization!', 'success');
            setUserId('');
            setShowAddModal(false);
        } catch (err) {
            onToast?.(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveMember = async (targetUserId, targetRoleId) => {
        if (!confirm('Are you sure you want to remove this member from the organization?')) return;
        try {
            await api.removeOrgMember(targetUserId, targetRoleId);
            onToast?.('Member removed from organization.', 'success');
        } catch (err) {
            onToast?.(err.message, 'error');
        }
    };

    return (
        <main className="flex-1 p-8 bg-slate-950 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <UserCheck className="w-5 h-5 text-blue-400" />
                            Organization Members & Access
                        </h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Manage users and assigned roles for <strong className="text-white">{activeOrgName || 'this workspace'}</strong>.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/30 transition"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Member
                    </button>
                </div>

                {/* Role Explainer Card */}
                <div className="my-6 p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-xs font-semibold text-slate-200">IAM Role Enforcement</h4>
                        <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                            Adding a user here creates a row in the <code className="text-blue-300">memberships</code> table linking their User ID to this Organization with their assigned Role. Their permissions will be checked and cached in Redis on their next API request.
                        </p>
                    </div>
                </div>

                {/* Quick Add Form / Card */}
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-white mb-4">Quick Invite / Role Assignment</h3>
                    <form onSubmit={handleAddMember} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-slate-400 mb-1">User ID (UUID)</label>
                            <input
                                type="text"
                                required
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="Paste user's UUID from registration..."
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition font-mono"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1">Role ID</label>
                            <div className="flex gap-2">
                                <select
                                    value={roleId}
                                    onChange={(e) => setRoleId(e.target.value)}
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 transition"
                                >
                                    <option value="1">Role 1: Admin (All 9 Permissions)</option>
                                    <option value="2">Role 2: Custom Role</option>
                                </select>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition shadow-md shadow-blue-600/20"
                                >
                                    {loading ? 'Adding...' : 'Invite'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
