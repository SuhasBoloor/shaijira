const request = require('supertest');
const app = require('../../server');
const { pool } = require('../../src/config/db');
const { client } = require('../../src/config/redis');

describe('HTTP Route Integration Tests', () => {
    afterAll(async () => {
        try {
            await pool.end();
        } catch (_) {}
        try {
            await client.quit();
        } catch (_) {}
    });

    describe('GET /health', () => {
        it('should return 200 and healthy status with db connected', async () => {
            const res = await request(app).get('/health');
            expect(res.status).toBe(200);
            expect(res.body.status).toBe('healthy');
            expect(res.body.db).toBe('connected');
        });
    });

    describe('Route Authentication & RBAC Guard', () => {
        it('should reject unauthenticated access to /project with 401', async () => {
            const res = await request(app).get('/project');
            expect(res.status).toBe(401);
            expect(res.text).toMatch(/token/i);
        });

        it('should reject unauthenticated access to /task with 401', async () => {
            const res = await request(app).post('/task').send({ title: 'Test Task' });
            expect(res.status).toBe(401);
        });

        it('should reject unauthenticated access to /admin/stats with 401', async () => {
            const res = await request(app).get('/admin/stats');
            expect(res.status).toBe(401);
        });

        it('should reject unauthenticated access to /admin/overview with 401', async () => {
            const res = await request(app).get('/admin/overview');
            expect(res.status).toBe(401);
        });

        it('should reject unauthenticated access to /membership with 401', async () => {
            const res = await request(app).get('/membership');
            expect(res.status).toBe(401);
        });

        it('should reject unauthenticated access to /role with 401', async () => {
            const res = await request(app).get('/role');
            expect(res.status).toBe(401);
        });
    });

    describe('Static SPA Fallback', () => {
        it('should return 200 for client routes instead of 404', async () => {
            const res = await request(app).get('/non-existent-page');
            expect(res.status).toBe(200);
        });
    });
});
