---
name: CCAT Node Simulator
overview: Create a minimal Node/Express CCAT practice simulator under `projects/ccat-simulator/` that lists test JSONs, runs a timed exam matching real CCAT rules, and persists attempt results for later analysis.
todos:
  - id: scaffold
    content: Scaffold projects/ccat-simulator with package.json, Express server, public/, tests/, attempts/
    status: completed
  - id: api
    content: Implement GET /api/tests, GET /api/tests/:filename, POST /api/attempts with validation and empty-dir handling
    status: completed
  - id: ui-flow
    content: Build select → setup (editable timing) → exam → results UI with light/dark theme
    status: completed
  - id: exam-rules
    content: "Implement CCAT-like exam: one-way navigation, global timer, auto-submit, per-question timing"
    status: completed
  - id: sample-test
    content: Add sample-short.json and wire README for projects/ + how to run
    status: completed
isProject: false
---

# CCAT Simulator (Node + Express)

## Location

```text
projects/ccat-simulator/
├── package.json          # dependency: express only
├── server.js             # static + REST API
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── tests/                # practice exam JSON files
│   └── sample-short.json # small starter set so the UI is usable
└── attempts/             # written by the server after each run
```

Also update [README.md](README.md) to document the new `projects/` role (simulator tooling lives here).

## Stack decisions

- **Node + Express only** — no frontend framework, no bundler, no DB
- Serve `public/` as static files; JSON I/O via REST against the project folders
- UI and saved JSON content in **English** (repo policy); chat can stay in Portuguese
- Default run: `npm start` → `http://localhost:3000`

## Test JSON schema

Each file in `tests/*.json`:

```json
{
  "id": "sample-short",
  "title": "Sample Short Mock",
  "questions": [
    {
      "id": "q1",
      "area": "numerical",
      "stem": "What is 12% of 50?",
      "choices": ["4", "6", "8", "12"],
      "answerIndex": 1
    }
  ]
}
```

- `area`: `verbal` | `numerical` | `spatial` | `logic` (for gap analysis later)
- `answerIndex`: 0-based index into `choices`
- Invalid/malformed files are skipped in the list (or returned with a clear load error when selected)

## API

| Method | Path | Behavior |
|--------|------|----------|
| `GET` | `/api/tests` | List `*.json` basenames in `tests/`; empty → `{ "tests": [] }` |
| `GET` | `/api/tests/:filename` | Load and validate one test file |
| `POST` | `/api/attempts` | Write attempt JSON to `attempts/`; filename includes local date-time |

No directory listing from the browser filesystem — the server reads/writes disk.

## UI flow

1. **Select test** — dropdown/list from `GET /api/tests`. If empty: message “No tests available” and **Next** disabled. Theme toggle (light/dark) persisted in `localStorage`.
2. **Next** — enabled only after a file is selected.
3. **Setup screen** — load selected JSON; show question count `N`.
4. **Timing** — base rate from real CCAT: `15 * 60 / 50 = 18` seconds/question. Suggested total = `N * secondsPerQuestion`. Show both fields; editing seconds/question live-updates total (and optionally editing total updates seconds/question rounded).
5. **Start** — begin exam with chosen total seconds.
6. **Exam (real CCAT-like)**  
   - One question at a time  
   - **No going back**  
   - Global countdown only (not per-question hard lock)  
   - Select choice → Confirm / Next (records answer + elapsed ms for that item)  
   - Unanswered remaining when time hits 0 are stored as null  
   - Auto-finish on timer end  
   - No calculator affordance  
7. **Results** — score summary on screen; server persists the attempt file.

## Attempt JSON (saved)

Filename pattern: `attempt-YYYYMMDD-HHMMSS.json` (local time).

Contents (enough for future analysis / gap-driven mocks):

- Meta: `testId`, `testFile`, `startedAt`, `finishedAt`, `durationSecondsConfigured`, `durationSecondsUsed`, `questionCount`
- Aggregates: `correctCount`, `answeredCount`, `unansweredCount`, `accuracy`, `averageMsPerQuestion` (over answered items; also store overall mean including unanswered as needed)
- By area: counts correct/wrong/unanswered
- `items[]`: for every question — `questionId`, `area`, `selectedIndex` (or `null`), `correctIndex`, `isCorrect`, `timeMsSpent`
- Full answer key mirror: selected vs correct for all items (including blanks)

## Frontend structure

Single-page wizard in vanilla JS (`public/app.js`):

- Screens: `select` → `setup` → `exam` → `results`
- CSS variables for light/dark themes in `styles.css`
- Keep UI minimal and scannable — study tool, not a product shell

## Sample content

Ship one short `tests/sample-short.json` (~5–8 mixed-area items) so empty-directory and happy-path both work out of the box.

## Docs touchpoints

- [README.md](README.md): add `projects/` to the layout tree and one line that the CCAT simulator lives at `projects/ccat-simulator/`
- Optional short run note inside the simulator folder only if needed for `npm install && npm start` (keep tiny)

## Out of scope (this pass)

- Auto-generating new mocks from gaps
- Auth, multi-user, analytics dashboards
- Image-based spatial items beyond text stems (schema can grow later with optional `image` field if needed)
