# CLAUDE.md — 519lab/opencode (fork)

As of 2026-11-04. This is a **soft fork** of [anomalyco/opencode](https://github.com/anomalyco/opencode),
on upstream's **v2** codebase (upstream promoted v2 to `dev` on 2026-10-10). Its job is to track
upstream closely: fix bugs, prepare upstream contributions, and test against the latest code. New
features live **outside** this repo as opencode plugins (e.g. `519lab/consort`), not as fork-only
core changes. See `fork/DECISIONS.md` for why.

`AGENTS.md` is upstream's style guide and applies to all code here. Before opening anything upstream,
read `CONTRIBUTING.md` and `.github/pull_request_template.md` (issue first, design discussion first
for features).

## Rules

- **Don't modify upstream files for fork-only reasons.** Every edit to an upstream file becomes a
  merge conflict on every sync. Upstream-file edits are only for fixes that are headed upstream.
- **Fork-only files** (safe, never conflict): `CLAUDE.md`, `fork/**`, `.github/workflows/fork-check.yml`.
  Upstream owns `CHANGELOG.md` — the fork's changelog is `fork/CHANGELOG.md`.
- Don't refactor upstream code to local style conventions; apply them to code written here.

## Branches

- `dev` — integration branch and GitHub default (upstream's name for it; kept so syncs stay
  trivial). Every PR targets `dev`.
- `main` — promotions only (PR from `dev`, merge commit or fast-forward, never squash). Created from
  `dev` once the v2 sync (#22) has merged.
- Branch names: `<type>/<kebab-summary>`. Conventional Commits with a scope.

## Commands (run from repo root unless noted)

- Install: `bun install` (bun version must match `packageManager` in `package.json`, currently 1.4.4)
- Run from source: `bun run dev` (entry: `packages/cli/src/index.ts`)
- Lint + typecheck (same as the pre-push hook): `bun run check`
- Tests: never from root (`bun run test` at root intentionally fails). Run per package:
  `cd packages/<pkg> && bun run test`, or `bun turbo test --filter=<package-name>`.
- Workflow lint: `actionlint .github/workflows/fork-check.yml`

## CI

- `fork-check.yml` is the fork's CI: lint + typecheck and Linux unit tests on GitHub-hosted runners.
  The repo is public, so self-hosted runners are not available.
- Fork-only steps that upstream's runner images make unnecessary: `Install ripgrep` (core's search
  tests need `rg` on PATH and forbid network access). Keep them when porting upstream step changes.
- Upstream's workflows are kept verbatim and **disabled** in repo Actions settings. They target
  upstream's blacksmith runners, and the `triage-*` workflows have no repository guard.

## Syncing upstream

1. `git fetch upstream && git switch -c chore/sync-upstream-<date> dev && git merge upstream/dev`
2. Resolve conflicts. Upstream wins unless a fork fix is still needed.
3. `bun install && bun run check`. After a large upstream restructure, untracked build output left in
   packages upstream deleted can break lint: `git ls-files -o --directory --exclude-standard` shows them.
4. Diff upstream's `check.yml` `check` job and `check-test.yml` `unit` job against `fork-check.yml`
   and port any step changes.
5. After merge, disable any newly added upstream workflow (repo setting; a maintainer runs it):
   ```sh
   gh workflow list --all -R 519lab/opencode --json path,state --jq '.[] | select(.state=="active" and (.path|startswith(".github/workflows/")) and .path!=".github/workflows/fork-check.yml") | .path | ltrimstr(".github/workflows/")' | xargs -I{} gh workflow disable {} -R 519lab/opencode
   ```
   Then confirm only `fork-check` (plus GitHub's dynamic Dependabot/CodeQL) is active.
6. Add a `fork/CHANGELOG.md` entry.
