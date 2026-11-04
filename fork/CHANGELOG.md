# Fork changelog — 519lab/opencode

Changes specific to this fork. Upstream's own changes are in `CHANGELOG.md` and upstream releases.

## [Unreleased]

### Changed

- **Synced to upstream opencode v2** (#22). Upstream replaced its `dev` branch with the v2 rewrite on
  2026-10-10. The fork now matches upstream `dev` exactly, replacing the 1.18.x codebase.
- **Dropped the v1-only guided custom OpenAI-compatible provider setup** (#2). Its code paths don't
  exist in v2. v2 has no equivalent either: `/connect` has no "Other" option, and adding a plain
  OpenAI-compatible endpoint means editing config by hand. It will be rebuilt, probably as a plugin.

### Fixed

- **Crafted `data:` URLs could hang the server** (#24). The data-URL parser backtracked exponentially on a long
  run of `;`. 38 characters blocked a Node runtime for 20 seconds, and Bun stalled ~260 ms per parse. Inputs
  come from model, tool and MCP content. Parsing is now linear and accepts the same URLs. Same fix as pending
  upstream anomalyco/opencode#60715, applied now.

### Infrastructure

- **Fork-only CI** (`fork-check.yml`). Lint, typecheck and Linux unit tests on GitHub-hosted runners.
  Upstream's workflows stay unmodified and are disabled on the fork (ADR-002).
- Closed superseded v1 PRs #12, #14–#17 and #20. Upstream's e2e job still pins Node 24.15, which is
  affected by CVE-2026-111497; this is tracked in #21. Fork CI uses Node 24.x ≥ 24.22.1.

### Docs

- Added `CLAUDE.md`, `fork/DECISIONS.md` (ADR-001 soft fork + plugins, ADR-002 fork CI) and this changelog.
