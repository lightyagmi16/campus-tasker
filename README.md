Campus Tasker – Public Feed Build
=================================
- Bottom nav uses lucide-react icons (minimal, no emojis).
- Feed is public (no login required to view tasks).
- Posting/chat/profile/history require login.
- Realtime updates: new tasks appear instantly on the feed.

Run locally
-----------
1) npm install
2) npm run dev
3) Open http://localhost:3000

Supabase setup (once)
---------------------
1) In Supabase → Auth → URL Config: add http://localhost:3000/auth/callback
2) In Supabase → SQL Editor: run supabase_policies.sql
3) Confirm 'tasks' table exists with 'creator' (uuid), 'created_at' (default now()).

Notes
-----
- Supabase keys are hardcoded in lib/supabaseClient.js for your project ID.
- You can later move them to .env.local if you prefer.
# campus-tasker
