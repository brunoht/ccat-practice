# Agent instructions

## Documentation ownership

Do not duplicate content across `README.md`, this file, and on-demand rules.

| File | Owns |
|------|------|
| `README.md` | Project purpose, what this repo is, and what to expect in files and directories |
| `AGENTS.md` | Project architecture for agents, design decisions, and global agent behavior |
| `.cursor/rules/` | Always-apply and on-demand rules (formats and workflows live in the rule files) |

When purpose, layout, or expected contents change, update `README.md`. When agent rules, architecture constraints, or design decisions change, update this file. Prefer linking or referring to the other file over copying.

Rules in `.cursor/rules/` (do not copy their details here):

| Rule | When to use |
|------|-------------|
| [session-buffer](.cursor/rules/session-buffer.mdc) | Always — append a short entry to `journal/session-buffer.md` after meaningful work |
| [diary](.cursor/rules/diary.mdc) | When consolidating the session buffer into `journal/diary.md` |
| [bookmarks](.cursor/rules/bookmarks.mdc) | Adding or organizing links in `research/bookmarks.md` |

## Architecture

- Study hub of notes, drills, and research — not a product, app, or library
- Directory roles and suggested layout: see `README.md`
- Create folders only when adding real content; do not invent empty scaffolding
- When unsure where a file belongs, use the closest directory described in `README.md` and name it clearly in English

## Design decisions

- Prefer materials and timed practice over shipping software unless the user explicitly asks for tooling
- Persisted artifacts must be in **English** (notes, practice items, research, commits, code, comments, filenames)
- Chat may be in the user's language (including Portuguese); never save non-English content into the repo
- Content should be short, scannable, and actionable — no fluff
- Mistake logs should include: question type, error cause (concept / rush / misread), and a short fix
- Cite sources in `research/` when claims depend on external info
- Align new material with CCAT areas: verbal, numerical, spatial/logic
- Update `README.md` only when structure or purpose meaningfully changes
- After meaningful work, append to `journal/session-buffer.md`; write `journal/diary.md` only when the user asks (see rules)

## Agent behavior

### Help with

- Organizing study materials and keeping the repo structure coherent with `README.md`
- Creating practice questions, drills, and timed-mock outlines
- Capturing strategies, mistake logs, and concise research notes
- Answering process-related questions and turning them into durable notes when useful
- Improving speed and accuracy under CCAT-like constraints

### Avoid

- Treating this as a production codebase or over-engineering structure
- Creating large frameworks, apps, or tooling without an explicit request
- Padding notes with fluff
- Committing, pushing, or opening PRs unless the user asks
- Saving Portuguese (or other non-English) content into the repository
- Repeating `README.md` content here

### Working style

- Infer intent from chat context; ask only when blocked
- Match existing tone: direct, practical, preparation-focused
- Log meaningful progress in the session buffer; consolidate into the diary only on request
