# VidReply — project context for Claude Code

## What this is
A personal **video-reply tool for furniture retailers** answering web enquiries.
A retailer sees inbound website questions in an inbox, records a face-to-camera
video answer tied to the product asked about, and sends it as an SMS/WhatsApp
link. The customer watches on a branded page, taps a call-to-action, and can
reply.

This is currently a **single-file front-end demo with mock data**. It is not a
product yet.

## How to run
No build step. Served as static files over HTTP (Babel compiles the JSX in the
browser, so it must be `http://`, not `file://`):

```
cd video-reply-tool
python3 -m http.server 5180
# open http://localhost:5180
```

> Note: this folder uses React via CDN + in-browser Babel because the host
> machine has no Node/npm/Homebrew. If a real toolchain is added later, migrate
> to Vite (`npm run dev`) and drop the Babel `<script>`.

## File layout (current)
- `index.html` — CDN loader. Sets up `window.VR = {}`, then fetches each
  `src/*.jsx` file, compiles it with Babel's **classic** JSX runtime, and
  appends it as a `<script>` **in dependency order**.
- `src/*.jsx` — one module per file. Each is an IIFE that reads its
  dependencies off the global `VR` namespace and writes its export(s) back
  (e.g. `VR.Inbox = Inbox`). Load order (set in `index.html`):
  `data → format → ui → ClipPlayer → Recorder → AnswerPanel → EnquiryCard
  → Inbox → CustomerView → App`. `App.jsx` is last and mounts to `#root`.

### Why the `VR` namespace and not ES modules
No bundler here, and plain (non-module) `<script>`s share one global lexical
scope — so separate files **cannot** each do `const {useState} = React`
(that collides). Wrapping each file in an IIFE isolates its locals, and the
`VR` object is the explicit import/export channel. True `import`/`export`
only arrive if the project migrates to Vite (see the toolchain note above).

## Demo-vs-product gap (be honest about this in the UI)
| Piece | Status |
|---|---|
| Webcam capture + recording (getUserMedia / MediaRecorder) | **Real** |
| Video hosting / upload | **Faked** — clip is an in-memory object URL; refresh loses it |
| SMS/WhatsApp delivery | **Faked** — message + link are a static preview |
| Persistence (enquiries, clips, replies) | **Faked** — in-memory React state only |
| Customer reply round-trip | **Faked** — stored in state, never delivered |

Every faked piece is labeled in the UI with a dashed "⚠️" `DemoNote`. Do not let
a faked piece look real.

## Roadmap (in priority order)
1. ~~**Refactor** the single-file `App.jsx` into per-component files.~~ ✅ Done —
   split into `src/*.jsx` IIFE modules over the `VR` namespace, no behaviour
   change.
2. **Saved-clips library** — record canned answers to common questions (fabric
   care, dimensions, lead times) once and reuse them, mixing canned + personal
   clips per enquiry. **Highest-value next feature → this is now next.**
3. **Real SMS/WhatsApp delivery** — the first true product priority. Needs a
   backend + a messaging provider. Do **not** start unprompted; ask first.

## Known gaps / flagged bugs
- **Object-URL leak** (`Recorder`): recorded-clip object URLs are never
  `revokeObjectURL`'d. Not fixed because the URL is consumed by `ClipPlayer`/
  `CustomerView` for the clip's lifetime — revoking needs clip-lifecycle
  ownership at the `App` level, not inside `Recorder`.

## Ground rules
- Keep the demo runnable at every step.
- Be honest about the demo-vs-product gap.
- Ask before adding dependencies or a backend.
- Small, reviewable commits — this goes to GitHub.
