import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { MembersView } from './components/MembersView';
import { SuperAdminConsole } from './components/SuperAdminConsole';
import { AuthModal } from './components/AuthModal';
import { Toast } from './components/Toast';
import { Building2, Plus, ArrowRight } from 'lucide-react';

export function App() {
    const { user, token, activeOrgId, activeOrgName, switchOrg } = useAuth();
    const [activeTab, setActiveTab] = useState('kanban');
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [toast, setToast] = useState({ message: null, type: 'error' });
    const [newOrgName, setNewOrgName] = useState('');
    const [loadingOrg, setLoadingOrg] = useState(false);
    const [userOrgs, setUserOrgs] = useState([]);
    const [loadingOrgsList, setLoadingOrgsList] = useState(true);

    const showToast = (message, type = 'error') => {
        setToast({ message, type });
        setTimeout(() => {
            setToast({ message: null, type: 'error' });
        }, 4000);
    };

    const fetchUserOrgs = async () => {
        if (!token) return;
        try {
            setLoadingOrgsList(true);
            const res = await api.getUserOrgs();
            const orgs = res.data || [];
            setUserOrgs(orgs);
            if (orgs.length > 0) {
                const current = orgs.find(o => o.id === activeOrgId);
                if (current) {
                    switchOrg(current.id, current.name);
                } else {
                    switchOrg(orgs[0].id, orgs[0].name);
                }
            }
        } catch (err) {
            console.error("Failed to fetch user organizations", err);
        } finally {
            setLoadingOrgsList(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUserOrgs();
        }
    }, [token]);

    const fetchProjects = async () => {
        if (!token || !activeOrgId) {
            setProjects([]);
            setSelectedProject(null);
            return;
        }

        try {
            const res = await api.getProjects();
            const projectList = res.data || [];
            setProjects(projectList);
            if (projectList.length > 0 && !selectedProject) {
                setSelectedProject(projectList[0]);
            }
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [activeOrgId, token]);

    const handleCreateFirstOrg = async (e) => {
        e.preventDefault();
        setLoadingOrg(true);
        try {
            const res = await api.createOrg(newOrgName);
            showToast(`Organization "${newOrgName}" created!`, 'success');
            switchOrg(res.data.id, res.data.name);
            setNewOrgName('');
            await fetchUserOrgs();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoadingOrg(false);
        }
    };

    // If not logged in, show Auth Screen
    if (!token) {
        return (
            <>
                <AuthModal
                    onSuccess={(msg) => showToast(msg, 'success')}
                    onError={(msg) => showToast(msg, 'error')}
                />
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast({ message: null, type: 'error' })}
                />
            </>
        );
    }

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100">
            <Navbar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                userOrgs={userOrgs}
                onOrgCreated={async (newOrg) => {
                    await fetchUserOrgs();
                    fetchProjects();
                }}
                onToast={showToast}
            />

            {/* If loading organizations */}
            {loadingOrgsList ? (
                <main className="flex-1 flex items-center justify-center p-6 bg-slate-950">
                    <div className="text-slate-400 text-sm flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <span>Loading your workspaces...</span>
                    </div>
                </main>
            ) : !activeOrgId ? (
                <main className="flex-1 flex items-center justify-center p-6 bg-slate-950">
                    <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center shadow-2xl">
                        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto mb-4">
                            <Building2 className="w-6 h-6" />
                        </div>
                        <h2 className="text-lg font-bold text-white mb-1">Create Your First Organization</h2>
                        <p className="text-xs text-slate-400 mb-6">
                            Every project and task in Shai-Jira lives inside an organization. Creating an organization automatically grants you the <strong>Admin</strong> role with all 9 permissions.
                        </p>
                        <form onSubmit={handleCreateFirstOrg} className="space-y-4">
                            <input
                                type="text"
                                required
                                value={newOrgName}
                                onChange={(e) => setNewOrgName(e.target.value)}
                                placeholder="e.g. Stark Industries"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                            />
                            <button
                                type="submit"
                                disabled={loadingOrg}
                                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
                            >
                                {loadingOrg ? 'Creating...' : 'Launch Workspace'}
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </main>
            ) : (
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar only shown on Kanban view */}
                    {activeTab === 'kanban' && (
                        <Sidebar
                            projects={projects}
                            selectedProject={selectedProject}
                            onSelectProject={setSelectedProject}
                            onProjectCreated={(newProj) => {
                                setProjects((prev) => [...prev, newProj]);
                                setSelectedProject(newProj);
                            }}
                            onToast={showToast}
                        />
                    )}

                    {/* Main Content Area */}
                    {activeTab === 'kanban' && (
                        <KanbanBoard
                            project={selectedProject}
                            onToast={showToast}
                        />
                    )}

                    {activeTab === 'members' && (
                        <MembersView onToast={showToast} />
                    )}

                    {activeTab === 'superadmin' && (
                        <SuperAdminConsole onToast={showToast} />
                    )}
                </div>
            )}

            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ message: null, type: 'error' })}
            />
        </div>
    );
}
export default App;
