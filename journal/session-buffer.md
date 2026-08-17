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

### 2026-08-17 — ccat-16s skill
- Area: process
- Done: Added project skill `.cursor/skills/ccat-16s/` (16s scan coaching for any CCAT type; example on request; practice as simulator JSON) and registered it in `AGENTS.md`
- Evolved: Agent coaches read/think/kill without giving the live answer; warmup drills go to `projects/ccat-simulator/tests/` instead of chat
- Next (optional): Point at a simulation item and ask for the 16s scan, then a cousin example or a simulator drill

### 2026-08-17 — rewrite day reflection
- Area: process
- Done: Rewrote `journal/reflections/2026-08-17.md` to match the English bullet format of prior days; removed misnamed `2025-08-17.md`
- Evolved: Today’s perceptions captured as mood, progress, load, and agents/process instead of Portuguese paragraphs
