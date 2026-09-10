import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export function Toast({ message, type = 'error', onClose }) {
    if (!message) return null;

    const isError = type === 'error';

    return (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl border backdrop-blur-md transition-all animate-bounce-short ${
            isError 
                ? 'bg-rose-950/90 border-rose-800 text-rose-200' 
                : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
        }`}>
            {isError ? <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            <p className="text-sm font-medium">{message}</p>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded transition">
                <X className="w-4 h-4 opacity-70 hover:opacity-100" />
            </button>
        </div>
    );
}
