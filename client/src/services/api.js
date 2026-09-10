const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const activeOrgId = localStorage.getItem('activeOrgId');

    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {})
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (activeOrgId) {
        headers['organization-id'] = activeOrgId;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const errorMessage = data.error || data.message || `Request failed with status ${res.status}`;
        const error = new Error(errorMessage);
        error.status = res.status;
        error.data = data;
        throw error;
    }

    return data;
}

export const api = {
    // Auth
    register: (username, password) => request('/auth/register', { method: 'POST', body: JSON.stringify({ username, password }) }),
    login: (username, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),

    // Organizations
    createOrg: (name) => request('/org', { method: 'POST', body: JSON.stringify({ name }) }),

    // Projects
    getProjects: () => request('/project'),
    getProject: (id) => request(`/project/${id}`),
    createProject: (name, description) => request('/project', { method: 'POST', body: JSON.stringify({ name, description }) }),
    updateProject: (id, name, description) => request(`/project/${id}`, { method: 'PUT', body: JSON.stringify({ name, description }) }),
    deleteProject: (id) => request(`/project/${id}`, { method: 'DELETE' }),
    addProjectMember: (projectId, userId) => request(`/project/${projectId}/members`, { method: 'POST', body: JSON.stringify({ userId }) }),
    removeProjectMember: (projectId, userId) => request(`/project/${projectId}/members/${userId}`, { method: 'DELETE' }),

    // Tasks
    getTasksByProject: (projectId) => request(`/task/project/${projectId}`),
    createTask: (title, projectId, description, assigneeId = null, status = 'todo') => 
        request('/task', { method: 'POST', body: JSON.stringify({ title, projectId, description, assigneeId, status }) }),
    updateTask: (id, fields) => request(`/task/${id}`, { method: 'PUT', body: JSON.stringify(fields) }),
    deleteTask: (id) => request(`/task/${id}`, { method: 'DELETE' }),

    // Memberships
    addOrgMember: (userId, roleId) => request('/membership', { method: 'POST', body: JSON.stringify({ userId, roleId }) }),
    removeOrgMember: (userId, roleId) => request('/membership', { method: 'DELETE', body: JSON.stringify({ userId, roleId }) }),

    // SuperAdmin
    getAdminStats: () => request('/admin/stats'),
    seedData: () => request('/admin/seed', { method: 'POST' })
};
