# SkillSwap (MERN)

A peer skill-exchange app: post skills you can teach or want to learn,
browse others' posts, and message each other in real time.

## Tech Stack
- **Client**: React 19 (Vite), React Router, Tailwind CSS 3, Axios, Socket.io-client
- **Server**: Node.js, Express, MongoDB (Mongoose), JWT auth, Socket.io

## Setup

### 1. Prerequisites
- Node.js 18+
- MongoDB — either running locally, or a MongoDB Atlas connection string

### 2. Server
```bash
cd server
npm install
```
`.env` is already set up for local MongoDB:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/skillswap
JWT_SECRET=skillswap_dev_secret_change_me_in_production
CLIENT_URL=http://localhost:5173
```
Change `MONGO_URI` if you're using Atlas or a different local port.

```bash
npm run dev        # http://localhost:5000
```

### 3. Client
```bash
cd client
npm install
npm run dev          # http://localhost:5173
```

### 4. Checking your database with MongoDB Compass
1. Install [MongoDB Compass](https://www.mongodb.com/products/compass) (free).
2. Open it and paste in the **exact same connection string** from your `.env`'s
   `MONGO_URI` — for local MongoDB that's `mongodb://127.0.0.1:27017`.
3. Once connected, click into the `skillswap` database in the sidebar. You'll
   see collections for `users`, `skillposts`, and `messages` — Compass lets
   you browse, filter, and edit documents directly.
4. If `skillswap` doesn't appear yet, register a user or post a skill first —
   MongoDB creates the database lazily on first write.

## What was fixed / enhanced in this pass
- **Critical bug**: `messageController.js` required `../models/message`
  (lowercase) but the file is `Message.js` — this crashes on any
  case-sensitive filesystem (Linux, most hosting). Fixed.
- **Critical bug**: `package.json` specified Tailwind v4 while every config
  file (`postcss.config.js`, `tailwind.config.js`, `index.css`) was written
  in v3 syntax — this combination fails to build. Pinned to Tailwind v3 to
  match the existing config.
- `nodemon` was used in `npm run dev` but never listed as a dependency — added.
- Removed an empty, unused `server.js` that shadowed the real entry point (`index.js`).
- **Wired up Socket.io** for live chat — the dependency existed but was never actually used.
- Added profile editing (`PUT /api/auth/profile`) — there was previously no
  way to set `skillsToTeach` / `skillsToLearn` at all.
- Added conversation-list and per-conversation endpoints so chat has a real inbox instead of one flat message list.
- Added a `GET /api/skills/mine` endpoint for a "my posts" view.
- **Built the entire client from scratch** — it was still the default Vite
  starter template with zero real UI. Now includes: login/register, a
  searchable skill browser with pagination, a post-a-skill form, a profile
  page for managing your taught/wanted skills, and a real-time messaging inbox.

## API Overview
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Log in, returns JWT |
| GET | `/api/auth/profile` | Current user |
| PUT | `/api/auth/profile` | Update name / skillsToTeach / skillsToLearn |
| GET | `/api/skills` | Browse skills (search, category, tag, page, limit) |
| GET | `/api/skills/mine` | Your own posted skills |
| POST | `/api/skills` | Post a skill |
| PUT/DELETE | `/api/skills/:id` | Edit / delete your own post |
| GET | `/api/messages` | All your messages (flat) |
| GET | `/api/messages/conversations` | Inbox — one row per person |
| GET | `/api/messages/:userId` | Full thread with one person |
| POST | `/api/messages` | Send a message (also broadcast live via Socket.io) |
