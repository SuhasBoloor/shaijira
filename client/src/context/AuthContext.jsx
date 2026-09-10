import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [activeOrgId, setActiveOrgId] = useState(() => localStorage.getItem('activeOrgId') || null);
    const [activeOrgName, setActiveOrgName] = useState(() => localStorage.getItem('activeOrgName') || null);

    const login = async (username, password) => {
        const res = await api.login(username, password);
        const userData = {
            id: res.data.id,
            username: res.data.username,
            isSuperAdmin: res.data.isSuperAdmin || false
        };
        const userToken = res.data.token;

        setUser(userData);
        setToken(userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', userToken);
        return userData;
    };

    const register = async (username, password) => {
        const res = await api.register(username, password);
        // Automatically login right after register
        return await login(username, password);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setActiveOrgId(null);
        setActiveOrgName(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('activeOrgId');
        localStorage.removeItem('activeOrgName');
    };

    const switchOrg = (orgId, orgName) => {
        setActiveOrgId(orgId);
        setActiveOrgName(orgName);
        localStorage.setItem('activeOrgId', orgId);
        localStorage.setItem('activeOrgName', orgName);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            activeOrgId,
            activeOrgName,
            isSuperAdmin: user?.isSuperAdmin === true,
            login,
            register,
            logout,
            switchOrg
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
