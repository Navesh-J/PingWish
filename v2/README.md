# 🎂 PingWish — Next.js Migration

Migrated from React + Express + Render → **Next.js 14 App Router + Vercel**.

---

## 🏗 Stack

| Layer | Before | After |
|---|---|---|
| Frontend | React (Vite) | Next.js 14 App Router |
| Backend | Express on Render | Next.js API Routes (serverless) |
| Auth | JWT in cookies | NextAuth.js v5 (JWT strategy) |
| Database | Mongoose on Render | Mongoose w/ serverless connection cache |
| Cron | node-cron (breaks on sleep) | **Vercel Cron Jobs** ✅ |
| Hosting | Vercel + Render (2 services) | **Vercel only** ✅ |

---

## 🚀 Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` → `.env.local` and fill in:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/pingwish
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=http://localhost:3000
EMAIL_USER=your@gmail.com
EMAIL_PASS=your-gmail-app-password
CRON_SECRET=<any random string>
```

> **Gmail App Password**: Go to Google Account → Security → 2-Step Verification → App Passwords → generate one for "Mail".

### 3. Run locally

```bash
npm run dev
```

---

## 📁 Project Structure

```
pingwish/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts   ← NextAuth handler
│   │   │   └── register/route.ts        ← Registration endpoint
│   │   ├── birthdays/
│   │   │   ├── route.ts                 ← GET all, POST new
│   │   │   └── [id]/
│   │   │       ├── route.ts             ← PUT update, DELETE
│   │   │       └── toggle/route.ts      ← PUT toggle reminder
│   │   └── cron/
│   │       └── send-reminders/route.ts  ← Called by Vercel Cron
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── dashboard/page.tsx
│   ├── layout.tsx
│   ├── providers.tsx
│   └── globals.css
├── components/
│   ├── AuthCard.tsx
│   ├── DashboardClient.tsx
│   ├── BirthdayForm.tsx
│   └── BirthdayList.tsx
├── lib/
│   ├── mongodb.ts       ← Serverless connection caching
│   ├── auth.ts          ← NextAuth config
│   └── mailer.ts        ← Nodemailer
├── models/
│   ├── User.ts
│   └── Birthday.ts
├── types/
│   └── next-auth.d.ts
└── vercel.json          ← Cron schedule
```

---

## ⏰ How the Cron Works

`vercel.json` schedules a daily hit to `/api/cron/send-reminders` at **3:30 UTC = 9:00 AM IST**.

```json
{
  "crons": [{ "path": "/api/cron/send-reminders", "schedule": "30 3 * * *" }]
}
```

The endpoint is protected by `CRON_SECRET` — Vercel automatically sends it as a Bearer token.

> ✅ No more Render sleep issues. Vercel Cron is always-on.

---

## 🔐 Auth Flow (NextAuth v5)

1. User registers → `POST /api/auth/register` (creates User in MongoDB)
2. User logs in → NextAuth `signIn("credentials", ...)` → verifies password → issues JWT session cookie
3. All API routes call `auth()` server-side to get the session — no middleware needed
4. Dashboard is a **Server Component** — session is checked server-side, no flash of unauthenticated content

---

## 🚢 Deploy to Vercel

```bash
# Push to GitHub, then:
vercel deploy
```

**Required environment variables on Vercel:**
- `MONGODB_URI`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL` → set to your production URL e.g. `https://pingwish.vercel.app`
- `EMAIL_USER`
- `EMAIL_PASS`
- `CRON_SECRET`

---

## 🔄 Migrating Existing Data

Your MongoDB Atlas data is **fully compatible** — same schema, same collection names. Just point `MONGODB_URI` to your existing Atlas cluster and all birthdays/users will be there.

---

## ✨ What's New vs Old Version

- 🚫 No more Render cold starts / sleep
- ✅ Single deployment on Vercel
- ✅ Server-side auth checks (no redirect flicker)
- ✅ Upcoming birthday countdown banner
- ✅ Age display on each card
- ✅ Color-coded avatar initials
- ✅ Animated stats row (total, days until next, reminders on)
- ✅ HTML email templates (not plain text)
- ✅ TypeScript throughout
- ✅ `react-hot-toast` (lighter than react-toastify)
