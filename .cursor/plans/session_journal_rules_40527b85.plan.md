---
name: Session journal rules
overview: Add an always-on session buffer rule plus an on-demand diary consolidation workflow under `journal/`, so agents log high-level progress and you can later fold that into a study/project diary.
todos:
  - id: add-journal-files
    content: Create journal/session-buffer.md and journal/diary.md with purpose headers and entry templates
    status: completed
  - id: add-session-buffer-rule
    content: Add alwaysApply session-buffer.mdc with skip/append criteria and entry format
    status: completed
  - id: add-diary-rule
    content: Add on-demand diary.mdc for consolidate-and-clear workflow
    status: completed
  - id: update-docs
    content: Update README.md layout and AGENTS.md rule registry / ownership wording
    status: completed
isProject: false
---

# Session buffer and diary rules

## Goal

Track **project evolution** and **CCAT study evolution** via:

1. A temporary append-only buffer written by every agent after meaningful work
2. A diary consolidated only when you ask

No verbatim Q&A dumps — short, scannable action summaries in English (repo language rule).

## Files to add

| Path | Role |
|------|------|
| [`journal/session-buffer.md`](journal/session-buffer.md) | Append-only working memory between diary writes |
| [`journal/diary.md`](journal/diary.md) | Consolidated dated entries |
| [`.cursor/rules/session-buffer.mdc`](.cursor/rules/session-buffer.mdc) | `alwaysApply: true` — when/how to append |
| [`.cursor/rules/diary.mdc`](.cursor/rules/diary.mdc) | On-demand — consolidate buffer → diary when you ask |

## Buffer rule (global)

Frontmatter: `alwaysApply: true`.

Behavior:

- At the **end of a turn** that produced meaningful progress (repo edits, new study materials, strategy decisions, practice outcomes worth tracking), **append one short entry** to `journal/session-buffer.md`
- **Skip** pure clarifications, failed/aborted work, or turns with no durable outcome
- Keep entries high-level: what changed / what was practiced / what was decided — not full chat transcripts
- English only; bullets, not paragraphs
- Do not invent progress; only log what actually happened in that turn

Suggested entry shape:

```markdown
### YYYY-MM-DD — short label
- Area: project | study (verbal/numerical/spatial) | process
- Done: …
- Evolved: … (vs prior state, if clear)
- Next (optional): …
```

Seed `journal/session-buffer.md` with a one-line purpose header + empty section note so the file exists and format is obvious.

## Diary rule (on-demand)

Frontmatter: `alwaysApply: false`, description triggers on phrases like “update diary”, “write diary”, “consolidate journal”, “diary entry”.

Behavior (only when requested):

1. Read `journal/session-buffer.md` and the latest entry in `journal/diary.md`
2. Write **one new diary entry** summarizing what evolved since the last diary (project + study), not a dump of every buffer bullet
3. Clear or archive consumed buffer content (replace with header + “Buffer cleared after diary YYYY-MM-DD”) so the next cycle starts clean
4. Keep diary entries short and scannable; English

Suggested diary entry shape:

```markdown
## YYYY-MM-DD
- Project: …
- Study: …
- Gaps / focus next: …
```

Seed `journal/diary.md` with a short purpose header and no fake first entry.

## Docs updates (no duplication)

Per [`AGENTS.md`](AGENTS.md) ownership:

- [`README.md`](README.md): add `journal/` to the suggested layout (buffer + diary purpose in one line)
- [`AGENTS.md`](AGENTS.md):
  - Clarify that `.cursor/rules/` holds both always-apply and on-demand rules
  - Register both rules in the on-demand/global table (session-buffer = always; diary = when consolidating)
  - One-line pointer under Design decisions / Agent behavior: agents append to the session buffer after meaningful work; diary only on request

Do **not** copy full formats into `AGENTS.md` — formats live in the `.mdc` rules.

## Out of scope

- No tooling/app to automate diary writes
- No commits unless you ask later
- No Portuguese in persisted files
