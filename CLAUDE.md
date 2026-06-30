# SiteFlow

A single-file project-workflow web app for construction / fit-out / relocation projects. Built for Barry Naughton.

## The one thing to know first

**The app is `index.html`.** It was renamed from `siteflow.html` → `index.html` so GitHub Pages serves it at the repo root. Any reference to `siteflow.html` is stale — there is no `siteflow.html` on disk. Edit `index.html`.

## Run & deploy

- **Live URL:** https://naughtonbarry.github.io/siteflow/ (GitHub Pages, auto-deploys on push to `main`)
- **Local:** Python HTTP server on port 3456 via `.claude/launch.json` → open `http://localhost:3456/` (NOT `/siteflow.html`). Start with `preview_start("siteflow")`.
- **Auto-push:** a `PostToolUse` hook in `.claude/settings.json` runs `git add index.html && git commit && git push` after every Edit/Write to `index.html`. So changes go live automatically — no manual git needed for the app file. **The hook only commits `index.html`** — any OTHER new file (icons, manifest, etc.) must be `git add`/committed manually.
- **No Jekyll:** a `.nojekyll` file makes Pages serve everything as-is. The repo has a Jekyll Actions workflow AND the default Pages build; they competed and a deploy adding new static assets failed until `.nojekyll` was added. Keep `.nojekyll`. If new static files 404, check the Pages build in the Actions tab.
- **Installable PWA:** `manifest.webmanifest` + `<link rel="apple-touch-icon">`/`apple-mobile-web-app-*` meta in `<head>` + icon files (`icon-192.png`, `icon-512.png`, `apple-touch-icon.png`, a white house on indigo `#4f46e5`). Lets users "Add to Home Screen" and get an app icon. Regenerate icons by drawing a 512 PNG (no Pillow/ImageMagick on this machine — use a stdlib zlib PNG writer) then `sips -z` to derive 192/180.

## Tech & structure

- Single HTML file. **Alpine.js 3.x** + **Tailwind CSS**, both from CDN. No build step, no Node — opens directly in a browser.
- All app logic lives in the `siteflow()` function near the bottom of the file (mounted via `x-data="siteflow()"`).

## Data model (important)

In memory, data lives in a module-level `_store` object. `getData(key)` reads it, `saveData(key, arr)` writes it (and bumps `this._tick`). Keys: `projects`, `tasks`, `users`, `invites`, `accessLog`, `announcements`, `moodboardItems`.

**Persistence is Supabase first, not localStorage.** This is the #1 gotcha — read it before adding fields:

- On load, `_storeInit()` populates `_store` **from Supabase** (project `jxziiznrgtzoroatauul`, anon key in the file). `localStorage` (`sf_` prefix) is only a fallback for keys *not* backed by a Supabase table — i.e. `moodboardItems` (no table) persists via localStorage; everything in `_TABLE` (`users`, `projects`, `tasks`, `accessLog`, `announcements`, `invites`) persists via Supabase. **For those, localStorage writes are ignored on reload.**
- `saveData` writes to `_store`, localStorage, AND upserts to Supabase via `_toRow` (camelCase→snake_case using the `_TO_DB` maps).

### Adding a field to a Supabase-backed entity (e.g. tasks)

You must do BOTH or the field silently vanishes on reload (the upsert fails with "Could not find the 'X' column", error is swallowed):
1. Add the mapping to `_TO_DB.<entity>` — e.g. `assigneeId:'assignee_id'`. Unmapped fields are sent as-is (camelCase) and rejected by Postgres.
2. Add the column in Supabase (SQL editor): `alter table sf_tasks add column if not exists assignee_id text;` (use `jsonb` for arrays/objects like `history`). The anon key can't run DDL — the user must do this in the dashboard.

Verify with `preview_console_logs` (level error) — `SB upsert: Could not find the 'X' column` means a mapping/column is missing.

### Reactivity rule — do not remove `void this._tick`

Store-backed getters (`get projects()`, `get projectTasks()`, etc.) read from plain-JS `_store`, which is **outside** Alpine's reactivity. Each of these getters calls `void this._tick;` so Alpine tracks `_tick` as a dependency, and `saveData` increments `_tick` to force a re-render. If you add a new getter that reads from `_store`, start it with `void this._tick;` or the UI won't update when data changes.

## Auth & roles

- **Admin login:** `admin@siteflow.ie` / `admin123` (admin display name: **Barry Naughton**)
- **Roles:** `admin`, `client`, `team`, `contractor`, `driver` — each sees filtered task/announcement views.
- New users join via an invite-code flow (admin generates a code; there's also a mailto invite-email button).

## Features

Dashboard (stats, progress, latest updates, my tasks) · Kanban task board (To Do / In Progress / Done, role-filtered) · Site Access Register (sign in/out, induction, today's log) · Updates/announcements feed (per-role visibility) · Moodboard (add images by URL or upload, masonry grid, lightbox) · Admin: project management, user invites, user removal.

**Task ownership & history:** tasks have `assigneeId` (a specific person, shown as an avatar chip on each board card and an "Assigned to" dropdown in the modal — `assignableMembers` lists project members) plus `assignedRole` (kept for visibility filtering; auto-synced from the assignee's role via `onAssigneeChange`). Each task carries a `history` array recording `created` / `assigned` / `moved` events with the actor (`_actor()` = current user) and timestamp; rendered as the "Activity" timeline in the task modal. `myTasks` prefers personal assignment over role.

**Pre-loaded demo project:** Mater Hospital Department Relocation — 3 departments (Radiology, Cardiology, Outpatients) moving to an open-plan office in the Freight Building. ~12 tasks, sample access entries, 3 announcements.

## Other files in this folder

This directory also holds unrelated standalone experiments (`photo-calendar.html`, `video-reply-tool/`, etc.). They are not part of SiteFlow — only `index.html` is the deployed app.
