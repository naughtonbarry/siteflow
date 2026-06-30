# VidReply

A personal **video-reply tool for furniture retailers** answering web enquiries.

A retailer sees inbound website questions in an inbox, records a face-to-camera
video answer tied to the product asked about, and sends it as an SMS/WhatsApp
link. The customer watches on a branded page, taps a call-to-action, and can
reply.

> **Status: front-end demo with mock data.** This is not a product yet. Some
> pieces are real, most are deliberately faked — see the table below.

## Run it

No build step. The JSX is compiled in the browser by Babel, so the files must be
**served over HTTP** (not opened as a `file://` URL):

```bash
cd video-reply-tool
python3 -m http.server 5180
# open http://localhost:5180/
```

Recording the webcam needs a secure context — `localhost` is fine, a plain-`http`
LAN IP is not.

## What's real vs. faked

| Piece | Status |
|---|---|
| Webcam capture + recording (`getUserMedia` / `MediaRecorder`) | **Real** |
| Video hosting / upload | **Faked** — clip is an in-memory object URL; a refresh loses it |
| SMS/WhatsApp delivery | **Faked** — the message + link are a static preview |
| Persistence (enquiries, clips, replies) | **Faked** — in-memory React state only |
| Customer reply round-trip | **Faked** — stored in state, never delivered |

Every faked piece is labelled in the UI with a dashed ⚠️ note. The intent is to
never let a faked piece look real.

## Stack

React 18 + Tailwind, both via CDN, with in-browser Babel — no Node/npm/bundler.
This matches the host machine (no toolchain installed) and keeps the demo a set
of static files. If a real toolchain is added later, migrate to Vite and drop
the Babel `<script>`.

## Layout

```
index.html      CDN loader (React, ReactDOM, Babel, Tailwind) + #root
src/App.jsx     the entire demo in one file (to be split in the refactor)
CLAUDE.md       working context for Claude Code
README.md       this file
```

## Roadmap

1. ~~Refactor `src/App.jsx` into per-component files~~ — ✅ done.
2. ~~Saved-clips library~~ — ✅ done. Record canned answers once and reuse them,
   mixing canned + personal clips per enquiry (still simulated/in-memory).
3. **Real SMS/WhatsApp delivery** — the next step; needs a backend and a
   messaging provider.
