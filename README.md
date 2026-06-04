# Cybersecurity Management System

React + TypeScript + Tailwind CSS app with five role-based dashboards, localStorage CRUD, and guest login/register.

**Repository:** https://github.com/tanjiroakainu1/CyberSecuritySystem

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy on Vercel

### If you see: “Project 'cyber-security-system' already exists”

That name is **already on your Vercel account**. Use **one** of these:

**Option A — New project (different name)**  
On the “New Project” screen, change **Project Name** to something unique, for example:

- `cybersecurity-management-system`
- `cms-cyber-security`
- `tanjiro-cyber-security`

Keep **Framework Preset:** Vite, **Root Directory:** `./`, then Deploy.

**Option B — Use the existing project (recommended)**  
1. Open [Vercel Dashboard](https://vercel.com/dashboard)  
2. Open the existing project **`cyber-security-system`**  
3. **Settings → Git** → Connect **tanjiroakainu1/CyberSecuritySystem** (main branch)  
4. **Deployments** → Redeploy (or push to `main` to auto-deploy)

### Vercel settings (should match automatically)

| Setting | Value |
|--------|--------|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |
| Node.js | 18.x or 20.x |

SPA routing is handled by `vercel.json` (all routes → `index.html`).

## Demo quick access (after deploy)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | john@company.com | admin123 |
| Security Manager | sarah@company.com | manager123 |
| Security Analyst | mike@company.com | analyst123 |
| Incident Response | lisa@company.com | response123 |
| Employee | tom@company.com | employee123 |

## Built by

Raminder Jangao
