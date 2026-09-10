const express = require('express')
const config = require('./src/config/env')
const cors = require('cors')
const path = require('path')
const { db } = require('./src/config/db')
const { sql } = require('drizzle-orm')
const authRoute = require('./src/routes/authRoutes')
const organizationRoute = require('./src/routes/organizationRoutes')
const taskRoute = require('./src/routes/taskRoutes')
const projectRoute = require('./src/routes/projectRoutes')
const membershipRoute = require('./src/routes/membershipRoutes')
const adminRoute = require('./src/routes/adminRoutes')
const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRoute)
app.use("/org", organizationRoute)
app.use("/project", projectRoute)
app.use("/task", taskRoute)
app.use("/membership", membershipRoute)
app.use("/admin", adminRoute) 

app.get("/health", async (req, res) => {
    let dbStatus = "connected";
    try {
        await db.execute(sql`SELECT 1`);
    } catch (err) {
        dbStatus = "warming_up: " + err.message;
    }
    res.status(200).json({ status: "healthy", db: dbStatus, timestamp: new Date() });
});

// Serve frontend static build if it exists
const clientDistPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientDistPath));

// SPA fallback for all remaining GET requests
app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/auth') || 
        req.path.startsWith('/org') || 
        req.path.startsWith('/project') || 
        req.path.startsWith('/task') || 
        req.path.startsWith('/membership') || 
        req.path.startsWith('/admin') || 
        req.path.startsWith('/health')) {
        return next();
    }

    const indexPath = path.join(clientDistPath, 'index.html');
    res.sendFile(indexPath, (err) => {
        if (err) {
            res.status(200).send(`
                <html>
                    <body style="font-family: sans-serif; text-align: center; padding: 50px;">
                        <h1>🚀 Shai-Jira API</h1>
                        <p>Backend API is active.</p>
                        <p>Hit <a href="/health">/health</a> to check service and database status.</p>
                    </body>
                </html>
            `);
        }
    });
});

if (require.main === module) {
    app.listen(config.PORT, () => console.log(`Server is running on port ${config.PORT}`));
}

module.exports = app;