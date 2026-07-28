---
name: commit
description: Create scoped conventional commits from approved local changes, validate them, and push. Use only when the user explicitly asks to commit, invokes /commit or $commit, or clearly asks to ship approved work.
---

# Commit Protocol

Commit only changes that belong to the approved task. Preserve unrelated user
or agent work, including already staged changes.

A commit authorization always includes push authorization. Unless the user
explicitly says not to push or to keep the commit local, this workflow is not
complete until the current branch has been pushed successfully or a concrete
push failure has been reported.

## Preconditions

1. Confirm that `.git` exists. If it does not, stop. Never initialize the
   repository from this skill.
2. Read `AGENTS.md`.
3. Run:

```powershell
git status --short --untracked-files=all
git diff
git diff --cached
```

Before the first commit, inspect every untracked path. Do not stage environment
files, tokens, account data, local agent state, build output, or unexpected
personal material. Surface uncertain files to the user instead of guessing.

## Scope and validate

Group the approved work into self-contained thematic commits. Format only the
files in scope when possible, then run the narrowest checks from `AGENTS.md`.
Use `pnpm run validate` for a broad site or configuration change.

Do not hide failures with `--no-verify`. Fix failures caused by the scoped work.
Report unrelated failures without absorbing them.

## Stage and inspect

Stage explicit paths. Avoid `git add .`, `git add -A`, and other broad staging
for a shared or unaudited tree.

After staging each group, run:

```powershell
git diff --cached --stat
git diff --cached
```

Confirm that the staged diff contains only the intended files and no secrets or
generated build output.

## Commit

Use a lowercase conventional prefix:

- `feat:` new user-visible functionality
- `fix:` corrected behavior
- `refactor:` structural change without intended behavior change
- `chore:` tooling, dependencies, CI, or repository configuration
- `docs:` prose or agent guidance
- `test:` test-only changes

Keep the subject under 72 characters and focused on why. Add a body when the
motivation or non-obvious behavior needs explanation. Use plain ASCII in commit
messages. Never add co-author, generated-by, or agent attribution.

## Push

After all requested commits succeed, always push the current branch:

```powershell
git push
```

If the branch has no upstream:

```powershell
git push -u origin HEAD
```

Do not wait for a separate push request and do not ask whether to push. The only
exception is an explicit instruction not to push or to keep the commit local.

Never force-push. If the remote advanced, fetch and inspect the divergence.
Do not rebase, pull, reset, or stash shared work without explicit coordination.

Report the commit hashes, subjects, validation run, and push result.
