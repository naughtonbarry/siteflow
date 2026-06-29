# SiteFlow

A single-file project-workflow web app for construction / fit-out / relocation projects. Built for Barry Naughton.

## The one thing to know first

**The app is `index.html`.** It was renamed from `siteflow.html` → `index.html` so GitHub Pages serves it at the repo root. Any reference to `siteflow.html` is stale — there is no `siteflow.html` on disk. Edit `index.html`.

## Run & deploy

- **Live URL:** https://naughtonbarry.github.io/siteflow/ (GitHub Pages, auto-deploys on push to `main`)
- **Local:** Python HTTP server on port 3456 via `.claude/launch.json` → open `http://localhost:3456/` (NOT `/siteflow.html`). Start with `preview_start("siteflow")`.
- **Auto-push:** a `PostToolUse` hook in `.claude/settings.json` runs `git add index.html && git commit && git push` after every Edit/Write to `index.html`. So changes go live automatically — no manual git needed for the app file.

## Tech & structure

- Single HTML file. **Alpine.js 3.x** + **Tailwind CSS**, both from CDN. No build step, no Node — opens directly in a browser.
- All app logic lives in the `siteflow()` function near the bottom of the file (mounted via `x-data="siteflow()"`).

## Data model (important)

Data lives in a module-level `_store` object, mirrored to `localStorage` under the `sf_` key prefix. It survives even when localStorage is blocked.

- **Read:** `getData(key)` → returns `_storeGet(key)` (an array). Keys: `projects`, `tasks`, `users`, `invites`, `accessLog`, `announcements`, `moodboardItems`.
- **Write:** `saveData(key, arr)` → calls `_storeSet` and bumps `this._tick`.

### Reactivity rule — do not remove `void this._tick`

Store-backed getters (`get projects()`, `get projectTasks()`, etc.) read from plain-JS `_store`, which is **outside** Alpine's reactivity. Each of these getters calls `void this._tick;` so Alpine tracks `_tick` as a dependency, and `saveData` increments `_tick` to force a re-render. If you add a new getter that reads from `_store`, start it with `void this._tick;` or the UI won't update when data changes.

## Auth & roles

- **Admin login:** `admin@siteflow.ie` / `admin123` (admin display name: **Barry Naughton**)
- **Roles:** `admin`, `client`, `team`, `contractor`, `driver` — each sees filtered task/announcement views.
- New users join via an invite-code flow (admin generates a code; there's also a mailto invite-email button).

## Features

Dashboard (stats, progress, latest updates, my tasks) · Kanban task board (To Do / In Progress / Done, role-filtered) · Site Access Register (sign in/out, induction, today's log) · Updates/announcements feed (per-role visibility) · Moodboard (add images by URL or upload, masonry grid, lightbox) · Admin: project management, user invites, user removal.

**Pre-loaded demo project:** Mater Hospital Department Relocation — 3 departments (Radiology, Cardiology, Outpatients) moving to an open-plan office in the Freight Building. ~12 tasks, sample access entries, 3 announcements.

## Other files in this folder

This directory also holds unrelated standalone experiments (`photo-calendar.html`, `video-reply-tool/`, etc.). They are not part of SiteFlow — only `index.html` is the deployed app.
