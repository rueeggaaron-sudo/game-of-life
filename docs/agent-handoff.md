# Agent handoff

## Local validation

Use Node.js 22.12 or 24; the verified local reference is Node.js 22.23.4.
Follow the central [GIT_HANDOFF.md](https://github.com/rueeggaaron-sudo/orchestrator/blob/main/GIT_HANDOFF.md).
Install the root and `game-of-life/` packages separately with
`npm ci --ignore-scripts`. The root package has a `postinstall` that invokes a
second `npm install`, so lifecycle scripts must stay disabled during clean
install. Run `npm test -- --run` from `game-of-life/`, and `npm run lint` plus
`npm run build` from the repository root.

The root `test:e2e` script currently has no committed Playwright spec files;
do not report it as a passing gate. Run `npm audit --audit-level=low` in both
package directories and report its findings separately. On 2026-10-23 both
audits returned findings (root: one moderate; app: 24 across low through
critical), so security readiness remained open at that point. No dependency changes were made
as part of establishing this local validation contract.

## Historical local-CI candidate

The local-CI documentation candidate is based on `43a3d4e71e9bd85c93a30eb80133bd73755c0c2f`.
Its exact command receipts and lockfile hashes are stored outside the checkout
at `/private/tmp/agency-ci-proof-20261023/game-of-life.json`.

## Dependency remediation — 2026-10-24

Owner branch: `codex/dependency-security-20261024`, based on main
`9b11426f4c1e7bd0ae36867329d20a2a20b1c8d5` (local-CI documentation PR #33).
Refresh both independent lockfiles within existing manifest ranges using
`npm audit fix --package-lock-only --ignore-scripts`, without force or overrides.
Both fflate lines are patched (0.8.3 and 0.6.11); the app resolves Vite 7.3.7,
Vitest/mocker 4.1.12, esbuild 0.28.2 and the other affected transitive tooling.
Application source, manifests, workflows and provider settings are unchanged.

Validation uses Node 24.22.1/npm 11.19.1, matching the deployed Node 24 major.
Both `npm ci --ignore-scripts --no-audit --no-fund` installations and
`npm ls --all --json` checks passed. Fresh root and app
`npm audit --audit-level=low --json` both report zero vulnerabilities.
All 16 unit tests, root lint and one root production build passed.
The existing large-chunk build warning remains. A bounded fflate check verifies
valid ZIP roundtrips and rejects two malformed ZIP64 variants in all four
installed copies. A headless Playwright check of the built app passed intro,
2D step, 3D WebGL switch, return to 2D and clear, without page errors.
This smoke check does not create a committed E2E suite or claim exhaustive
platform/advisory exploit coverage. Known vulnerable resolutions are removed;
future advisory updates still require normal audits.

Detailed command logs and scripts are retained in the local Codex Security
artifact collection `artifacts/dependency-fix-20261024/` for this checkout.
Root README and app README were checked; their gate instructions remain valid.
Release plan: one final independent exact-head review, one bundled PR push,
regular protected merge, at most one automatic Preview and Production, no
retries or provider-setting changes. Check exact deployment SHAs/READY and
production alias HTTP after merge; record the receipt outside Git to avoid
a documentation-only deployment round.
