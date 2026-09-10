import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, ArrowRight, Lock, User } from 'lucide-react';

export function AuthModal({ onSuccess, onError }) {
    const { login, register } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await login(username, password);
                onSuccess?.('Welcome back!');
            } else {
                await register(username, password);
                onSuccess?.('Account registered and logged in!');
            }
        } catch (err) {
            onError?.(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Shai-Jira</h2>
                        <p className="text-xs text-slate-400">IAM RBAC Enterprise Workspace</p>
                    </div>
                </div>

                <div className="flex bg-slate-800/60 p-1 rounded-xl mb-6">
                    <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                            isLogin ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                            !isLogin ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        Create Account
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Username</label>
                        <div className="relative">
                            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g. tony_stark"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-10 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-10 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-600/20"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In to Workspace' : 'Create Account')}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>
            </div>
        </div>
    );
}
