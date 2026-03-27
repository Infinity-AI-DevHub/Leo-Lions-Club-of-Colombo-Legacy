# Leo Lions Club of Colombo Legacy - Official Website & CMS

**Theme:** Empower You!

Full-stack web application with a public-facing website and a form-based admin CMS dashboard.

---

## Tech Stack

| Layer     | Technology |
|-----------|-----------|
| Frontend  | Next.js (App Router, TypeScript, Tailwind CSS) |
| Backend   | Nest.js (TypeScript, TypeORM) |
| Database  | MySQL |

---

## Project Structure

```
leo-lions-updated/
  frontend/    # Next.js public site + admin dashboard
  backend/     # Nest.js REST API + auth + file upload
```

---

## Local Setup (No Docker)

### Prerequisites

- Node.js 18+
- MySQL 8+ running locally

### 1. Create the MySQL Database

```sql
CREATE DATABASE leo_lions_legacy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

The database connection is hardcoded in:
- `backend/src/app.module.ts` (host: localhost, port: 3306, user: root, password: empty)
- `backend/src/seed.ts`

Update these values directly if your MySQL credentials differ.

### 2. Install Dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates tables (via `synchronize: true`) and inserts sample data including:

- **Admin login:** `admin@leolegacy.org` / `Admin@123`
- Sample leadership members, projects, events, blog posts, gallery, contact info, social links

### 4. Start the Backend (port 4000)

```bash
cd backend
npm run start:dev
```

### 5. Start the Frontend (port 3000)

```bash
cd frontend
npm run dev
```

### 6. Open in Browser

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Public website |
| http://localhost:3000/admin/login | Admin login |
| http://localhost:3000/admin | Dashboard overview |
| http://localhost:3000/admin/cms | Content management |

---

## Public Pages

- **/** - Homepage with hero, vision/mission, featured projects, events, leadership, stats, gallery
- **/about** - About Us with vision, mission, core values, president's message
- **/leadership** - Leadership team profiles
- **/projects** - Projects & Service activities
- **/events** - Upcoming and past events
- **/gallery** - Photo gallery organized by albums
- **/membership** - Join Us page with benefits and eligibility
- **/blog** - News / Blog listing
- **/blog/[slug]** - Individual blog post
- **/contact** - Contact information and message form

---

## Admin CMS Capabilities

All public content is editable through the admin dashboard:

- **Homepage Manager** - Hero title, subtitle, background image, CTA buttons, impact stats
- **About Manager** - Introduction, vision, mission, core values, president's message
- **Leadership Manager** - CRUD for team member profiles (name, role, bio, photo, order)
- **Projects Manager** - CRUD with draft/published status
- **Events Manager** - CRUD with upcoming/past status and featured toggle
- **Gallery Manager** - Album CRUD (image management via gallery images entity)
- **Membership Manager** - Intro text, benefits, eligibility, join form link
- **Blog / News Manager** - CRUD with slug, author, rich content, SEO fields, draft/published
- **Contact Manager** - Email, phone, address, Google Maps embed
- **Social Links Manager** - Platform name, URL, visibility, display order
- **Site Settings** - Organization name, theme, colors, logo, favicon, SEO defaults, footer

---

## API Endpoints

All admin endpoints require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Admin login |
| GET | `/public/content` | All public content |
| POST | `/public/contact-message` | Contact form submission |
| GET | `/admin/overview` | Dashboard stats |
| GET/PATCH | `/admin/site-settings` | Site settings |
| GET/PATCH | `/admin/homepage` | Homepage content |
| GET/PATCH | `/admin/about` | About page content |
| GET/PATCH | `/admin/membership` | Membership page |
| GET/PATCH | `/admin/contact-info` | Contact information |
| GET | `/admin/content?entity=X` | List entries |
| POST | `/admin/content?entity=X` | Create entry |
| PATCH | `/admin/content/:id?entity=X` | Update entry |
| DELETE | `/admin/content/:id?entity=X` | Delete entry |
| POST | `/upload/image` | Image upload (multipart) |

Entity values: `leadership`, `projects`, `events`, `galleryAlbums`, `galleryImages`, `blogCategories`, `blogPosts`, `socialLinks`

---

## Authentication

- JWT-based with hardcoded secret
- Token expires after 8 hours
- Password hashing with bcrypt
- Protected admin routes via `JwtAuthGuard`
- Default admin: `admin@leolegacy.org` / `Admin@123`

---

## Configuration

Per project constraints, all configuration is hardcoded:

- Database: `backend/src/app.module.ts` and `backend/src/seed.ts`
- JWT secret: `backend/src/auth/auth.module.ts` and `backend/src/auth/jwt.strategy.ts`
- API URL: `frontend/src/lib/config.ts`
- CORS origin: `backend/src/main.ts`
