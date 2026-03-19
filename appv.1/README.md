# Bellajour — Frontend

A premium, editorial-style web application for the Bellajour AI-powered photo album platform. Built with Next.js and Tailwind CSS.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | JavaScript |
| Styling | Tailwind CSS + Custom CSS |
| Animations | CSS transitions + Framer Motion |
| Fonts | Cormorant (serif) + Jost (sans) via Google Fonts |
| API | Django REST Framework (backend) |

---

## Project Structure

```
bellajour-frontend/
├── app/
│   ├── page.js                     # Landing page
│   ├── globals.css                 # Global styles & CSS variables
│   ├── upload/
│   │   └── page.js                 # Photo upload + intent selector
│   ├── processing/
│   │   └── [jobId]/
│   │       └── page.js             # Live job status with auto-polling
│   └── preview/
│       └── [jobId]/
│           └── page.js             # Ranked photo results + score breakdown
├── public/                         # Static assets
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## Pages

### `/` — Landing Page
- Hero section with decorative album card stack
- How it works (3 steps)
- Feature grid (4 AI engines)
- Stats row
- CTA section

### `/upload` — Upload Page
- Drag & drop photo upload
- File preview with remove option
- Album intent selector (general / family / travel / portrait / event)
- Connects to `POST /api/upload/`

### `/processing/[jobId]` — Processing Page
- Auto-polls `GET /api/status/<jobId>/` every 2 seconds
- Animated progress indicator
- Stage tracker: Uploading → Scoring → Done
- Auto-redirects to preview when job completes

### `/preview/[jobId]` — Preview Page
- Displays best photo with full score breakdown
- Photo grid ranked by AI score (best to worst)
- Score bars: resolution, ratio, orientation
- Click any photo to see its detailed breakdown

---

## Getting Started

### Prerequisites
- Node.js 18+
- Backend running at `http://127.0.0.1:8000` (see backend README)

### Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Environment

By default the frontend connects to:

```
http://127.0.0.1:8000
```

To change the API URL for production, update the fetch URLs in:
- `app/upload/page.js`
- `app/processing/[jobId]/page.js`
- `app/preview/[jobId]/page.js`

Or create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

And replace hardcoded URLs with `process.env.NEXT_PUBLIC_API_URL`.

---

## Full User Flow

```
/ (Landing)
    ↓ Click "Create my album"
/upload
    ↓ Drop photos + select intent + click Generate
/processing/[jobId]
    ↓ Auto-polls every 2s until status = "completed"
/preview/[jobId]
    ↓ View ranked photos + score breakdown
```

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| `--white` | `#FFFFFF` | Page background |
| `--snow` | `#F9F7F4` | Section alternates |
| `--linen` | `#F2EDE6` | Card backgrounds |
| `--gold` | `#B8954A` | Primary accent |
| `--ink` | `#1A1714` | Primary text |
| `--slate` | `#4A4540` | Body text |
| `--fog` | `#9A948E` | Muted text |
| `--border` | `#E2DAD0` | Borders & dividers |

Fonts:
- **Cormorant** — display, headings, editorial feel
- **Jost** — body, buttons, UI labels

---

## Architecture Notes

- No external state management — React `useState` only
- All API calls are direct `fetch()` calls, no wrapper library
- Processing page uses `setInterval` polling (2s) with cleanup on unmount
- Preview page sorts photos by score (handled server-side via Django)
- Fully responsive — mobile breakpoint at 900px

---

## Scripts

```bash
npm run dev       # Start development server (port 3000)
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## Related

- [Bellajour Backend](../server/README.md) — Django REST API, Celery pipeline, scoring engine

---

*Built as part of the Bellajour V1 test task.*
