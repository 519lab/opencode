# Fork decisions (ADRs)

## ADR-001 — Soft fork that tracks upstream; new features ship as plugins (2026-11-04)

**Context.** We want a multi-provider orchestration feature: a lead model splits a task, sub-agents on
up to three providers each work in their own git worktree, and the results merge into one task
branch. We considered a hard fork for this. Upstream anomalyco/opencode moves fast (1,806 commits in
the 30 days before this decision; the fork was 6,107 commits behind). The codebase is large, and
upstream had just replaced `dev` with a v2 rewrite.

**Decision.** This repo stays a soft fork that tracks upstream `dev`. The orchestrator is a
separate opencode plugin (`519lab/consort`) on upstream's v2 plugin API. v2 plugins get session
create/prompt/switchModel/interrupt, a worktree API, tool registration and a session retry hook.
Any other new capability also goes into a plugin where the plugin API allows it.

**Consequences.** Upstream provider and model updates and bug fixes keep arriving with no effort on
our side. Fork-only edits to upstream files are kept close to zero so syncs stay cheap. Local coding
standards apply to code we write, not to upstream code. A hard fork remains possible later if a
feature needs core changes upstream rejects.

## ADR-002 — Fork CI: upstream workflows verbatim + disabled; one fork-only workflow (2026-11-04)

**Context.** Upstream reorganized CI in v2 (`check-*`, `bot-*`, `triage-*`, `deploy-*`, `release-*`).
It runs on blacksmith runners, which this public fork can't use. Rewriting runner labels in
upstream's files conflicted on every sync. Upstream's `triage-*` workflows have no
`github.repository` guard and would act on our PRs.

**Decision.** Keep upstream's workflows byte-for-byte and disable them in repo settings. The fork's
CI is `.github/workflows/fork-check.yml`, on GitHub-hosted runners: lint, typecheck, Linux unit
tests and generated-code checks.

**Consequences.** No workflow conflicts on sync. After each sync, manually diff `fork-check.yml`
against upstream's `check` and `unit` jobs and disable any new upstream workflow. Not covered for
now: Windows unit tests (intermittent git/fs timeouts on GitHub-hosted Windows during the v1 era),
the build and e2e jobs, and the package-pack verifications. Add them back when needed.
