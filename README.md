# Gemini

Gemini is the Hack Club Android YSWS website, built with Next.js.

## Development

Use Bun 1.4.2 (the package manager and runtime):

```bash
bun install --frozen-lockfile
bun run dev
```

Open http://localhost:3000. Required server environment variables:

- `AIRTABLE_API_KEY`: Airtable token with access to the program base.
- `AIRTABLE_BASE_ID`: program base ID.

## Public gallery and privacy

The homepage and gallery use `/api/projects`. `/api/submission` is also public
and returns the same sanitized project data; neither route requires an API
secret. Only records from the `Granted` view are shown. The server serializes
an explicit allowlist of public fields: description, GitHub username, code URL,
playable URL, and screenshot URLs. Legal names, Slack IDs, location fields,
coordinates, and attachment metadata are never returned. Gallery titles use
the public GitHub username, with an "Android app" fallback if it is absent.

Optional fields are read from returned records rather than specified in the
Airtable query, so bases without those fields still load. The full Airtable
record remains on the server; it is never serialized to the browser.

The email signup `/api/submit` remains public and write-only.

## Tooling

Linting uses Oxlint with native TypeScript, React, Next.js, and accessibility
rules. Next.js is kept on the latest 15.x release. TypeScript is kept on the
latest compatible 6.x release because Next.js 15 requires the JavaScript
compiler API removed in TypeScript 7. Tailwind 4 uses its PostCSS adapter
and explicitly loads the existing theme configuration.

The PostCSS and Sharp overrides keep Next.js transitive dependencies patched.

## Checks and production

```bash
bun run test
bun run typecheck
bun run lint
bun run build
bun run start
```

Commit `bun.lock` when dependencies change. Deployment installs should use
`bun install --frozen-lockfile` and `bun run build`; self-hosted servers should
start with `bun run start`. These scripts explicitly run Next.js under Bun.

The PII fix must be deployed before reopening Gemini. Purge any previously
cached `/api/submission` responses at the hosting/CDN layer when deploying;
the new handlers send `Cache-Control: no-store`.
