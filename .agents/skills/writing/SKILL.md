---
name: writing
description: Draft, review, or edit prose anywhere in this repository, including website copy, blog posts, project write-ups, metadata, résumé text, and technical documentation. Use when a request concerns wording, structure, tone, citations, or Markdown conventions. Enforce public/private publication boundaries, keep reviews read-only, and make broad authorship changes only when the user explicitly requests them.
---

# Writing

Treat the user's text and requested scope as authoritative.

## Match the requested scope

- Keep reviews, audits, research, comparisons, and suggestions read-only.
- Apply a requested correction directly when its scope is clear. Do not require
  another approval for the same change.
- Keep narrow edits narrow. Do not add adjacent copy-editing, restructuring, or
  stylistic cleanup without permission.
- Draft, rewrite, restructure, or broadly copy-edit only when the user explicitly
  asks for that level of authorship.
- When a substantive choice would change the meaning, argument, or public
  impression in a way the request does not settle, explain the alternatives and
  ask before choosing.

## Preserve meaning and context

- Read enough surrounding material to understand the artifact's purpose and the
  role of the affected passage. Read the whole artifact before substantive
  changes to its structure or argument.
- Preserve established facts, terminology, chronology, uncertainty, and
  attribution unless the user asks to change them.
- Write for a reader who has not seen the prompt, earlier drafts, or editorial
  discussion. Do not put revision history or agent reasoning into published
  prose.
- Prefer concrete statements over filler. Do not invent experience, motivation,
  results, sources, or personal details.

## Respect publication boundaries

- Treat every tracked repository file and generated site artifact as public
  unless the repository explicitly identifies it as private.
- Put only durable information intended for the artifact's actual public readers
  into public files. Do not use public prose as a scratchpad or operational
  handoff.
- Never publish setup status, unfinished checklists, account-console steps,
  credential or token handling, deployment handoff notes, private planning,
  debugging notes, prompt or conversation context, or instructions meant only
  for the current user.
- Give temporary or user-specific operational instructions in chat. Store them
  outside the public repository only when the user explicitly requests a private
  maintainer artifact.
- Before writing to a public artifact, ask whether the text will remain
  appropriate and useful to an unknown reader after the current task and setup
  are complete. If not, do not write it there.
- If an artifact's audience or publication status is unclear, stop and ask
  before writing.

## Match the artifact

For public-facing site prose, use a direct, understated personal voice. Prefer
plain language, specific facts, and honest limitations. Avoid marketing
language, résumé-speak, slogans, forced warmth, inflated claims, and
self-consciously clever phrasing.

For technical documentation, optimize for accurate instructions, clear scope,
and easy maintenance. Keep commands and paths verifiable and avoid duplicating
facts already defined authoritatively in configuration or source code.

For résumé text, keep claims concise, factual, and supportable. Do not inflate
responsibility or outcomes.

## Repository writing conventions

- Author blog posts as `.svx` files through mdsvex with `title`, `description`,
  and an ISO `YYYY-MM-DD` `date` in frontmatter.
- Let the blog route render the page title. Use `##` for top-level post sections
  and `###` for nested sections.
- Use ordinary Markdown for prose, links, lists, and footnotes.
- In `.svx` source, use ASCII `--` for a rendered en dash and `---` for a rendered
  em dash rather than literal Unicode dash characters.
- Keep paper citations in the prose as Markdown links. Prefer directly relevant
  primary sources and verify that they support the associated claim.
- Use numeric footnotes in source order (`[^1]`, `[^2]`) for definitions,
  calculations, qualifications, or useful detail that would interrupt the main
  text. Do not move paper citations into footnotes.
- Keep line wrapping consistent with Prettier.

## Apply and verify edits

1. Re-read the target immediately before editing so newer user work is
   preserved.
2. Use the smallest coherent patch for the approved scope.
3. Inspect the diff and confirm that unrelated wording did not change.
4. Run Prettier in check mode on affected prose files.
5. Run the narrowest relevant repository checks from `AGENTS.md` when the edit
   affects parsed content, metadata, rendering, or behavior.
6. Report the scope actually changed and distinguish remaining suggestions from
   implemented work.
