---
name: git-push
description: "Stage, commit, and push all changes to the current branch on GitHub. Use when: saving work, pushing code, committing changes, sending to GitHub, wypchnij zmiany, zapisz zmiany."
argument-hint: "Optional: custom commit message or scope"
---

# Git Push — Commit & Push Current Branch

Stage all changes, create a conventional commit, and push to the remote branch.

## Procedure

1. **Review** — Run `git status --short` to list all modified/new/deleted files
2. **Stage** — Run `git add -A` to stage everything
3. **Commit message** — Generate a [Conventional Commits](https://www.conventionalcommits.org/) message:
   - Format: `<type>(<scope>): <description>`
   - Types: `feat`, `fix`, `refactor`, `style`, `docs`, `chore`, `perf`, `test`
   - Scope: infer from changed files (e.g., `onboarding`, `ui`, `data`)
   - Description: concise summary in English, imperative mood
   - Body (optional): bullet list of key changes if >3 files changed
4. **Commit** — Run `git add -A ; git commit -m "<message>"`
5. **Push** — Run `git push` (or `git push -u origin <branch>` if no upstream is set)
6. **Confirm** — Report commit hash, branch name, and file count

## Rules

- Never use `--force` or `--no-verify` without explicit user approval
- If `git status` shows no changes, inform the user and stop
- If push fails due to no upstream, set it with `git push -u origin HEAD`
- If push fails due to diverged history, inform the user — do not force push
