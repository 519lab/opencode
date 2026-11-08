# Fork changelog — 519lab/opencode

Changes specific to this fork. Upstream's own changes are in `CHANGELOG.md` and upstream releases.

## [Unreleased]

### Changed

- **Updated to upstream dev `fe0a88ce3f` (2026-11-08)**, incorporating 406 upstream commits
  since the previous sync. Includes worktree CLI runs, shared MCP connections, plugin UI
  extensions, and session reliability fixes. Retained the data-URL security fix (#24) and
  minimatch update; accepted upstream's removal of the legacy Console workspace.

- **Synced to upstream opencode v2** (#22). Upstream replaced its `dev` branch with the v2 rewrite on
  2026-10-10. The fork now matches upstream `dev` exactly, replacing the 1.18.x codebase.
- **Dropped the v1-only guided custom OpenAI-compatible provider setup** (#2). Its code paths don't
  exist in v2. v2 has no equivalent either: `/connect` has no "Other" option, and adding a plain
  OpenAI-compatible endpoint means editing config by hand. It will be rebuilt, probably as a plugin.

### Fixed

- **Isolated server tests from developer credentials** (#32). Legacy-auth migration could
  import host credentials into test databases and expose them in assertion output. Server
  tests now reuse Core's isolated runner while retaining their five-second timeout.

- **Restored frozen dependency installs** (#31). Dependency updates changed manifests without
  updating `bun.lock`, stopping both CI jobs before any checks ran. Regenerated the lockfile
  with the pinned Bun version.

- **Crafted `data:` URLs could hang the server** (#24). The data-URL parser backtracked exponentially on a long
  run of `;`. 38 characters blocked a Node runtime for 20 seconds, and Bun stalled ~260 ms per parse. Inputs
  come from model, tool and MCP content. Parsing is now linear and accepts the same URLs. Same fix as pending
  upstream anomalyco/opencode#60715, applied now.

### Infrastructure

- **Fork CI runs on GitHub-hosted runners.** `fork-check.yml` uses `ubuntu-24.04` for lint,
  typecheck, unit tests, and the docs build. Not blacksmith, and not the org's skynet runners:
  those are private-only, and this repo is public. Upstream workflows stay disabled because they
  request blacksmith runners.
- Closed superseded v1 PRs #12, #14–#17 and #20. Upstream's e2e job still pins Node 24.15, which is
  affected by CVE-2026-111497; this is tracked in #21. Fork CI uses Node 24.x ≥ 24.22.1.

### Docs

- Aligned fork branch and sync instructions with `AGENTS.md`; documented the lockfile
  requirement that prevents dependency updates from stopping CI before checks (#31).
- Added `CLAUDE.md`, `fork/DECISIONS.md` (ADR-001 soft fork + plugins, ADR-002 fork CI) and this changelog.
