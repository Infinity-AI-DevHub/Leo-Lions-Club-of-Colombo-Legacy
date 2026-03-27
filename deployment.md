# Deployment Guide (aaPanel + PM2) for `colombolegacy.org`

This guide deploys:
- **Frontend (Next.js)** on PM2
- **Backend (NestJS)** on PM2
- **MySQL** on your VPS
- **Nginx reverse proxy** via aaPanel
- **SSL** via aaPanel

Recommended URLs:
- Frontend: `https://colombolegacy.org`
- API: `https://api.colombolegacy.org`

---

## 1. Prerequisites on VPS

1. Install aaPanel on your Linux VPS.
2. In aaPanel, install:
   - `Nginx`
   - `MySQL`
   - `Node.js Manager` (or ensure Node 20+ is installed)
3. Install Node + PM2 in server shell:

```bash
node -v
npm -v
npm install -g pm2
```

---

## 2. DNS Setup

Create DNS `A` records:
- `@` -> your VPS IP (for `colombolegacy.org`)
- `www` -> your VPS IP (optional)
- `api` -> your VPS IP (for `api.colombolegacy.org`)

Wait for propagation before SSL setup.

---

## 3. Upload Project to VPS

Example target path:

```bash
mkdir -p /www/wwwroot/colombolegacy
cd /www/wwwroot/colombolegacy
```

Upload or git clone project so structure is:

```text
/www/wwwroot/colombolegacy
  ├─ backend
  └─ frontend
```

---

## 4. MySQL Database Setup

In aaPanel -> MySQL:
1. Create database: `leo_lions_legacy`
2. Create database user + password
3. Grant full privileges to that user on `leo_lions_legacy`

---

## 5. Update Hardcoded Production Config (Important)

Current project uses hardcoded values. Update these before build.

## 5.1 Backend DB config

Edit:
- `backend/src/app.module.ts`
- (if used) `backend/src/seed.ts`

Set your production MySQL values:
- host: `127.0.0.1` (or db host)
- port: `3306`
- username: your db user
- password: your db password
- database: `leo_lions_legacy`

## 5.2 Frontend API base URL

Edit:
- `frontend/src/lib/config.ts`

Set:

```ts
export const API_BASE_URL = 'https://api.colombolegacy.org';
```

## 5.3 Backend CORS origin

Edit:
- `backend/src/main.ts`

Set:

```ts
app.enableCors({
  origin: ['https://colombolegacy.org', 'https://www.colombolegacy.org'],
  credentials: true,
});
```

---

## 6. Install Dependencies

```bash
cd /www/wwwroot/colombolegacy/backend
npm install

cd /www/wwwroot/colombolegacy/frontend
npm install
```

---

## 7. Build Applications

```bash
cd /www/wwwroot/colombolegacy/backend
npm run build

cd /www/wwwroot/colombolegacy/frontend
npm run build
```

Optional first-time seed (if needed):

```bash
cd /www/wwwroot/colombolegacy/backend
npm run seed
```

---

## 8. Start with PM2

## 8.1 Start backend (port 4000)

```bash
cd /www/wwwroot/colombolegacy/backend
pm2 start dist/main.js --name leo-backend
```

## 8.2 Start frontend (port 3000)

```bash
cd /www/wwwroot/colombolegacy/frontend
pm2 start "npm run start -- -p 3000" --name leo-frontend
```

## 8.3 Save PM2 startup

```bash
pm2 save
pm2 startup
```

Run the command shown by `pm2 startup`, then run `pm2 save` again.

---

## 9. Configure aaPanel Sites + Reverse Proxy

Create two sites in aaPanel:

## 9.1 Site 1: `colombolegacy.org`

Reverse proxy target:
- `http://127.0.0.1:3000`

## 9.2 Site 2: `api.colombolegacy.org`

Reverse proxy target:
- `http://127.0.0.1:4000`

Important for API site:
- Ensure large upload support (if needed):
  - `client_max_body_size 50m;`

---

## 10. Serve Uploads Correctly

Backend serves uploads from:
- `/www/wwwroot/colombolegacy/backend/uploads`
- URL path: `/uploads/...`

Because API domain is proxied directly to backend, uploaded files should be accessible as:
- `https://api.colombolegacy.org/uploads/...`

---

## 11. SSL Setup (aaPanel)

For each domain (`colombolegacy.org`, `api.colombolegacy.org`):
1. Open site -> SSL
2. Use Let’s Encrypt
3. Enable **Force HTTPS**

---

## 12. Verification Checklist

1. Frontend:
   - `https://colombolegacy.org` opens
2. Admin:
   - `https://colombolegacy.org/admin/login` opens
3. API:
   - `https://api.colombolegacy.org/public/content` returns JSON
4. Uploads:
   - Any uploaded image opens from API uploads URL
5. PM2:

```bash
pm2 list
pm2 logs leo-backend
pm2 logs leo-frontend
```

---

## 13. Update / Redeploy Steps

When you push new code:

```bash
cd /www/wwwroot/colombolegacy
# git pull  (or upload latest files)

cd backend
npm install
npm run build
pm2 restart leo-backend

cd ../frontend
npm install
npm run build
pm2 restart leo-frontend
```

---

## 14. Troubleshooting

## 14.1 Frontend cannot reach API
- Check `frontend/src/lib/config.ts` has `https://api.colombolegacy.org`
- Check API site reverse proxy and SSL
- Check backend CORS in `backend/src/main.ts`

## 14.2 502 Bad Gateway
- Process not running:
  - `pm2 list`
  - restart process
- Wrong proxy port in aaPanel

## 14.3 Database connection fails
- Recheck DB creds in `backend/src/app.module.ts`
- Verify MySQL user permissions

## 14.4 Uploaded images not showing
- Confirm API domain serves `/uploads/...`
- Check backend process has read/write permission on `backend/uploads`

---

## 15. Production Recommendations

1. Replace hardcoded config with `.env` (highly recommended).
2. Set TypeORM `synchronize: false` in production and use migrations.
3. Rotate admin default password immediately.
4. Add regular DB backups from aaPanel.
