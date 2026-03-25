---
name: git-branch
description: "Create a new branch based on the current branch and switch to it. Use when: new branch, nowy branch, stwórz branch, utwórz branch, branch off, kontynuacja."
argument-hint: "Optional: custom branch name"
---

# Git Branch — Create & Switch

Create a new branch from the current HEAD and check it out.

## Procedure

1. **Current state** — Run `git branch --show-current` to get the current branch name
2. **Generate name** — If no custom name provided, derive from current branch:
   - Pattern: `<prefix>-<YYYYMMDD>-kontynuacja-<N>`
   - Use today's date for `YYYYMMDD`
   - Increment `N` from current branch name (e.g., `kontynuacja-4` → `kontynuacja-5`)
   - If current branch doesn't follow the pattern, ask the user for a name
3. **Create & switch** — Run `git checkout -b <new-branch-name>`
4. **Confirm** — Report the new branch name and that it's based on the previous branch

## Rules

- Never delete or modify the source branch
- If the branch name already exists, inform the user and suggest an alternative
- If the user provides an explicit name, use it as-is (no auto-numbering)
