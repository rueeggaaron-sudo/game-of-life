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
critical), so security readiness remains open. No dependency changes were made
as part of establishing this local validation contract.

## Current candidate

The local-CI documentation candidate is based on `43a3d4e71e9bd85c93a30eb80133bd73755c0c2f`.
Its exact command receipts and lockfile hashes are stored outside the checkout
at `/private/tmp/agency-ci-proof-20261023/game-of-life.json`.
