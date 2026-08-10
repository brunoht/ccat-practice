# Session buffer

Temporary append-only log of meaningful agent work. Consolidated into `journal/diary/YYYY-MM-DD.md` on request, then cleared.

Buffer cleared after diary consolidation through 2026-08-10.

### 2026-08-10 — diary buffer appendix rule
- Area: process
- Done: Updated `.cursor/rules/diary.mdc` so consolidation moves that day’s buffer entries unchanged to the end of `journal/diary/YYYY-MM-DD.md` (summary stays at top); aligned diary README
- Evolved: Diary files keep both a short day summary and the full raw buffer log for that day

### 2026-08-10 — track simulator attempts
- Area: project
- Done: Removed `attempts/attempt-*.json` from `projects/ccat-simulator/.gitignore`
- Evolved: Attempt JSON files can be committed
