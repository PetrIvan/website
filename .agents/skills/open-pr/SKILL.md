---
name: open-pr
description: Open or update a GitHub pull request for the current branch after its work is committed. Use when the user asks to open, create, publish, refresh, or update a PR.
---

# Open Pull Request Protocol

Use committed branch state as the PR source. Leave unrelated uncommitted work
untouched.

## Preconditions

1. Read `AGENTS.md`.
2. Confirm the repository, remote, and GitHub CLI authentication exist.
3. Determine the base branch, defaulting to `main`.
4. Confirm the current branch is not the base branch.

```powershell
git status --short
git branch --show-current
git remote -v
gh auth status
```

Do not create a PR from `main`. Do not commit local changes implicitly.

## Prepare the branch

Push without force:

```powershell
git push -u origin HEAD
```

Check for an existing pull request:

```powershell
gh pr view --json number,url,title,body,baseRefName
```

Update an existing PR for the branch instead of opening a duplicate.

## Write the PR

Fetch the base and review the complete branch delta:

```powershell
git fetch origin main
git log --oneline origin/main..HEAD
git diff --stat origin/main..HEAD
git diff origin/main..HEAD
```

Replace `main` when another base was requested.

Use this body shape, omitting empty sections:

```markdown
## Summary

<What this changes and why>

## Changes

- <Coherent change>

## Validation

- `<command>`

## Notes

<Launch safeguards, follow-ups, or reviewer context>
```

Use a concise conventional title under 72 characters. Write the body to a
temporary Markdown file and pass it with `--body-file`.

Create:

```powershell
gh pr create --base main --title "<type>: <summary>" --body-file <path>
```

Update:

```powershell
gh pr edit <number> --title "<type>: <summary>" --body-file <path>
```

Describe the current PR as a whole, not as an incremental changelog. Never add
agent attribution, merge automatically, request reviewers, alter repository
settings, or enable Pages unless explicitly asked. Report the PR URL.
