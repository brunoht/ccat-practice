# CCAT Practice Simulator

Minimal Node/Express timed mock that mirrors real CCAT constraints (one-way questions, global timer).

## Run

```bash
cd projects/ccat-simulator
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

## Layout

| Path | Role |
|------|------|
| `tests/*.json` | Practice exams (questions + answer key) |
| `attempts/` | Saved attempt metrics after each run |
| `public/` | Browser UI |
| `server.js` | Static files + REST API |

## Test file format

See `tests/sample-short.json`. Each question needs `id`, `area` (`verbal` | `numerical` | `spatial` | `logic`), `stem`, `choices`, and `answerIndex` (0-based).
